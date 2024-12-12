/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Radio, Select, Button } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import {
  getUserById,
  userUpdate,
} from "../../redux/Add-employee/employee.action";
import toast from "react-hot-toast";

const { Option } = Select;

function PersonalDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [formValue, setFormValue] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeStartDate: null,
    dob: null,
    sex: "",
    employeeId: "",
    ssn: "",
    phone: "",
    maritalStatus: "",
    taxNumber: "",
    nin: "",
    size: "",
    allergies: "",
    dietary: "",
  });

  useEffect(() => {
    props.getUserById(userInfo._id);
  }, []);

  useEffect(() => {
    if (props.userData) {
      let data = props.userData.user;
      const updatedFormValue = {
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        employeeStartDate: data.employementStartDate
          ? moment(data.employementStartDate)
          : null,
        dob: data.dob ? moment(data.dob) : null,
        sex: data.sex || "",
        employeeId: data.idNumber || "",
        phone: data.phoneNumber || "",
        ssn: data.ssn || "",
        maritalStatus: data.maritalStatus || "",
        taxNumber: data.taxNumber || "",
        nin: data.nin || "",
        size: data.size || "",
        allergies: data.allergies || "",
        dietary: data.dietary || "",
      };
      setFormValue(updatedFormValue);
      form.setFieldsValue(updatedFormValue);
    }
  }, [props.userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleDateChange = (date, fieldName) => {
    // Ensure valid moment object
    const momentDate = moment(date);
    if (date && momentDate.isValid()) {
      setFormValue({
        ...formValue,
        [fieldName]: momentDate,
      });
    } else {
      setFormValue({
        ...formValue,
        [fieldName]: null,
      });
    }
  };

  const handleSelectChange = (value, fieldName) => {
    setFormValue({
      ...formValue,
      [fieldName]: value,
    });
  };

  const handleSubmit = () => {
    props.userUpdate({
      userId: userInfo._id,
      firstName: formValue.firstName ? formValue.firstName : "",
      middleName: formValue.middleName ? formValue.middleName : "",
      lastName: formValue.lastName ? formValue.lastName : "",
      employeeStartDate: formValue.employeeStartDate
        ? formValue.employeeStartDate
        : null,
      dob: formValue.dob ? formValue.dob : null,
      sex: formValue.sex ? formValue.sex : "",
      employeeId: formValue.employeeId ? formValue.employeeId : "",
      ssn: formValue.ssn ? formValue.ssn : "",
      phone: formValue.phone ? formValue.phone : "",
      maritalStatus: formValue.maritalStatus ? formValue.maritalStatus : "",
      taxNumber: formValue.taxNumber ? formValue.taxNumber : "",
      nin: formValue.nin ? formValue.nin : "",
      size: formValue.size ? formValue.size : "",
      allergies: formValue.allergies ? formValue.allergies : "",
      dietary: formValue.dietary ? formValue.dietary : "",
    });
    // props.handleTabChange("2");
  };

  // Setting all tab changes and success message in here.
  useEffect(() => {
    if (props.userUpdateData.userUpdateResponse) {
      let data = props.userUpdateData.userUpdateResponse;
      if (data.success) {
        if (props.tabKey === "1") {
          toast.success("Personal Details Updated Successfully!");
          props.handleTabChange("2");
        } else if (props.tabKey === "2") {
          toast.success("Contact Details Updated Successfully!");
          props.handleTabChange("3");
        } else if (props.tabKey === "3") {
          toast.success("Address Details Updated Successfully!");
          props.handleTabChange("4");
        } else if (props.tabKey === "4") {
          toast.success("Education Details Updated Successfully!");
          props.handleTabChange("5");
        } else if (props.tabKey === "5") {
          toast.success("Visa Details Updated Successfully!");
          // props.handleTabChange("5");
        }
        props.userUpdateData.userUpdateResponse = null;
      }
    }
  }, [props.userUpdateData.userUpdateResponse]);

  // console.log("form value", formValue);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid #d9d9d9",
          borderRadius: "5px",
          padding: "20px",
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name!" }]}
        >
          <Input
            name="firstName"
            value={formValue.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
        </Form.Item>

        <Form.Item name="middleName" label="Middle Name">
          <Input
            name="middleName"
            value={formValue.middleName}
            onChange={handleChange}
            placeholder="Enter middle name"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name!" }]}
        >
          <Input
            name="lastName"
            value={formValue.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </Form.Item>

        <Form.Item
          name="employeeStartDate"
          label="Employment Start Date"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker
            name="employeeStartDate"
            value={formValue.employeeStartDate}
            onChange={(date) => handleDateChange(date, "employeeStartDate")}
            style={{ width: "100%" }}
            placeholder="Select start date"
          />
        </Form.Item>

        <Form.Item name="dob" label="Date of Birth">
          <DatePicker
            name="dob"
            value={formValue.dob}
            onChange={(date) => handleDateChange(date, "dob")}
            style={{ width: "100%" }}
            placeholder="Select date of birth"
          />
        </Form.Item>

        <Form.Item
          name="sex"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Radio.Group name="sex" value={formValue.sex} onChange={handleChange}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="employeeId"
          label="Employee ID"
          rules={[{ required: true, message: "Please enter employee ID!" }]}
        >
          <Input
            name="employeeId"
            value={formValue.employeeId}
            onChange={handleChange}
            placeholder="Enter employee ID"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter phone number!" }]}
        >
          <Input
            name="phone"
            value={formValue.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </Form.Item>

        <Form.Item
          name="ssn"
          label="SSN"
          rules={[{ required: true, message: "Please enter SSN!" }]}
        >
          <Input
            name="ssn"
            value={formValue.ssn}
            onChange={handleChange}
            placeholder="Enter SSN"
          />
        </Form.Item>

        <Form.Item
          name="maritalStatus"
          label="Marital Status"
          rules={[{ required: true, message: "Please enter marital status!" }]}
        >
          <Input
            name="maritalStatus"
            value={formValue.maritalStatus}
            onChange={handleChange}
            placeholder="Enter marital status"
          />
        </Form.Item>

        <Form.Item
          name="taxFileNumber"
          label="Tax File Number"
          // rules={[{ required: true, message: "Please enter tax file number!" }]}
        >
          <Input
            name="taxNumber"
            value={formValue.taxNumber}
            onChange={handleChange}
            placeholder="Enter tax file number"
          />
        </Form.Item>

        <Form.Item
          name="nin"
          label="NIN"
          rules={[{ required: true, message: "Please enter NIN!" }]}
        >
          <Input
            name="nin"
            value={formValue.nin}
            onChange={handleChange}
            placeholder="Enter NIN"
          />
        </Form.Item>

        <Form.Item
          name="shirtSize"
          label="Shirt Size"
          // rules={[{ required: true, message: "Please select shirt size!" }]}
        >
          <Select
            value={formValue.size}
            onChange={(value) => handleSelectChange(value, "size")}
            placeholder="Select shirt size"
          >
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
            <Option value="xlarge">X-Large</Option>
          </Select>
        </Form.Item>

        <Form.Item name="allergies" label="Allergies">
          <Input
            name="allergies"
            value={formValue.allergies}
            onChange={handleChange}
            placeholder="Enter allergies (if any)"
          />
        </Form.Item>

        <Form.Item name="dietaryRestrictions" label="Dietary Restrictions">
          <Input
            name="dietary"
            value={formValue.dietary}
            onChange={handleChange}
            placeholder="Enter dietary restrictions (if any)"
          />
        </Form.Item>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button type="primary" htmlType="submit" style={{ width: "100px" }}>
          Continue
        </Button>
      </div>
    </Form>
  );
}

const mapStateToProps = (state) => ({
  userData: state.addEmployee.getUserByIdResponse,
  userUpdateData: state.addEmployee,
});

const mapDispatchToProps = (dispatch) => ({
  getUserById: (values) => dispatch(getUserById(values)),
  userUpdate: (values) => dispatch(userUpdate(values)),
});

PersonalDetails.propTypes = {
  getUserById: PropTypes.func,
  userUpdate: PropTypes.func,
  userData: PropTypes.object,
  userUpdateData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails);
