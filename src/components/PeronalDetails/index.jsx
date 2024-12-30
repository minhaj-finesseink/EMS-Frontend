/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Radio, Select, Button, Table } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { getUserById, userUpdate } from "../../redux/User/user.action";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";

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

  const [data, setData] = useState([]);

  const columns = [
    { title: "" },
    { title: "Date" },
    { title: "Visa" },
    { title: "Issuing Country" },
    { title: "Issued" },
    { title: "Expiry" },
    { title: "Status" },
    { title: "Notes" },
  ];

  useEffect(() => {
    props.getUserById(userInfo._id);
  }, []);

  useEffect(() => {
    if (props.userData.getUserByIdResponse) {
      let data = props.userData.getUserByIdResponse.user;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.getUserByIdResponse]);

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
    if (props.userData.userUpdateResponse) {
      let data = props.userData.userUpdateResponse;
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
        props.userData.userUpdateResponse = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.userUpdateResponse]);

  // console.log("form value", formValue);

  return (
    <div className="personal_details_container">
      <div style={{ margin: "30px 0" }}>
        <div className="personal_details_title">
          Enter your personal details
        </div>
        <div className="personal_details_desc">
          Complete the form with your correct information
        </div>
      </div>
      <div className="personal_details_form">
        {" "}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="personal_details_form_field">
            <Form.Item
              name="firstName"
              label={
                <span className="patient_details_input_label">First Name</span>
              }
              rules={[{ required: true, message: "Please enter first name!" }]}
            >
              <Input
                className="patient_details_input"
                name="firstName"
                value={formValue.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </Form.Item>

            <Form.Item
              name="middleName"
              label={
                <span className="patient_details_input_label">Middle Name</span>
              }
            >
              <Input
                className="patient_details_input"
                name="middleName"
                value={formValue.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={
                <span className="patient_details_input_label">Last Name</span>
              }
              rules={[{ required: true, message: "Please enter last name!" }]}
            >
              <Input
                className="patient_details_input"
                name="lastName"
                value={formValue.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </Form.Item>

            <Form.Item
              name="employeeStartDate"
              label={
                <span className="patient_details_input_label">
                  Employment Start Date
                </span>
              }
              rules={[{ required: true, message: "Please select start date!" }]}
            >
              <DatePicker
                className="patient_details_input"
                name="employeeStartDate"
                value={formValue.employeeStartDate}
                onChange={(date) => handleDateChange(date, "employeeStartDate")}
                style={{ width: "100%" }}
                placeholder="Select start date"
              />
            </Form.Item>

            <Form.Item
              name="dob"
              label={
                <span className="patient_details_input_label">
                  DOB (Optional)
                </span>
              }
            >
              <DatePicker
                className="patient_details_input"
                name="dob"
                value={formValue.dob}
                onChange={(date) => handleDateChange(date, "dob")}
                style={{ width: "100%" }}
                placeholder="Select date of birth"
              />
            </Form.Item>

            <Form.Item
              name="sex"
              label={
                <span className="patient_details_input_label">Gender</span>
              }
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select
                className="patient_details_input"
                value={formValue.sex}
                onChange={(value) => handleSelectChange(value, "sex")}
                placeholder="Select Gender"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              className="patient_details_input"
              name="employeeId"
              label={
                <span className="patient_details_input_label">
                  Employee ID Number
                </span>
              }
              rules={[{ required: true, message: "Please enter employee ID!" }]}
            >
              <Input
                className="patient_details_input"
                name="employeeId"
                value={formValue.employeeId}
                onChange={handleChange}
                placeholder="Enter employee ID"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className="patient_details_input_label">
                  Phone (Optional)
                </span>
              }
              rules={[
                { required: true, message: "Please enter phone number!" },
              ]}
            >
              <Input
                className="patient_details_input"
                name="phone"
                value={formValue.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Form.Item
              name="maritalStatus"
              label={
                <span className="patient_details_input_label">
                  Marital Status
                </span>
              }
              rules={[
                { required: true, message: "Please enter marital status!" },
              ]}
            >
              <Select
                className="patient_details_input"
                value={formValue.maritalStatus}
                onChange={(value) =>
                  handleChange({ target: { name: "maritalStatus", value } })
                }
                placeholder="Select marital status"
              >
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
                <Option value="widowed">Widowed</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="visa_details">
            <div style={{ margin: "30px 0" }}>
              <div className="personal_details_title">Visa Details</div>
              <div className="personal_details_desc">
                Kindly provide your visa particulars if any
              </div>
            </div>

            <div className="visa_deatils_header">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                style={{ width: "200px", height: "34px", borderRadius: "28px" }}
              />
              <Button
                className="add_policy_button"
                // onClick={handleAddNewPolicy}
              >
                Add Entry
              </Button>
            </div>
            <div className="visa_details_table">
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
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
              gap: "20px",
            }}
          >
            <Button
              type="primary"
              style={{
                width: "292px",
                backgroundColor: "#E0E5EB",
                color: "#FFFFFF",
                height: "50px",
                borderRadius: "18px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "292px",
                backgroundColor: "#007DC5",
                color: "#FFFFFF",
                height: "50px",
                borderRadius: "18px",
              }}
            >
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.user,
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
