/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Input, Select, Button, Space, Table, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import {
  addGeneralTimeOff,
  getGeneralTimeOff,
} from "../../redux/GeneralTimeOff/generalTimeOff.action";
import "./style.css";

const GeneralTimeOff = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(""); // Tracks the currently editing row
  const [selectedPolicyType, setSelectedPolicyType] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const handleEdit = (record) => {
    setEditingKey(record.key); // Set the row to editing mode
  };

  const handleSave = (key) => {
    setEditingKey(""); // Exit editing mode after saving

    // Find the record being edited
    const editedRecord = data.find((item) => item.key === key);

    // Validate the fields (leavePolicy and code)
    if (!editedRecord.leavePolicy || !editedRecord.code) {
      toast.error("Leave Policy and Code are required!");
      return; // Do not save if validation fails
    }

    // If validation passes, collect all the data
    const allData = data.map((item) => ({
      leavePolicy: item.leavePolicy,
      code: item.code,
      type: item.type,
      units: item.units,
      selectUnitsPer: item.selectUnitsPer,
    }));

    const payload = {
      userId: userInfo._id,
      companyId: userInfo.companyId,
      timeOff: allData.map((x) => ({
        policyName: x.leavePolicy,
        policyCode: x.code,
        policyType: x.type,
        units: x.units,
        per: x.selectUnitsPer,
      })),
    };
    props.addGeneralTimeOff(payload);
  };

  const handleChange = (key, field, value) => {
    const updatedData = data.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleDelete = (key) => {
    const updatedData = data.filter((item) => item.key !== key);
    setData(updatedData);
  };

  const columns = [
    {
      title: "",
      dataIndex: "key",
      key: "number",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => <div>{icon}</div>,
    },
    {
      title: "Leave Policy",
      dataIndex: "leavePolicy",
      key: "leavePolicy",
      sorter: (a, b) => a.leavePolicy.localeCompare(b.leavePolicy),
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            value={record.leavePolicy}
            onChange={(e) =>
              handleChange(record.key, "leavePolicy", e.target.value)
            }
            style={{
              width: "120px",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              display: "flex",
              alignItems: "center",
              textWrapMode: "nowrap",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            value={record.code || undefined}
            onChange={(e) => handleChange(record.key, "code", e.target.value)}
            style={{
              width: "100px",
            }}
            placeholder="Enter code"
          />
        ) : (
          <div
            style={{
              width: "100px",
              display: "flex",
              alignItems: "center",
              textWrapMode: "nowrap",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (text, record) => {
        return isEditing(record) ? (
          <Select
            value={record.type || undefined}
            onChange={(value) => handleChange(record.key, "type", value)}
            style={
              {
                // width: "85px", // Adjust width as needed
              }
            }
            placeholder="Select policy type"
          >
            <Select.Option value="Paid">Paid</Select.Option>
            <Select.Option value="Unpaid">Unpaid</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              // width: "85px", // Adjust width as needed
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap", // Ensures the text doesn't wrap
            }}
          >
            {text} {/* This will display the text in non-editing mode */}
          </div>
        );
      },
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      sorter: (a, b) => a.units.localeCompare(b.units),
      render: (text, record) => {
        return isEditing(record) ? (
          <Select
            value={record.units || undefined}
            onChange={(value) => handleChange(record.key, "units", value)}
            style={
              {
                // width: "85px", // Adjust width as needed
              }
            }
            placeholder="Select units"
          >
            <Select.Option value="Hours">Hours</Select.Option>
            <Select.Option value="Days">Days</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              // width: "85px", // Adjust width as needed
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap", // Ensures the text doesn't wrap
            }}
          >
            {text} {/* This will display the text in non-editing mode */}
          </div>
        );
      },
    },
    {
      title: "Select units per",
      dataIndex: "selectUnitsPer",
      key: "selectUnitsPer",
      sorter: (a, b) => a.selectUnitsPer.localeCompare(b.selectUnitsPer),
      render: (text, record) => {
        return isEditing(record) ? (
          <Select
            value={record.selectUnitsPer || undefined}
            onChange={(value) =>
              handleChange(record.key, "selectUnitsPer", value)
            }
            style={
              {
                // width: "85px", // Adjust width as needed
              }
            }
            placeholder="Select units per"
          >
            <Select.Option value="Monthly">Monthly</Select.Option>
            <Select.Option value="Yearly">Yearly</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              // width: "85px", // Adjust width as needed
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap", // Ensures the text doesn't wrap
            }}
          >
            {text} {/* This will display the text in non-editing mode */}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size={0}>
          {isEditing(record) ? (
            // <Button
            //   icon={<SaveOutlined />}
            //   type="link"
            //   onClick={() => handleSave(record.key)}
            // />
            <Button
              type="primary"
              style={{ padding: "10px" }}
              onClick={() => handleSave(record.key)}
              disabled={
                !record.leavePolicy ||
                !record.code ||
                !record.type ||
                !record.units ||
                !record.selectUnitsPer
              }
            >
              Save
            </Button>
          ) : (
            // <Button
            //   icon={<EditOutlined />}
            //   type="link"
            //   onClick={() => handleEdit(record)}
            // />
            <Button
              type="primary"
              style={{ padding: "10px" }}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {/* <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          /> */}
          <Button
            type="primary"
            danger
            style={{ padding: "10px", marginLeft: "10px" }}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (props.generalTimeOffData.addGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.addGeneralTimeOffResponse;
      if (data.success) {
        toast.success(data.message);
      }
      if (!data.success) {
        toast.error(data.message);
      }
    }
    props.generalTimeOffData.addGeneralTimeOffResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

  useEffect(() => {
    props.getGeneralTimeOff(userInfo.companyId);
  }, []);

  useEffect(() => {
    if (props.generalTimeOffData.getGeneralTimeOffResponse) {
      const response = props.generalTimeOffData.getGeneralTimeOffResponse;

      if (response.data && response.data.length > 0) {
        let data = response.data[0].timeOff;
        const generalTimeOffData = data.map((item, index) => ({
          key: index.toString(), // Generate unique keys
          icon: (
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#E0E5EB",
                borderRadius: "50%",
              }}
            />
          ),
          leavePolicy: item.policyName,
          code: item.policyCode,
          type: item.policyType,
          units: item.units,
          selectUnitsPer: item.per,
        }));
        setData(generalTimeOffData);
      }
    }
  }, [props.generalTimeOffData.getGeneralTimeOffResponse]);

  const handleAddNewPolicy = () => {
    setIsModalVisible(true); // Show modal
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close modal on Cancel
  };

  const createPolicyButton = () => {
    handleModalCancel();
    const newRow = {
      key: Date.now().toString(),
      icon: (
        <div
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#E0E5EB",
            borderRadius: "50%",
          }}
        />
      ),
      leavePolicy: selectedPolicyType,
      code: "",
      type: "",
      units: "",
      selectUnitsPer: "",
    };
    setData([...data, newRow]);
    setEditingKey(newRow.key); // Set the new row as editable
  };

  return (
    <>
      <div>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "20px",
          }}
        >
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            style={{ width: "200px", height: "34px", borderRadius: "28px" }}
          />
          <Button className="add_policy_button" onClick={handleAddNewPolicy}>
            Add leave policy
          </Button>
        </div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 5 }}
          style={{
            border: "1px solid #e5e9ee", // Outer border color
            borderRadius: "14px", // Rounded corners
            overflow: "hidden",
          }}
          bordered={false} // Avoid double borders from Ant Design default styles
          scroll={{ x: "max-content" }}
        />
        {/* Modal  */}
        <Modal
          title="Add Leave Policy"
          visible={isModalVisible}
          footer={null} // Removed footer
          onCancel={handleModalCancel}
          okText="Save"
          cancelText="Cancel"
          className="add_leave_policy_modal"
        >
          <div className="add_leave_policy_modal_content">
            <div className="add_leave_policy_modal_title">
              Select policy type
            </div>
            <div className="add_leave_policy_modal_desc">
              Select your policy type or create custom policy
            </div>
            <Select
              placeholder="Select a policy"
              style={{ width: "100%", height: "46px" }}
              className="add_leave_policy_dropdown"
              value={selectedPolicyType || undefined} // Bind state to the dropdown
              onChange={(value) => setSelectedPolicyType(value)} // Update state on change
            >
              <Select.Option value="Paid Time Off">Paid Time Off</Select.Option>
              <Select.Option value="Vacation">Vacation</Select.Option>
              <Select.Option value="Casual Leave">Casual Leave</Select.Option>
              <Select.Option value="Sick Leave">Sick Leave</Select.Option>
              <Select.Option value="Custom">Custom</Select.Option>
            </Select>
          </div>
          <div className="add_leave_policy_modal_button">
            <Button
              type="primary"
              onClick={createPolicyButton}
              style={{ width: "250px", height: "48px", borderRadius: "22px" }}
              disabled={!selectedPolicyType}
            >
              Create Policy
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  generalTimeOffData: state.generalTimeOff,
});

const mapDispatchToProps = (dispatch) => ({
  addGeneralTimeOff: (values) => dispatch(addGeneralTimeOff(values)),
  getGeneralTimeOff: (values) => dispatch(getGeneralTimeOff(values)),
});

GeneralTimeOff.propTypes = {
  AddGeneralTimeOff: PropTypes.func,
  getGeneralTimeOff: PropTypes.func,
  generalTimeOffData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralTimeOff);
