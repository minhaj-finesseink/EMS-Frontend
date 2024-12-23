/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  Tabs,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser } from "../../redux/User/user.action";
import { getDepartment } from "../../redux/Add-department/department.action";
import { getGeneralTimeOff } from "../../redux/GeneralTimeOff/generalTimeOff.action";
import GeneralTimeOff from "../GeneralTimeOff";
import { addUserTimeOff } from "../../redux/UserTimeOff/userTimeOff.action";
import toast from "react-hot-toast";
import "./style.css";

const { Option } = Select;
const { Sider, Content } = Layout;

const countryStateMapping = {
  "United States": ["California", "Texas", "Florida", "New York"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Qatar: ["Doha", "Al Rayyan", "Al Wakrah"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Dammam"],
  Bahrain: ["Manama", "Riffa", "Muharraq"],
  Kuwait: ["Hawalli", "Salmiya", "Farwaniya"],
};

function ExistingEmployee(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [changeTab, setChangeTab] = useState(false);
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
  const [departmentList, setDepartmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [timeOffButton, setTimeOffButton] = useState(false); // To track whether the time-off data is loaded

  const [timeOffList, setTimeOffList] = useState([]); // Time-off policies list
  const [selectedTimeOffId, setSelectedTimeOffId] = useState(null); // Selected policy ID
  const [policiesData, setPoliciesData] = useState([]); // Holds data for each policy
  // const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState(null);

  const [switchStates, setSwitchStates] = useState({
    carryforward: false,
    accrualLimit: false,
    cashoutLimit: false,
    resetPolicy: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to handle the cancel button click
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle modal Cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
    console.log("Cancelled action cancelled");
  };

  // Function to handle checkbox selection
  const handleCheckboxChange = (value) => {
    setSelectedType(value === selectedType ? null : value);
    setFormValues({
      ...formValues,
      employementType: value,
    });
  };

  // console.log("form values", formValues);

  const handleTabChange = (key) => {
    if (changeTab) {
      setActiveTab(key); // Update the active tab key
    }
  };

  const getHeadingContent = () => {
    if (activeTab === "1") return "Add Existing Employee";
    if (activeTab === "2") return "Employee Time Off";
    return "Form Section";
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
    props.getDepartment(userInfo._id);
    props.getGeneralTimeOff(userInfo.companyId);
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
        setTimeOffButton(true);
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
            // carryForwardBy: "end of year",
            accuralUnits: "",
            // accuralBy: "per month",
            EncashedUnusedLeaveUnits: "",
            // EncashedUnusedLeaveFrequency: "yearly",
            resetInd: "yes",
            resetType: "yearly",
            // resetDate:
            //   x.resetType === "monthly"
            //     ? "on the last day of the month"
            //     : "On 31st of Dec",
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
    // console.log("payload", payload);
    props.addUser(payload);
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.success) {
        setActiveTab("2"); // Navigate to Benefits tab on form submission
        setChangeTab(true);
        // setUserId(data.user._id);
        setLoading(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
    props.userData.addUserResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.addUserResponse]);

  // Function to handle modal opening
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal closing
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (props.generalTimeOffData.addGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.addGeneralTimeOffResponse;
      if (data.success) {
        props.getGeneralTimeOff(userInfo.companyId);
        handleCloseModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

  const handleSelectTimeOff = (timeOffId) => {
    setSelectedTimeOffId(timeOffId); // Update selected policy
  };

  const handlePolicyChange = (index, field, value) => {
    setPoliciesData((prevPolicies) => {
      const newPolicies = [...prevPolicies];
      newPolicies[index][field] = value;
      return newPolicies;
    });
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
    // const payload = {
    //   companyId: userInfo.companyId,
    //   userId: userId,
    //   timeOff: policiesData.map((x) => ({
    //     policyName: x.policyName,
    //     policyCode: x.policyCode,
    //     policyType: x.policyType,
    //     units: x.units,
    //     per: x.per,
    //     creditsHours: x.creditsHours,
    //     creditsUnits: x.creditsUnits,
    //     carryForwardUnits: x.carryForwardUnits,
    //     // carryForwardBy: x.carryForwardBy,
    //     accuralUnits: x.accuralUnits,
    //     // accuralBy: x.accuralBy,
    //     EncashedUnusedLeaveUnits: x.EncashedUnusedLeaveUnits,
    //     // EncashedUnusedLeaveFrequency: x.EncashedUnusedLeaveFrequency,
    //     resetInd: x.resetInd,
    //     resetType: x.resetType,
    //     resetDate: x.resetDate,
    //   })),
    // };

    const payload = {
      companyId: userInfo.companyId,
      userId: userInfo._id,
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

    console.log("policy payload", payload);
    props.addUserTimeOff(payload);
  };

  useEffect(() => {
    if (props.userTimeOffData.addUserTimeOffResponse) {
      let data = props.userTimeOffData.addUserTimeOffResponse;
      if (data.success) {
        toast.success(data.message);
        // props.onClose();
      } else {
        toast.error(data.message);
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

  // console.log("time off list", timeOffList);

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
          <div className="existing-employee-tabs">Profile Details</div>
          <div className="existing-employee-tabs">Add Benefits</div>
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
                <div style={{ display: "flex", gap: "70px" }}>
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

            <div
              style={{
                display: "grid",
                gap: "0 30px",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <Form.Item
                name="firstName"
                label={
                  <span className="employee-custom-label">First Name</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input employee first name!",
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

              <Form.Item
                name="lastName"
                label={<span className="employee-custom-label">Last Name</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input employee last name!",
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

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

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

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

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

              <Form.Item
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
              </Form.Item>

              <Form.Item
                name="department"
                label={
                  <span className="employee-custom-label">Department Name</span>
                }
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input employee department name!",
                //   },
                // ]}
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
              </Form.Item>

              <Form.Item
                name="reporting"
                label={
                  <span className="employee-custom-label">
                    Employee reporting to
                  </span>
                }
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input employee department name!",
                //   },
                // ]}
              >
                <Select
                  className="employee-input"
                  value={formValues.department}
                  onChange={(value) => handleSelectChange(value, "reporting")}
                  placeholder="Select reporter"
                >
                  {/* {departmentList.map((dept, index) => (
                    <Option key={index} value={dept}>
                      {dept}
                    </Option>
                  ))} */}
                  <Option value="admin1">Admin 1</Option>
                  <Option value="admin2">Admin 2</Option>
                  <Option value="admin3">Admin 3</Option>
                  <Option value="admin4">Admin 4</Option>
                </Select>
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
                gap: "20px",
              }}
            >
              <div>
                <Button
                  type="primary"
                  style={{
                    width: "292px",
                    height: "50px",
                    borderRadius: "25px",
                    backgroundColor: "#B1B1B1",
                    boxShadow:
                      "0px 2.757px 0.919px -1.838px rgba(0, 0, 0, 0.20), 0px 1.838px 1.838px 0px rgba(0, 0, 0, 0.14), 0px 0.919px 4.595px 0px rgba(0, 0, 0, 0.12)",
                  }}
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
                    width: "292px",
                    height: "50px",
                    borderRadius: "25px",
                  }}
                  loading={loading}
                  // disabled={loading}
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
            <Sider width={300} style={{ background: "#fff", padding: "10px" }}>
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
                          Code: <span>{timeOff.code}</span> &nbsp; &nbsp; Type:{" "}
                          <span>{timeOff.type}</span>
                        </div>
                        <div className="details">
                          Units: <span>{timeOff.units}</span> &nbsp; &nbsp; Per:{" "}
                          <span>{timeOff.per}</span>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              <div style={{ marginTop: "20px" }}>
                <Button className="custom-policy-button">
                  Create custom leave policy
                </Button>
              </div>
            </Sider>

            <Layout className="policy-details-continer">
              <Content>
                {selectedTimeOffId ? (
                  <>
                    {timeOffList.map(
                      (policy, index) =>
                        selectedTimeOffId === policy.code && (
                          <div key={policy.code}>
                            <div
                              style={{ borderBottom: "1px solid #e0e0e0" }}
                              className="leave-policy-heading"
                            >
                              {policy.name}
                            </div>
                            <Form layout="vertical">
                              <div
                                style={{
                                  padding: " 20px 100px 0",
                                  borderBottom: "1px solid #e0e0e0",
                                  display: "flex",
                                  // gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: "50px",
                                }}
                              >
                                <Form.Item
                                  // label="Type"
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
                                  // label="Units"
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
                                  // label="Units per"
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

                              <div
                                style={{
                                  display: "flex",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: "20px 0",
                                }}
                              >
                                <div style={{ width: "104px" }}></div>
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
                                <Form.Item
                                  label={
                                    <span className="policy-custom-label">
                                      Units
                                    </span>
                                  }
                                >
                                  <Input
                                    style={{ width: "136px" }}
                                    className="leave-policy-input"
                                    value={policiesData[index]?.creditsUnits}
                                    placeholder="Hours"
                                    onChange={(e) =>
                                      handleChangePolicy(
                                        "creditsUnits",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Item>
                              </div>

                              {/* Carryforward Unused Leave */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: "20px 0",
                                }}
                              >
                                <div style={{ padding: "30px" }}>
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
                                  className="policy-custom-label"
                                  style={{ marginLeft: "20px" }}
                                >
                                  Hours
                                </div>
                              </div>

                              {/* Maximum Annual Accrual Limit */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: "20px 0",
                                }}
                              >
                                <div style={{ padding: "30px" }}>
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
                                  style={{ marginLeft: "20px" }}
                                >
                                  Hours
                                </div>
                              </div>
                              {/* Cashout Unused Time Limit */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: "20px 0",
                                }}
                              >
                                <div style={{ padding: "30px" }}>
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
                                  style={{ marginLeft: "20px" }}
                                >
                                  Hours
                                </div>
                              </div>
                              {/* Reset Time Policy */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: "20px 0",
                                }}
                              >
                                <div style={{ padding: "30px" }}>
                                  <Switch
                                    checked={switchStates.resetPolicy}
                                    onChange={(checked) =>
                                      handleSwitchChange("resetPolicy", checked)
                                    }
                                  />
                                </div>
                                <Form.Item
                                  label={
                                    <span className="policy-custom-label">
                                      Reset Time policy
                                    </span>
                                  }
                                >
                                  <Select
                                    style={{ width: "200px" }}
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
                                  style={{ marginLeft: "20px" }}
                                >
                                  {policiesData[index]?.resetType === "monthly"
                                    ? "Reset on the last day of every month"
                                    : "Reset on 31st December"}
                                </div>{" "}
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
                  onClick={showModal}
                >
                  Cancel
                </Button>
                <Modal
                  // title="Confirm Cancel"
                  visible={isModalVisible}
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
                        onClick={()=>setActiveTab("1")}
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
                  onClick={handleSubmitTimeOff}
                >
                  Finish
                </Button>
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
  loginData: state.login,
  registerData: state.register,
  departmentData: state.department,
  generalTimeOffData: state.generalTimeOff,
  userTimeOffData: state.userTimeOff,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
  getDepartment: (values) => dispatch(getDepartment(values)),
  getGeneralTimeOff: (values) => dispatch(getGeneralTimeOff(values)),
  addUserTimeOff: (values) => dispatch(addUserTimeOff(values)),
});

ExistingEmployee.propTypes = {
  addUser: PropTypes.func,
  getDepartment: PropTypes.func,
  getGeneralTimeOff: PropTypes.func,
  addUserTimeOff: PropTypes.func,
  departmentData: PropTypes.object,
  userData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingEmployee);