/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Input, Select, Radio, Button, Form, Space, Table } from "antd";
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
import FilterIcon from "../../assets/filter-icon.svg";
import "./style.css";

const { Option } = Select;

const GeneralTimeOff = (props) => {
  const [data, setData] = useState([
    {
      key: "1",
      icon: (
        <div
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#E0E5EB",
            borderRadius: "50%",
          }}
        />
      ), // Icon placeholder
      leavePolicy: "Paid time off",
      code: "PT",
      type: "Paid",
      units: "Hours",
      selectUnitsPer: "Monthly",
    },
    {
      key: "2",
      icon: (
        <div
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#E0E5EB",
            borderRadius: "50%",
          }}
        />
      ), // Icon placeholder
      leavePolicy: "Vacation",
      code: "VC",
      type: "Paid",
      units: "Hours",
      selectUnitsPer: "Yearly",
    },
  ]);

  const [editingKey, setEditingKey] = useState(""); // Tracks the currently editing row

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

    // console.log("All Data:", allData); // Output all the data to the console or store it in a state
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
    console.log("payload", payload);
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
    // {
    //   title: "Leave policy",
    //   dataIndex: "leavePolicy",
    //   key: "leavePolicy",
    //   sorter: (a, b) => a.leavePolicy.localeCompare(b.leavePolicy),
    // },
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
              width: "100px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100px",
              display: "flex",
              alignItems: "center",
              textWrapMode: "nowrap",
              // padding: "4px 11px",
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
            value={record.code}
            onChange={(e) => handleChange(record.key, "code", e.target.value)}
            style={{
              width: "60px",
            }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              display: "flex",
              alignItems: "center",
              textWrapMode: "nowrap",
              // padding: "4px 11px",
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
            value={record.type}
            onChange={(value) => handleChange(record.key, "type", value)}
            style={{
              width: "85px", // Adjust width as needed
            }}
          >
            <Select.Option value="Paid">Paid</Select.Option>
            <Select.Option value="Unpaid">Unpaid</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              width: "85px", // Adjust width as needed
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
            value={record.units}
            onChange={(value) => handleChange(record.key, "units", value)}
            style={{
              width: "85px", // Adjust width as needed
            }}
          >
            <Select.Option value="Hours">Hours</Select.Option>
            <Select.Option value="Days">Days</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              width: "85px", // Adjust width as needed
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
            value={record.selectUnitsPer}
            onChange={(value) =>
              handleChange(record.key, "selectUnitsPer", value)
            }
            style={{
              width: "85px", // Adjust width as needed
            }}
          >
            <Select.Option value="Monthly">Monthly</Select.Option>
            <Select.Option value="Yearly">Yearly</Select.Option>
          </Select>
        ) : (
          <div
            style={{
              width: "85px", // Adjust width as needed
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
          {/* <Button icon={<EditOutlined />} type="link" />
          <Button icon={<DeleteOutlined />} type="link" danger /> */}
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
      ),
    },
  ];

  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [policyFields, setPolicyFields] = useState([
    {
      id: Date.now(),
      policyName: "",
      code: "",
      type: "Paid",
      units: "Hours",
      per: "Monthly",
    },
  ]);

  // Function to add a new policy row
  const addPolicyField = () => {
    setPolicyFields([
      ...policyFields,
      {
        id: Date.now(),
        policyName: "",
        code: "",
        type: "Paid",
        units: "Hours",
        per: "Monthly",
      },
    ]);
  };

  // Function to remove a policy row
  const removePolicyField = (id) => {
    setPolicyFields(policyFields.filter((field) => field.id !== id));
  };

  // Function to handle input changes for policy
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const updatedFields = policyFields.map((field) =>
      field.id === id ? { ...field, [name]: value } : field
    );
    setPolicyFields(updatedFields);
  };

  // Function to handle select changes
  const handleSelectChange = (value, fieldName, id) => {
    const updatedFields = policyFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: value } : field
    );
    setPolicyFields(updatedFields);
  };

  // Function to handle radio changes
  const handleRadioChange = (value, fieldName, id) => {
    const updatedFields = policyFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: value } : field
    );
    setPolicyFields(updatedFields);
  };

  // Handle form submission
  const handleSubmit = () => {
    const payload = {
      userId: userInfo._id,
      companyId: userInfo.companyId,
      timeOff: policyFields.map((field) => ({
        policyName: field.policyName,
        policyCode: field.code,
        policyType: field.type,
        units: field.units,
        per: field.per,
      })),
    };
    props.addGeneralTimeOff(payload);
  };

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
    props.getGeneralTimeOff(userInfo._id);
  }, []);

  // useEffect(() => {
  //   if (props.leavePolicyData.getLeavePolicyResponse) {
  //     let data = props.leavePolicyData.getLeavePolicyResponse.data[0].policy;
  //     const leavePolicyData = data.map((item) => ({
  //       id: item._id,
  //       policyName: item.policyName,
  //       code: item.policyCode,
  //       type: item.policyType,
  //       units: item.units,
  //       per: item.per,
  //     }));

  //     setPolicyFields(leavePolicyData);

  //     // Set the form fields values dynamically
  //     const formValues = leavePolicyData.reduce((values, field) => {
  //       values[`policyName_${field.id}`] = field.policyName;
  //       values[`code_${field.id}`] = field.code;
  //       values[`type_${field.id}`] = field.type;
  //       values[`units_${field.id}`] = field.units;
  //       values[`per_${field.id}`] = field.per;
  //       return values;
  //     }, {});

  //     // Set form values
  //     form.setFieldsValue(formValues);
  //   }
  // }, [props.leavePolicyData.getLeavePolicyResponse]);

  useEffect(() => {
    if (props.generalTimeOffData.getGeneralTimeOffResponse) {
      const response = props.generalTimeOffData.getGeneralTimeOffResponse;

      if (response.data && response.data.length > 0) {
        let data = response.data[0].timeOff;
        const generalTimeOffData = data.map((item) => ({
          id: item._id,
          policyName: item.policyName,
          code: item.policyCode,
          type: item.policyType,
          units: item.units,
          per: item.per,
        }));

        setPolicyFields(generalTimeOffData);

        // Set the form fields values dynamically
        const formValues = generalTimeOffData.reduce((values, field) => {
          values[`policyName_${field.id}`] = field.policyName;
          values[`code_${field.id}`] = field.code;
          values[`type_${field.id}`] = field.type;
          values[`units_${field.id}`] = field.units;
          values[`per_${field.id}`] = field.per;
          return values;
        }, {});

        // Set form values
        form.setFieldsValue(formValues);
      } else {
        // Handle the case where no leave policies are found
        setPolicyFields([]); // Clear any existing fields
        form.resetFields(); // Reset the form
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalTimeOffData.getGeneralTimeOffResponse]);

  const handleAddNewPolicy = () => {
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
      leavePolicy: "",
      code: "",
      type: "Paid", // Default value
      units: "Hours",
      selectUnitsPer: "Yearly",
    };
    setData([...data, newRow]);
    setEditingKey(newRow.key); // Set the new row as editable
  };

  return (
    <>
      {/* <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {policyFields.map((field) => (
        <div
          key={field.id}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <Form.Item
              name={`policyName_${field.id}`}
              label="Policy Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the policy name!",
                },
              ]}
            >
              <Input
                name="policyName"
                value={field.policyName}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Policy Name"
              />
            </Form.Item>

            <Form.Item
              name={`code_${field.id}`}
              label="Policy Code"
              rules={[
                {
                  required: true,
                  message: "Please enter the policy code!",
                },
              ]}
            >
              <Input
                name="code"
                value={field.code}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Code"
              />
            </Form.Item>

            <Form.Item
              name={`type_${field.id}`}
              label="Policy Type"
              rules={[
                {
                  required: true,
                  message: "Please select a policy type!",
                },
              ]}
            >
              <Select
                value={field.type}
                onChange={(value) =>
                  handleSelectChange(value, "type", field.id)
                }
              >
                <Option value="Paid">Paid</Option>
                <Option value="Unpaid">Unpaid</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={`units_${field.id}`}
              label="Units"
              rules={[
                {
                  required: true,
                  message: "Please select units!",
                },
              ]}
            >
              <Radio.Group
                value={field.units}
                onChange={(e) =>
                  handleRadioChange(e.target.value, "units", field.id)
                }
              >
                <Radio value="Hours">Hours</Radio>
                <Radio value="Days">Days</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name={`per_${field.id}`}
              label="Per"
              rules={[
                {
                  required: true,
                  message: "Please select the unit period!",
                },
              ]}
            >
              <Radio.Group
                value={field.per}
                onChange={(e) =>
                  handleRadioChange(e.target.value, "per", field.id)
                }
              >
                <Radio value="Monthly">Monthly</Radio>
                <Radio value="Yearly">Yearly</Radio>
              </Radio.Group>
            </Form.Item>

            {policyFields.length > 1 && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removePolicyField(field.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}

      {policyFields.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="primary"
            onClick={addPolicyField}
            style={{
              backgroundColor: "#f0c040",
              color: "#000",
              borderRadius: "5px",
              width: "100px",
            }}
          >
            Add Policy +
          </Button>
          <Button type="primary" htmlType="submit" style={{ width: "100px" }}>
            Submit
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="primary"
            onClick={addPolicyField}
            style={{
              backgroundColor: "#f0c040",
              color: "#000",
              borderRadius: "5px",
              width: "100px",
            }}
          >
            Add Policy +
          </Button>
        </div>
      )}
    </Form> */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "20px",
          }}
        >
          {/* <div className="filter_container">
            <div>
              <FilterIcon />
            </div>
            <span>Filter</span>
          </div> */}
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
          // rowClassName={() => "custom-row"}
          // onRow={() => ({
          //   style: {
          //     borderBottom: "1px solid red", // Inner row borders
          //   },
          // })}
        />
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

// import React, { useState } from "react";
// import { Table, Button, Input, Space } from "antd";
// import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";

// const EditableTable = () => {
//   const [data, setData] = useState([
//     {
//       key: "1",
//       leavePolicy: "Paid time off",
//       code: "PT",
//       type: "Paid",
//       units: "Hourly",
//       selectUnitsPer: "Monthly",
//     },
//     {
//       key: "2",
//       leavePolicy: "Vacation",
//       code: "VC",
//       type: "Paid",
//       units: "Hourly",
//       selectUnitsPer: "Yearly",
//     },
//   ]);

//   const [editingKey, setEditingKey] = useState(""); // Tracks the currently editing row

//   const isEditing = (record) => record.key === editingKey;

//   const handleEdit = (record) => {
//     setEditingKey(record.key); // Set the row to editing mode
//   };

//   const handleSave = (key) => {
//     setEditingKey(""); // Exit editing mode after saving
//   };

//   const handleChange = (key, field, value) => {
//     const updatedData = data.map((item) => {
//       if (item.key === key) {
//         return { ...item, [field]: value };
//       }
//       return item;
//     });
//     setData(updatedData);
//   };

//   const handleDelete = (key) => {
//     const updatedData = data.filter((item) => item.key !== key);
//     setData(updatedData);
//   };

//   const columns = [
//     {
//       title: "#",
//       dataIndex: "key",
//       key: "number",
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Leave Policy",
//       dataIndex: "leavePolicy",
//       key: "leavePolicy",
//       render: (text, record) => {
//         return isEditing(record) ? (
//           <Input
//             value={record.leavePolicy}
//             onChange={(e) =>
//               handleChange(record.key, "leavePolicy", e.target.value)
//             }
//           />
//         ) : (
//           text
//         );
//       },
//     },
//     {
//       title: "Code",
//       dataIndex: "code",
//       key: "code",
//       render: (text, record) => {
//         return isEditing(record) ? (
//           <Input
//             value={record.code}
//             onChange={(e) => handleChange(record.key, "code", e.target.value)}
//           />
//         ) : (
//           text
//         );
//       },
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//       render: (text, record) => {
//         return isEditing(record) ? (
//           <Input
//             value={record.type}
//             onChange={(e) => handleChange(record.key, "type", e.target.value)}
//           />
//         ) : (
//           text
//         );
//       },
//     },
//     {
//       title: "Units",
//       dataIndex: "units",
//       key: "units",
//       render: (text, record) => {
//         return isEditing(record) ? (
//           <Input
//             value={record.units}
//             onChange={(e) => handleChange(record.key, "units", e.target.value)}
//           />
//         ) : (
//           text
//         );
//       },
//     },
//     {
//       title: "Select Units Per",
//       dataIndex: "selectUnitsPer",
//       key: "selectUnitsPer",
//       render: (text, record) => {
//         return isEditing(record) ? (
//           <Input
//             value={record.selectUnitsPer}
//             onChange={(e) =>
//               handleChange(record.key, "selectUnitsPer", e.target.value)
//             }
//           />
//         ) : (
//           text
//         );
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (text, record) => (
//         <Space size="middle">
//           {isEditing(record) ? (
//             <Button
//               icon={<SaveOutlined />}
//               type="link"
//               onClick={() => handleSave(record.key)}
//             />
//           ) : (
//             <Button
//               icon={<EditOutlined />}
//               type="link"
//               onClick={() => handleEdit(record)}
//             />
//           )}
//           <Button
//             icon={<DeleteOutlined />}
//             type="link"
//             danger
//             onClick={() => handleDelete(record.key)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Table
//         dataSource={data}
//         columns={columns}
//         rowClassName="editable-row"
//         pagination={false}
//         bordered
//       />
//       <Button
//         type="primary"
//         onClick={() => setData([...data, { key: Date.now(), leavePolicy: "", code: "", type: "", units: "", selectUnitsPer: "" }])}
//         style={{ marginTop: 16 }}
//       >
//         Add Leave Policy
//       </Button>
//     </div>
//   );
// };

// export default EditableTable;
