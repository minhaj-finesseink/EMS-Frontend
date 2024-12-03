/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import { addEmployee } from "../../redux/Account-setup/Add-employee/employee.action";

const { Option } = Select;

function AddEmployee(props) {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    department: "",
    employeeType: "",
    email: "",
    phoneNumber: "",
  });
  const [accountId, setAccountId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (value, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: value,
    });
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
    props.addEmployee({
      accountId: accountId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      departmentName: formValues.department,
      employeeType: formValues.employeeType,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
    });
  };

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: "600px", margin: "auto", padding: "10px 20px 0 0" }}
      >
        {/* Employee Name */}
        <Form.Item
          label="Employee First Name"
          name="employeeFirstName"
          rules={[
            {
              required: true,
              message: "Please input your employee first name!",
            },
          ]}
        >
          <Input
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Employee Last Name"
          name="employeeLastName"
          rules={[
            {
              required: true,
              message: "Please input your employee last name!",
            },
          ]}
        >
          <Input
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
          />
        </Form.Item>
        {/* Department Name */}
        <Form.Item
          label="Department Name"
          name="departmentName"
          rules={[{ required: true, message: "Please select a department!" }]}
        >
          <Select
            placeholder="Select Department"
            onChange={(value) => handleSelectChange(value, "department")}
          >
            <Option value="sales">Sales</Option>
            <Option value="hr">HR</Option>
            <Option value="it">IT</Option>
            <Option value="finance">Finance</Option>
            <Option value="other">Other</Option> {/* 'Other' option */}
          </Select>
        </Form.Item>

        {/* Employee Type */}
        <Form.Item
          label="Employee Type"
          name="employeeType"
          rules={[
            { required: true, message: "Please select a employee type!" },
          ]}
        >
          <Select
            placeholder="Select Employee Type"
            onChange={(value) => handleSelectChange(value, "employeeType")}
          >
            <Option value="fullTime">Full Time</Option>
            <Option value="partTime">Part Time</Option>
            <Option value="temporary">Temporary</Option>
          </Select>
        </Form.Item>
        {/* Employee Email and Phone */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Please input phone number!" }]}
        >
          <Input
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Email Address"
          name="emailAddress"
          rules={[{ required: true, message: "Please input email address!" }]}
        >
          <Input
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  employeeData: state.AddEmployee,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addEmployee: (values) => dispatch(addEmployee(values)),
});

AddEmployee.propTypes = {
  login: PropTypes.func,
  addEmployee: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);
