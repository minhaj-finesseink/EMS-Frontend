/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEmployee } from "../../redux/Add-employee/employee.action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const { Option } = Select;

function AddEmployee(props) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    department: "",
    employeeType: "",
    email: "",
    phoneNumber: "",
    employementStartDate: "",
    idNumber: "",
  });
  // const [accountId, setAccountId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date, dateString) => {
    setFormValues({
      ...formValues,
      employementStartDate: dateString,
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

  // useEffect(() => {
  //   if (props.loginData?.loginResponse) {
  //     const loginData = props.loginData.loginResponse;
  //     setAccountId(loginData.user.accountId); // Set accountId from loginData
  //   }

  //   if (props.registerData?.registerResponse) {
  //     const registerData = props.registerData.registerResponse;
  //     setAccountId(registerData.user.accountId); // Set accountId from registerData
  //   }
  // }, [props.loginData, props.registerData]);

  const handleSubmit = () => {
    props.addEmployee({
      accountId: userInfo.accountId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      departmentName: formValues.department,
      employeeType: formValues.employeeType,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      employementStartDate: formValues.employementStartDate,
      idNumber: formValues.idNumber,
      homeEmail: "",
    });
  };

  useEffect(() => {
    if (props.employeeData.addEmployeeResponse) {
      const response = props.employeeData.addEmployeeResponse;

      if (response.success) {
        // Show success message
        toast.success("Employee added successfully!");

        // Close the modal after 3 seconds
        setTimeout(() => {
          props.onClose();
        }, 3000);
      } else {
        // Handle error response
        toast.error(response.message || "Failed to add employee!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Reset the response to prevent duplicate notifications
      props.employeeData.addEmployeeResponse = null;
    }
  }, [props.employeeData.addEmployeeResponse, props.onClose]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
        <Form.Item
          label="Employement Start Date"
          name="employementStartDate"
          rules={[
            { required: true, message: "Please enter employement start date!" },
          ]}
        >
          <DatePicker
            name="employementStartDate"
            value={formValues.employementStartDate}
            onChange={handleDateChange}
            placeholder="Select start date"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="ID number"
          name="idNumber"
          rules={[
            { required: true, message: "Please enter employee ID number!" },
          ]}
        >
          <Input
            name="idNumber"
            value={formValues.idNumber}
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
  employeeData: state.addEmployee,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addEmployee: (values) => dispatch(addEmployee(values)),
});

AddEmployee.propTypes = {
  addEmployee: PropTypes.func,
  employeeData: PropTypes.object,
  loginData: PropTypes.object,
  registerData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);
