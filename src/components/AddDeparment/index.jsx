/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { addDepartment } from "../../redux/Add-department/department.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";

const { Option } = Select;

function AddDepartment(props) {
  const [isOtherSelected, setIsOtherSelected] = useState(false); // To track if 'Other' is selected
  const [departmentName, setDepartmentName] = useState(""); // Controlled state for department name
  const [departmentCode, setDepartmentCode] = useState(""); // Controlled state for department code
  const [accountId, setAccountId] = useState(null);

  const handleDepartmentChange = (value) => {
    if (value === "other") {
      setIsOtherSelected(true); // Show custom department input if 'Other' is selected
      setDepartmentName(""); // Clear department name when switching to 'Other'
    } else {
      setIsOtherSelected(false); // Hide the input if it's not 'Other'
      setDepartmentName(value); // Update department name with selected value
    }
  };

  const handleCustomDepartmentChange = (e) => {
    setDepartmentName(e.target.value); // Update department name for custom input
  };

  const handleDepartmentCodeChange = (e) => {
    setDepartmentCode(e.target.value); // Update department code
  };

  // useEffect(() => {
  //   if (props.loginData.loginResponse) {
  //     let data = props.loginData.loginResponse;
  //     // console.log("add company login data", data.user.accountId);
  //     setAccountId(data.user.accountId);
  //   }
  // }, [props.loginData]);

  useEffect(() => {
    if (props.loginData?.loginResponse) {
      const loginData = props.loginData.loginResponse;
      setAccountId(loginData.user.accountId); // Set accountId from loginData
    }

    if (props.registerData?.registerResponse) {
      const registerData = props.registerData.registerResponse;
      setAccountId(registerData.user.accountId); // Set accountId from registerData
    }
  }, [props.loginData, props.registerData]);

  const handleSubmit = () => {
    props.addDepartment({
      accountId: accountId,
      departmentName: departmentName,
      departmentCode: departmentCode,
    });
  };

  return (
    <div>
      {/* Description */}
      <div>
        <p style={{ margin: 0 }}>
          Help the company organize employees into functional units or teams for
          better management.
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: "600px", margin: "auto", padding: "10px 20px 0 0" }}
      >
        {/* Department Name */}
        <Form.Item
          label="Department Name"
          name="departmentName"
          rules={[{ required: true, message: "Please select a department!" }]}
        >
          <Select
            placeholder="Select Department"
            value={isOtherSelected ? "other" : departmentName}
            onChange={handleDepartmentChange}
          >
            <Option value="sales">Sales</Option>
            <Option value="hr">HR</Option>
            <Option value="it">IT</Option>
            <Option value="finance">Finance</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Custom Department Name (appears when 'Other' is selected) */}
        {isOtherSelected && (
          <Form.Item
            label="Custom Department Name"
            name="customDepartment"
            rules={[
              {
                required: true,
                message: "Please enter a custom department name!",
              },
            ]}
          >
            <Input
              placeholder="Enter custom department name"
              value={departmentName}
              onChange={handleCustomDepartmentChange}
            />
          </Form.Item>
        )}

        {/* Department Code */}
        <Form.Item label="Department Code (optional)" name="departmentCode">
          <Input
            placeholder="Enter department code"
            value={departmentCode}
            onChange={handleDepartmentCodeChange}
          />
        </Form.Item>

        {/* Register Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Finish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  departmentData: state.addDepartment,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addDepartment: (values) => dispatch(addDepartment(values)),
});

AddDepartment.propTypes = {
  login: PropTypes.func,
  addDepartment: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartment);
