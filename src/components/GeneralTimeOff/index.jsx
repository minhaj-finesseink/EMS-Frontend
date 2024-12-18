/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Input, Select, Radio, Button, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import {
  addGeneralTimeOff,
  getGeneralTimeOff,
} from "../../redux/GeneralTimeOff/generalTimeOff.action";
import "./style.css";

const { Option } = Select;

const GeneralTimeOff = (props) => {
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

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            {/* Policy Name Input */}
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

            {/* Code Input */}
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

            {/* Type Select */}
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

            {/* Units Radio */}
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

            {/* Per Radio */}
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

            {/* Remove Row Button */}
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

      {/* Add Policy Button */}
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
    </Form>
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
