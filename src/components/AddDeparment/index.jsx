/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import {
  addDepartment,
  getDepartment,
} from "../../redux/Add-department/department.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DepartmentImage from "../../assets/department-image.jpeg";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import "./style.css";

function AddDepartment(props) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [departmentName, setDepartmentName] = useState(""); // Controlled state for department name
  const [departmentCode, setDepartmentCode] = useState(""); // Controlled state for department code
  const [editingKey, setEditingKey] = useState(""); // Tracks the currently editing row

  const isEditing = (record) => record.key === editingKey;

  const handleEdit = (record) => {
    setEditingKey(record.key); // Set the row to editing mode
  };

  const handleSave = (key) => {
    setEditingKey(""); // Exit editing mode after saving
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

  const [data, setData] = useState([]);

  useEffect(() => {
    props.getDepartment(userInfo.companyId);
  }, []);

  useEffect(() => {
    if (props.departmentData.getDepartmentResponse) {
      let data = props.departmentData.getDepartmentResponse.department;
      // console.log("props.departmentData", data);
      const departmentList = data?.department.map((item, index) => ({
        key: index.toString(),
        departmentName: item.departmentName,
        departmentCode: item.departmentCode,
      }));
      setData(departmentList);
    }
  }, [props.departmentData.getDepartmentResponse]);

  // Handle form submission for adding a new department
  const handleAddDepartment = () => {
    if (departmentName) {
      // Add logic for saving department
      setData([
        ...data,
        { key: data.length + 1, departmentName, departmentCode },
      ]);
      setDepartmentName(""); // Clear department name after adding
      setDepartmentCode("");
    }
  };

  const handleSubmit = () => {
    const payload = {
      userId: userInfo._id,
      companyId: userInfo.companyId,
      department: data.map((x) => ({
        departmentName: x.departmentName,
        departmentCode: x.departmentCode,
      })),
    };
    props.addDepartment(payload);
    // console.log(payload);
  };

  useEffect(() => {
    if (props.departmentData.addDepartmentResponse) {
      let data = props.departmentData.addDepartmentResponse;
      // console.log("for toast", data);
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          props.closeDepartmentModal();
        }, 1000);
      }
      props.departmentData.addDepartmentResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.departmentData.addDepartmentResponse]);

  return (
    <div className="department_container">
      <div className="department_image_container">
        <img
          className="department_image"
          src={DepartmentImage}
          alt="Department Image"
        />
      </div>
      <div className="department_table_container">
        <div>
          <div className="department_table_title">
            <div className="department_table_heading">Add departments</div>
            <div className="department_table_desc">
              Enter the department details
            </div>
          </div>
          <div className="department_table">
            {" "}
            <Table
              dataSource={[...data, { key: "new", isNewRow: true }]} // Add a new row for "Add Department"
              columns={[
                {
                  title: "",
                  dataIndex: "key",
                  key: "number",
                  render: (text, record, index) => {
                    return record.isNewRow ? data.length + 1 : index + 1; // Display correct index
                  },
                  className: "department-custom-no-padding",
                },
                {
                  className: "department-custom-no-padding",
                  title: (
                    <div style={{ whiteSpace: "nowrap" }}>Department Name</div>
                  ),
                  dataIndex: "departmentName",
                  key: "departmentName",
                  render: (text, record) => {
                    if (isEditing(record)) {
                      return (
                        <Input
                          placeholder="Enter Name"
                          value={record.departmentName}
                          onChange={(e) =>
                            handleChange(
                              record.key,
                              "departmentName",
                              e.target.value
                            )
                          }
                        />
                      );
                    }
                    if (record.isNewRow) {
                      return (
                        <Input
                          placeholder="Enter Name"
                          value={departmentName} // This value comes from the controlled state
                          onChange={(e) => setDepartmentName(e.target.value)} // Set state when input changes
                        />
                      );
                    }

                    return text;
                  },
                },
                {
                  className: "department-custom-no-padding",
                  title: (
                    <div style={{ whiteSpace: "nowrap" }}>
                      Department Code (optional)
                    </div>
                  ),
                  dataIndex: "departmentCode",
                  key: "departmentCode",
                  render: (text, record) => {
                    if (isEditing(record)) {
                      return (
                        <Input
                          placeholder="Enter Code"
                          value={record.departmentCode}
                          onChange={(e) =>
                            handleChange(
                              record.key,
                              "departmentCode",
                              e.target.value
                            )
                          }
                        />
                      );
                    }
                    if (record.isNewRow) {
                      return (
                        <Input
                          placeholder="Enter Code"
                          value={departmentCode}
                          onChange={(e) => setDepartmentCode(e.target.value)}
                        />
                      );
                    }
                    return text;
                  },
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (text, record) => {
                    if (record.isNewRow) {
                      return (
                        <Button
                          style={{
                            width: "100%",
                            backgroundColor: departmentName
                              ? "#007DC5"
                              : "#E0E5EB",
                            color: "#FFFFFF",
                          }}
                          // type="primary"
                          disabled={!departmentName} // Disable button if departmentName is empty
                          onClick={handleAddDepartment}
                        >
                          Add Department
                        </Button>
                      );
                    }
                    return (
                      <Space size={0}>
                        {isEditing(record) ? (
                          <Button
                            icon={<SaveOutlined />}
                            type="link"
                            onClick={() => handleSave(record.key)}
                          />
                        ) : (
                          <Button
                            icon={<EditOutlined />}
                            type="link"
                            onClick={() => handleEdit(record)}
                          />
                        )}
                        <Button
                          icon={<DeleteOutlined />}
                          type="link"
                          danger
                          onClick={() => handleDelete(record.key)}
                        />
                      </Space>
                    );
                  },
                  className: "department-custom-no-padding",
                },
              ]}
              pagination={{ pageSize: 5 }}
              style={{
                border: "1px solid #e5e9ee",
                borderRadius: "14px",
                overflow: "hidden",
              }}
              bordered={false}
              scroll={{ x: "max-content" }}
            />
          </div>
        </div>
        <div className="department_buttons">
          <Button
            style={{
              width: "100%",
              backgroundColor: "#007DC5",
              color: "#FFFFFF",
              borderRadius: "18px",
              height: "50px",
            }}
            onClick={handleSubmit}
          >
            Finish
          </Button>
          <Button
            style={{
              width: "100%",
              backgroundColor: "#E0E5EB",
              color: "#FFFFFF",
              borderRadius: "18px",
              height: "50px",
            }}
            onClick={props.closeDepartmentModal}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  departmentData: state.department,
});

const mapDispatchToProps = (dispatch) => ({
  addDepartment: (values) => dispatch(addDepartment(values)),
  getDepartment: (values) => dispatch(getDepartment(values)),
});

AddDepartment.propTypes = {
  addDepartment: PropTypes.func,
  getDepartment: PropTypes.func,
  departmentData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartment);
