/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Layout,
  List,
  Modal,
  Select,
  Switch,
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser, getUserByCompanyId } from "../../redux/User/user.action";
import { getGeneralTimeOff } from "../../redux/GeneralTimeOff/generalTimeOff.action";
import { addUserTimeOff } from "../../redux/UserTimeOff/userTimeOff.action";
import toast from "react-hot-toast";
import MailIcon from "../../assets/mail-open.svg";
import GeneralTimeOff from "../GeneralTimeOff";
import "./style.css";

const { Option } = Select;
const { Sider, Content } = Layout;

function ExistingEmployee(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [formValues, setFormValues] = useState({
    employementType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    employmentStartDate: "",
    dob: "",
    sex: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    jobTitle: "",
    employeeShift: "",
    department: "",
    reporting: "",
  });
  const [timeOffList, setTimeOffList] = useState([]); // Time-off policies list
  const [selectedTimeOffId, setSelectedTimeOffId] = useState(null); // Selected policy ID
  const [policiesData, setPoliciesData] = useState([]); // Holds data for each policy
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [switchStates, setSwitchStates] = useState({
    carryforward: false,
    accrualLimit: false,
    cashoutLimit: false,
    resetPolicy: false,
  });

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const [isCustomPolicyVisible, setIsCustompolicyVisible] = useState(false);

  const [selectedTimeOffDetails, setSelectedTimeOffDetails] = useState(null); // To store the full details

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Function to check device width
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 767) {
        // console.log("mobile");
        setIsMobileView(true); // Mobile
      } else {
        // console.log("desk");
        setIsMobileView(false); // Desktop
      }
    };

    // Initial check and add event listener
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  // Function to handle the cancel button click
  const showCancelModal = () => {
    setIsCancelModalVisible(true);
  };

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  // Function to handle modal Cancel button
  const handleCancel = () => {
    setIsCancelModalVisible(false);
    setIsConfirmModalVisible(false);
    // console.log("Cancelled action cancelled");
  };

  // Function to handle checkbox selection
  const handleCheckboxChange = (value) => {
    setSelectedType(value === selectedType ? null : value);
    setFormValues({
      ...formValues,
      employementType: value,
    });
    form.setFieldsValue({ employmentType: value });
  };

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

    switch (value) {
      case "monthly":
        // setResetValue("On last day of month");
        break;
      case "yearly":
        // setResetValue("On 31st on Dec");
        break;
      default:
    }
  };

  const handleDateChange = (date, dateString, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: dateString,
    });
  };

  useEffect(() => {
    props.getGeneralTimeOff(userInfo.companyId);
    props.getUserByCompanyId(userInfo.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.userData.getUserByCompanyIdResponse) {
      let data = props.userData.getUserByCompanyIdResponse;
      if (data.success) {
        // console.log("user by company id", data.users);
        setUsersList(data.users);
      }
    }
  }, [props.userData.getUserByCompanyIdResponse]);

  useEffect(() => {
    if (props.generalTimeOffData.getGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.getGeneralTimeOffResponse;
      if (data.success) {
        // Assuming the first item in the data array contains the time off policies
        const policies = data.data[0]?.timeOff.map((policy) => ({
          code: policy.policyCode, // Unique identifier for the policy
          name: policy.policyName,
          type: policy.policyType,
          units: policy.units,
          per: policy.per,
        }));
        // console.log("Extracted Policies:", policies);
        setTimeOffList(policies); // Set the time-off policies to state
        setSelectedTimeOffId(policies[0]?.code); // Set the first policy as selected by default
        setPoliciesData(
          policies.map((x) => ({
            policyName: x.name,
            policyCode: x.code,
            policyType: x.type,
            units: x.units,
            per: x.per,
            creditsHours: "",
            creditsUnits: "",
            carryForwardUnits: "",
            accuralUnits: "",
            EncashedUnusedLeaveUnits: "",
            resetInd: "yes",
            resetType: "yearly",
          }))
        );
      }
    }
  }, [props.generalTimeOffData.getGeneralTimeOffResponse]);

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      companyId: userInfo.companyId,
      companyName: userInfo.companyName,
      employementType: formValues.employementType,
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      employmentStartDate: formValues.employmentStartDate,
      dob: formValues.dob,
      gender: formValues.sex,
      employeeIdNumber: formValues.idNumber,
      phone: formValues.phoneNumber,
      email: formValues.email,
      address: {
        address1: formValues.address1,
        address2: formValues.address2,
        country: formValues.country,
        state: formValues.state,
        city: formValues.city,
        zip: formValues.zip,
      },
      jobTitle: formValues.jobTitle,
      employeeShift: formValues.employeeShift,
      departmentName: formValues.department,
      reporting: formValues.reporting,
    };
    props.addUser(payload);
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.success) {
        setActiveTab("2"); // Navigate to Benefits tab on form submission
        setUserId(data.user._id);
        setLoading(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    }
    props.userData.addUserResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.addUserResponse]);

  useEffect(() => {
    if (props.generalTimeOffData.addGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.addGeneralTimeOffResponse;
      if (data.success) {
        props.getGeneralTimeOff(userInfo.companyId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

  const handleSelectTimeOff = (timeOffId) => {
    // console.log("timeOffId", timeOffId);
    setSelectedTimeOffId(timeOffId); // Update selected policy
    // Find the full details of the selected time-off
    const selectedDetails = timeOffList.find(
      (timeOff) => timeOff.code === timeOffId
    );
    setSelectedTimeOffDetails(selectedDetails); // Save the details in state
  };

  // Function to handle input changes for policiesData
  const handleChangePolicy = (key, value, index) => {
    setPoliciesData((prevPolicies) =>
      prevPolicies.map((policy, i) =>
        i === index
          ? {
              ...policy,
              [key]: value, // Update the credits field for the matching index
            }
          : policy
      )
    );
  };

  // Function to handle select changes for policiesData
  const handleSelectChangePolicy = (value, index, field) => {
    setPoliciesData((prevPolicies) =>
      prevPolicies.map((policy, i) =>
        i === index
          ? {
              ...policy,
              [field]: value, // Update the specified field for the matching index
            }
          : policy
      )
    );
  };

  const handleSubmitTimeOff = () => {
    const payload = {
      companyId: userInfo.companyId,
      userId: userId,
      timeOff: policiesData.map((x) => {
        let resetDate = "";
        if (x.resetType === "monthly") {
          // Get the last date of the current month
          const now = new Date();
          resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];
        } else if (x.resetType === "yearly") {
          // Set to 31st December of the current year
          const now = new Date();
          resetDate = new Date(now.getFullYear(), 11, 31)
            .toISOString()
            .split("T")[0];
        }

        return {
          policyName: x.policyName,
          policyCode: x.policyCode,
          policyType: x.policyType,
          units: x.units,
          per: x.per,
          creditsHours: x.creditsHours,
          creditsUnits: x.creditsUnits,
          carryForwardUnits: x.carryForwardUnits,
          accuralUnits: x.accuralUnits,
          EncashedUnusedLeaveUnits: x.EncashedUnusedLeaveUnits,
          resetInd: x.resetInd,
          resetType: x.resetType,
          resetDate: resetDate, // Set dynamically
        };
      }),
    };

    // console.log("policy payload", payload);
    props.addUserTimeOff(payload);
  };

  useEffect(() => {
    if (props.userTimeOffData.addUserTimeOffResponse) {
      let data = props.userTimeOffData.addUserTimeOffResponse;
      if (data.success) {
        handleCancel();
        props.existingEmployees(false);
      }
      props.userTimeOffData.addUserTimeOffResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userTimeOffData.addUserTimeOffResponse]);

  // Function to handle switch toggle
  const handleSwitchChange = (key, value) => {
    setSwitchStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="existing-employee-container">
      <div className="existing-employee-header">
        <div>
          <div className="existing-employee-title">Enter Profile Details</div>
          <div className="existing-employee-desc">
            Bring an existing employee into the system
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              className="existing_employee_tab_number"
              style={
                activeTab === "1"
                  ? { backgroundColor: "#F3686D" }
                  : { backgroundColor: "#f9b3b6" }
              }
            >
              1
            </div>
            <div
              className="existing-employee-tabs"
              style={
                activeTab === "1" ? { color: "#F3686D" } : { color: "#f9b3b6" }
              }
            >
              Profile Details
            </div>
          </div>
          <div className="existing_employee_tab_line"></div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              className="existing_employee_tab_number"
              style={
                activeTab === "2"
                  ? { backgroundColor: "#F3686D" }
                  : { backgroundColor: "#f9b3b6" }
              }
            >
              2
            </div>
            <div
              className="existing-employee-tabs"
              style={
                activeTab === "2" ? { color: "#F3686D" } : { color: "#f9b3b6" }
              }
            >
              Add Benefits
            </div>
          </div>
        </div>
      </div>

      {activeTab === "1" ? (
        <div className="existing-employee-form">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div className="form-checkbox-button">
              {/* Single-Selectable Checkboxes */}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select employment type!",
                  },
                ]}
              >
                <div className="employee_type_container">
                  <Checkbox
                    checked={selectedType === "fullTime"}
                    onChange={() => handleCheckboxChange("fullTime")}
                  >
                    Full-time
                  </Checkbox>
                  <Checkbox
                    checked={selectedType === "partTime"}
                    onChange={() => handleCheckboxChange("partTime")}
                  >
                    Part-time
                  </Checkbox>
                  <Checkbox
                    checked={selectedType === "internship"}
                    onChange={() => handleCheckboxChange("internship")}
                  >
                    Internship
                  </Checkbox>
                  {/* Helper Text */}
                  {/* {!form.getFieldValue("employmentType") && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  Please select an employment type!
                </div>
              )} */}
                </div>
              </Form.Item>

              <div style={{ width: "170px" }}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#009A4E",
                    // borderColor: "#28a745",
                    width: "100%",
                    borderRadius: "18px",
                  }}
                >
                  Add/Edit Fields
                </Button>
              </div>
            </div>

            <div className="existing_employee_form_container">
              {/* First Name */}
              <Form.Item
                name="firstName"
                label={
                  <span className="employee-custom-label">First Name</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Enter employee first name!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </Form.Item>

              {/* Middle Name */}
              <Form.Item
                name="middleName"
                label={
                  <span className="employee-custom-label">Middle Name</span>
                }
              >
                <Input
                  className="employee-input"
                  name="middleName"
                  value={formValues.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />
              </Form.Item>

              {/* Last Name */}
              <Form.Item
                name="lastName"
                label={<span className="employee-custom-label">Last Name</span>}
                rules={[
                  {
                    required: true,
                    message: "Enter employee last name!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Item>

              {/* Phone Number */}
              <Form.Item
                name="phoneNumber"
                label={<span className="employee-custom-label">Phone</span>}
                rules={[
                  {
                    pattern: /^[0-9]{10,15}$/, // Allows only digits with a length of 10 to 15
                    message:
                      "Please enter a valid phone number (10-15 digits)!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                label={<span className="employee-custom-label">Email</span>}
                rules={[
                  {
                    required: true,
                    message: "Please enter employee email!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </Form.Item>

              {/* Employement Start Date */}
              <Form.Item
                name="employmentStartDate"
                label={
                  <span className="employee-custom-label">
                    Employment Start Date
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter employee start date!",
                  },
                ]}
              >
                <DatePicker
                  className="employee-input"
                  name="employementStartDate"
                  value={formValues.employmentStartDate}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "employmentStartDate")
                  }
                  placeholder="Select start date"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* DOB */}
              {/* <Form.Item
                name="dob"
                label={<span className="employee-custom-label">DOB</span>}
              >
                <DatePicker
                  className="employee-input"
                  name="dob"
                  value={formValues.dob}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "dob")
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item> */}

              {/* Gender */}
              {/* <Form.Item
                name="sex"
                label={<span className="employee-custom-label">Gender</span>}
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Select
                  className="employee-input"
                  placeholder="Select Gender"
                  value={formValues.gender}
                  onChange={(value) => handleSelectChange(value, "sex")}
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item> */}

              {/* ID Number */}
              <Form.Item
                name="idNumber"
                label={
                  <span className="employee-custom-label">
                    Employee ID Number
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter employee ID number!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="idNumber"
                  value={formValues.idNumber}
                  onChange={handleChange}
                  placeholder="ID number"
                />
              </Form.Item>

              {/* Address1 */}
              {/* <Form.Item
                name="address1"
                label={<span className="employee-custom-label">Address 1</span>}
              >
                <Input
                  className="employee-input"
                  name="address1"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Address 1"
                />
              </Form.Item> */}

              {/* Address2 */}
              {/* <Form.Item
                name="address2"
                label={<span className="employee-custom-label">Address 2</span>}
              >
                <Input
                  className="employee-input"
                  name="address2"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Address 2"
                />
              </Form.Item> */}

              {/* Country */}
              {/* <Form.Item
                name="country"
                label={<span className="employee-custom-label">Country</span>}
              >
                <Select
                  className="employee-input"
                  value={formValues.country}
                  onChange={(value) => handleSelectChange(value, "country")}
                  placeholder="Country / Region"
                >
                  {Object.keys(countryStateMapping).map((country) => (
                    <Option key={country} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              {/* State */}
              {/* <Form.Item
                name="state"
                label={<span className="employee-custom-label">State</span>}
              >
                <Select
                  className="employee-input"
                  placeholder="Select State"
                  value={formValues.state}
                  onChange={(value) => handleSelectChange(value, "state")}
                  disabled={!formValues.country} // Disable if no country selected
                >
                  {(countryStateMapping[formValues.country] || []).map(
                    (state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item> */}

              {/* City */}
              {/* <Form.Item
                name="city"
                label={<span className="employee-custom-label">City</span>}
              >
                <Input
                  className="employee-input"
                  name="city"
                  value={formValues.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </Form.Item> */}

              {/* Zip */}
              {/* <Form.Item
                name="zip"
                label={<span className="employee-custom-label">ZIP</span>}
                rules={[
                  {
                    pattern: /^\d{5}(-\d{4})?$/, // Regex for US ZIP codes (5 digits, optional 4 digits)
                    message: "Please enter a valid ZIP code!",
                  },
                ]}
              >
                <Input
                  className="employee-input"
                  name="zip"
                  value={formValues.zip}
                  onChange={handleChange}
                  placeholder="Ward"
                />
              </Form.Item> */}

              {/* Job Title */}
              <Form.Item
                name="jobTitle"
                label={<span className="employee-custom-label">Job Title</span>}
              >
                <Input
                  className="employee-input"
                  name="jobTitle"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Job Title"
                />
              </Form.Item>

              {/* Shift */}
              {/* <Form.Item
                name="employeeShift"
                label={
                  <span className="employee-custom-label">Employee Shift</span>
                }
              >
                <Input
                  className="employee-input"
                  name="employeeShift"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Employee Shift"
                />
              </Form.Item> */}

              {/* Department */}
              {/* <Form.Item
                name="department"
                label={
                  <span className="employee-custom-label">Department Name</span>
                }
              >
                <Select
                  className="employee-input"
                  value={formValues.department}
                  onChange={(value) => handleSelectChange(value, "department")}
                  placeholder="Select department"
                >
                  {departmentList.map((dept, index) => (
                    <Option key={index} value={dept}>
                      {dept}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              {/* Reporting */}
              <Form.Item
                name="reporting"
                label={
                  <span className="employee-custom-label">
                    Employee reporting to
                  </span>
                }
              >
                <Select
                  className="employee-input"
                  value={formValues.department}
                  onChange={(value) => handleSelectChange(value, "reporting")}
                  placeholder="Select reporter"
                >
                  {/* <Option value="admin1">Admin 1</Option>
                  <Option value="admin2">Admin 2</Option>
                  <Option value="admin3">Admin 3</Option>
                  <Option value="admin4">Admin 4</Option> */}
                  {usersList.map((user) => (
                    <Select.Option key={user._id} value={user._id}>
                      {`${user.firstName} ${user.middleName || ""} ${
                        user.lastName
                      }`.trim()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="existing_employee_buttons_container">
              <div>
                <Button
                  type="primary"
                  style={{
                    height: "50px",
                    borderRadius: "25px",
                    backgroundColor: "#B1B1B1",
                    boxShadow:
                      "0px 2.757px 0.919px -1.838px rgba(0, 0, 0, 0.20), 0px 1.838px 1.838px 0px rgba(0, 0, 0, 0.14), 0px 0.919px 4.595px 0px rgba(0, 0, 0, 0.12)",
                  }}
                  className="existing_employee_buttons"
                  onClick={() => props.existingEmployees(false)}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    height: "50px",
                    borderRadius: "25px",
                  }}
                  className="existing_employee_buttons"
                  loading={loading}
                >
                  {loading ? "Continue ..." : "Continue"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      ) : (
        <>
          <Layout style={{ backgroundColor: "#fff" }}>
            {isMobileView ? (
              <div style={{ padding: "10px", marginTop: "20px" }}>
                <div
                  className="policy-custom-label"
                  style={{ marginBottom: "10px" }}
                >
                  Select Leave Policy
                </div>
                <Select
                  className="leave-policy-input"
                  style={{ width: "100%" }}
                  placeholder="Select"
                  onChange={handleSelectTimeOff}
                >
                  {timeOffList.map((x) => (
                    <Option key={x.code} value={x.code}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
                <div className="card">
                  <div className="circle"></div>
                  <div className="content">
                    <h3>
                      {selectedTimeOffDetails
                        ? selectedTimeOffDetails.name
                        : ""}
                    </h3>
                    <div className="details">
                      Code:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.code
                          : ""}
                      </span>{" "}
                      &nbsp; &nbsp; Type:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.type
                          : ""}
                      </span>
                    </div>
                    <div className="details">
                      Units:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.units
                          : ""}
                      </span>{" "}
                      &nbsp; &nbsp; Per:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.per
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Sider
                width={300}
                style={{ background: "#fff", padding: "10px" }}
              >
                <div
                  style={{ marginTop: "30px" }}
                  className="leave-policy-heading"
                >
                  Leave Policies
                </div>
                <List
                  style={{ marginTop: "20px", border: 0 }}
                  bordered
                  dataSource={timeOffList}
                  renderItem={(timeOff) => (
                    <List.Item
                      style={{ cursor: "pointer", padding: "20px 0 20px 20px" }}
                      onClick={() => handleSelectTimeOff(timeOff.code)}
                      className={`card-item ${
                        selectedTimeOffId === timeOff.code ? "selected" : ""
                      }`}
                    >
                      <div className="card">
                        <div className="circle"></div>
                        <div className="content">
                          <h3>{timeOff.name}</h3>
                          <div className="details">
                            Code: <span>{timeOff.code}</span> &nbsp; &nbsp;
                            Type: <span>{timeOff.type}</span>
                          </div>
                          <div className="details">
                            Units: <span>{timeOff.units}</span> &nbsp; &nbsp;
                            Per: <span>{timeOff.per}</span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                <div style={{ marginTop: "20px" }}>
                  <Button
                    className="custom-policy-button"
                    onClick={() => setIsCustompolicyVisible(true)}
                  >
                    Create custom leave policy
                  </Button>
                </div>
                <Modal
                  visible={isCustomPolicyVisible}
                  footer={null}
                  width={"80%"}
                  // style={{ top: "20px" }}
                  onCancel={() => setIsCustompolicyVisible(false)}
                >
                  <div style={{ padding: "10px" }}>
                    <GeneralTimeOff />
                  </div>
                </Modal>
              </Sider>
            )}

            <Layout
              style={{ minHeight: "400px" }}
              className="policy-details-continer"
            >
              <Content>
                {selectedTimeOffId ? (
                  <>
                    {timeOffList.map(
                      (policy, index) =>
                        selectedTimeOffId === policy.code && (
                          <div key={policy.code}>
                            {!isMobileView && (
                              <div
                                style={{ borderBottom: "1px solid #e0e0e0" }}
                                className="leave-policy-heading"
                              >
                                {policy.name}
                              </div>
                            )}
                            <Form layout="vertical">
                              {!isMobileView && (
                                <div
                                  style={{
                                    padding: " 20px 100px 0",
                                    borderBottom: "1px solid #e0e0e0",
                                    display: "flex",
                                    gap: "50px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Type
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.policyType}
                                      readOnly
                                      placeholder="Paid"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Units
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.units}
                                      readOnly
                                      placeholder="Hour"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Units per
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.per}
                                      readOnly
                                      placeholder="Month"
                                    />
                                  </Form.Item>
                                </div>
                              )}

                              <div
                                style={{
                                  display: "flex",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: !isMobileView ? "20px 0" : "",
                                }}
                              >
                                {" "}
                                {!isMobileView && (
                                  <div style={{ width: "104px" }}></div>
                                )}
                                <Form.Item
                                  label={
                                    <span className="policy-custom-label">
                                      Credit hours
                                    </span>
                                  }
                                  style={{ marginRight: "20px" }}
                                >
                                  <Input
                                    className="leave-policy-input"
                                    value={policiesData[index]?.creditsHours}
                                    placeholder="0.00 hours"
                                    onChange={(e) =>
                                      handleChangePolicy(
                                        "creditsHours",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Item>
                                {/* <Form.Item
                                  label={
                                    <span className="policy-custom-label">
                                      Units
                                    </span>
                                  }
                                >
                                  <Input
                                    style={{
                                      width: !isMobileView ? "136px" : "", border:0
                                    }}
                                    className="leave-policy-input"
                                    value={policiesData[index]?.units}
                                    // placeholder="Hours"
                                    onChange={(e) =>
                                      handleChangePolicy(
                                        "creditsUnits",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Item> */}
                                <div
                                  className="policy-custom-label hours-div"
                                  style={{
                                    marginLeft: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {policiesData[index]?.units}
                                </div>
                              </div>

                              {/* Carryforward Unused Leave */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.carryforward}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "carryforward",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Carryforward Unused leave upto
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder="0.00 hours"
                                      disabled={!switchStates.carryforward}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "carryForwardUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={
                                        policiesData[index]?.carryForwardUnits
                                      }
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label hours-div"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    Hours
                                  </div>
                                </div>
                              </div>

                              {/* Maximum Annual Accrual Limit */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.accrualLimit}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "accrualLimit",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Maximum Anual Acrual limit
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder="0.00 hours"
                                      disabled={!switchStates.accrualLimit}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "accuralUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={policiesData[index]?.accuralUnits}
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    Hours
                                  </div>
                                </div>
                              </div>
                              {/* Cashout Unused Time Limit */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.cashoutLimit}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "cashoutLimit",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Cashout Unused Time limit
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder="0.00 hours"
                                      disabled={!switchStates.cashoutLimit}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "EncashedUnusedLeaveUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={
                                        policiesData[index]
                                          ?.EncashedUnusedLeaveUnits
                                      }
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    Hours
                                  </div>
                                </div>
                              </div>
                              {/* Reset Time Policy */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.resetPolicy}
                                    onChange={(checked) =>
                                      handleSwitchChange("resetPolicy", checked)
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Reset Time policy
                                      </span>
                                    }
                                  >
                                    <Select
                                      style={{ width: "250px" }}
                                      className="leave-policy-input"
                                      placeholder="Select reset"
                                      value={policiesData[index]?.resetType} // Bind to the corresponding policy
                                      onChange={(value) =>
                                        handleSelectChangePolicy(
                                          value,
                                          index,
                                          "resetType"
                                        )
                                      } // Pass value, index, and field
                                      disabled={!switchStates.resetPolicy}
                                    >
                                      <Option value="monthly">Monthly</Option>
                                      <Option value="yearly">Yearly</Option>
                                    </Select>
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {policiesData[index]?.resetType ===
                                    "monthly"
                                      ? "Reset on the last day of every month"
                                      : "Reset on 31st December"}
                                  </div>{" "}
                                </div>
                              </div>
                            </Form>
                          </div>
                        )
                    )}
                  </>
                ) : (
                  <div className="leave-policy-heading">Add Leave Policy</div>
                )}
              </Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  margin: "20px 0",
                }}
              >
                <Button
                  style={{
                    width: "290px",
                    height: "50px",
                    backgroundColor: "#B1B1B1",
                    borderRadius: "22px",
                    color: "#FFF",
                  }}
                  onClick={showCancelModal}
                >
                  Cancel
                </Button>
                <Modal
                  // title="Confirm Cancel"
                  visible={isCancelModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "30px",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div className="cancel_popup_title">
                      Cancel adding leave benefits?
                    </div>
                    <div className="cancel_popup_desc">
                      You will lose the changes made on the leave policy
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#C5CBD7",
                          color: "#FFFFFF",
                          borderRadius: "22px",
                          height: "40px",
                        }}
                        onClick={handleCancel}
                      >
                        Not Now
                      </Button>
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#0057FF",
                          color: "#FFFFFF",
                          borderRadius: "22px",
                          height: "40px",
                        }}
                        onClick={() => {
                          setActiveTab("1"), handleCancel();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Modal>
                <Button
                  style={{
                    width: "290px",
                    height: "50px",
                    backgroundColor: "#0057FF",
                    borderRadius: "22px",
                    color: "#FFF",
                  }}
                  onClick={showConfirmModal}
                >
                  Finish
                </Button>
                <Modal
                  visible={isConfirmModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                  closable={false}
                  width={600}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "20px",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <img src={MailIcon} alt="Mail icon" />
                    </div>
                    <div>
                      <div className="cancel_popup_title">
                        An invitation will be send to
                      </div>
                      <div className="cancel_popup_desc">
                        {formValues.email}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        gap: "10px",
                        width: "150px",
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#C5CBD7",
                          color: "#FFFFFF",
                          borderRadius: "22px",
                          height: "40px",
                        }}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#0057FF",
                          color: "#FFFFFF",
                          borderRadius: "22px",
                          height: "40px",
                        }}
                        onClick={handleSubmitTimeOff}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            </Layout>
          </Layout>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.user,
  departmentData: state.department,
  generalTimeOffData: state.generalTimeOff,
  userTimeOffData: state.userTimeOff,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
  getGeneralTimeOff: (values) => dispatch(getGeneralTimeOff(values)),
  addUserTimeOff: (values) => dispatch(addUserTimeOff(values)),
  getUserByCompanyId: (values) => dispatch(getUserByCompanyId(values)),
});

ExistingEmployee.propTypes = {
  addUser: PropTypes.func,
  getGeneralTimeOff: PropTypes.func,
  addUserTimeOff: PropTypes.func,
  getUserByCompanyId: PropTypes.func,
  userData: PropTypes.object,
  departmentData: PropTypes.object,
  generalTimeOffData: PropTypes.object,
  userTimeOffData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingEmployee);
