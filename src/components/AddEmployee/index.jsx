/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { addUser } from "../../redux/User/user.action";
import { getDepartment } from "../../redux/Add-department/department.action";
import toast from "react-hot-toast";

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
  const [departmentList, setDepartmentList] = useState([]);

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

  const handleSubmit = () => {
    props.addUser({
      companyId: userInfo.companyId,
      companyName: userInfo.companyName,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      departmentName: formValues.department,
      employementType: formValues.employeeType,
      email: formValues.email,
      phone: formValues.phoneNumber,
      employmentStartDate: formValues.employementStartDate,
      employeeIdNumber: formValues.idNumber,
    });
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      const response = props.userData.addUserResponse;
      if (response.success) {
        // Show success message
        toast.success("Employee added successfully!");
        setTimeout(() => {
          props.onClose();
        }, 3000);
      } else {
        toast.error(response.message || "Failed to add employee!");
      }
      props.userData.addUserResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.addUserResponse, props.onClose]);

  useEffect(() => {
    props.getDepartment(userInfo._id);
  }, []);

  useEffect(() => {
    if (props.departmentData.getDepartmentResponse) {
      let data = props.departmentData.getDepartmentResponse;
      if (data.success) {
        let department = data.department.department;
        let departmentNames = department.map((dept) => {
          let name = dept.departmentName.toLowerCase().split(" ");
          name = name
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return name;
        });
        setDepartmentList(departmentNames);
      }
    }
  }, [props.departmentData.getDepartmentResponse]);

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
              message: "Enter your employee first name!",
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
              message: "Enter your employee last name!",
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
            {departmentList.map((dept, index) => (
              <Option key={index} value={dept}>
                {dept}
              </Option>
            ))}
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
          rules={[{ required: true, message: "Enter phone number!" }]}
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
          rules={[{ required: true, message: "Enter email address!" }]}
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
          label="Employee ID number"
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
  userData: state.user,
  loginData: state.login,
  registerData: state.register,
  departmentData: state.department,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
  getDepartment: (values) => dispatch(getDepartment(values)),
});

AddEmployee.propTypes = {
  addUser: PropTypes.func,
  getDepartment: PropTypes.func,
  employeeData: PropTypes.object,
  loginData: PropTypes.object,
  registerData: PropTypes.object,
  departmentData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);
