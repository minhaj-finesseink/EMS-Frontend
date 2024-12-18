/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  List,
  Radio,
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
    address: "",
    street: "",
    state: "",
    city: "",
    zip: "",
    country: "",
    department: "",
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [timeOffButton, setTimeOffButton] = useState(false); // To track whether the time-off data is loaded

  const [timeOffList, setTimeOffList] = useState([]); // Time-off policies list
  const [selectedTimeOffId, setSelectedTimeOffId] = useState(null); // Selected policy ID
  const [policiesData, setPoliciesData] = useState([]); // Holds data for each policy
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

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
          key: policy.policyCode, // Unique identifier for the policy
          label: policy.policyName, // Name of the policy
        }));
        console.log("Extracted Policies:", policies);
        setTimeOffList(policies); // Set the time-off policies to state
        setTimeOffButton(true);
        setSelectedTimeOffId(policies[0]?.key); // Set the first policy as selected by default
        setPoliciesData(
          policies.map((x) => ({
            policyName: x.label,
            policyCode: x.key,
            credits: "",
            units: "Hours",
            per: "Monthly",
            resetInd: "yes",
            resetType: "monthly",
            resetDate:
              x.resetType === "monthly"
                ? "on the last day of the month"
                : "On 31st of Dec",
            carryForwardUnits: "",
            carryForwardBy: "end of year",
            accuralUnits: "",
            accuralBy: "per month",
            EncashedUnusedLeaveUnits: "",
            EncashedUnusedLeaveFrequency: "yearly",
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
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      employementType: formValues.employementType,
      employmentStartDate: formValues.employmentStartDate,
      employeeIdNumber: formValues.idNumber,
      departmentName: formValues.department,
      dob: formValues.dob,
      gender: formValues.sex,
      phone: formValues.phoneNumber,
      email: formValues.email,
      address: {
        address: formValues.address,
        street: formValues.street,
        state: formValues.state,
        city: formValues.city,
        zip: formValues.zip,
        country: formValues.country,
      },
    };
    props.addUser(payload);
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.success) {
        setActiveTab("2"); // Navigate to Benefits tab on form submission
        setChangeTab(true);
        setUserId(data.user._id);
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

  const handleSubmitTimeOff = () => {
    const payload = {
      companyId: userInfo.companyId,
      userId: userId,
      timeOff: policiesData.map((x) => ({
        policyName: x.policyName,
        policyCode: x.policyCode,
        credits: x.credits,
        units: x.units,
        per: x.per,
        resetInd: x.resetInd,
        resetType: x.resetType,
        resetDate: x.resetDate,
        carryForwardUnits: x.carryForwardUnits,
        carryForwardBy: x.carryForwardBy,
        accuralUnits: x.accuralUnits,
        accuralBy: x.accuralBy,
        EncashedUnusedLeaveUnits: x.EncashedUnusedLeaveUnits,
        EncashedUnusedLeaveFrequency: x.EncashedUnusedLeaveFrequency,
      })),
    };
    props.addUserTimeOff(payload);
  };

  useEffect(() => {
    if (props.userTimeOffData.addUserTimeOffResponse) {
      let data = props.userTimeOffData.addUserTimeOffResponse;
      if (data.success) {
        toast.success(data.message);
        props.onClose()
      } else {
        toast.error(data.message);
      }
    }
  }, [props.userTimeOffData.addUserTimeOffResponse]);

  return (
    <div>
      <h2>{getHeadingContent()}</h2>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {/* Profile Details Tab */}
        <TabPane tab="Profile Details" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <Form.Item
                name="employmentType"
                label="Employement Type"
                rules={[
                  {
                    required: true,
                    message: "Please select employee employement type!",
                  },
                ]}
              >
                <Radio.Group
                  name="employementType"
                  onChange={handleChange}
                  value={formValues.employementType}
                  // style={{}}
                >
                  <Radio.Button value="Full-time">Full-time</Radio.Button>
                  <Radio.Button value="Part-time">Part-time</Radio.Button>
                  <Radio.Button value="Internship">Internship</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee first name!",
                  },
                ]}
              >
                <Input
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </Form.Item>

              <Form.Item name="middleName" label="Middle Name">
                <Input
                  name="middleName"
                  value={formValues.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee last name!",
                  },
                ]}
              >
                <Input
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Item>

              <Form.Item
                name="department"
                label="Department Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee department name!",
                  },
                ]}
              >
                <Select
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
                name="employmentStartDate"
                label="Employment Start Date"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee start date!",
                  },
                ]}
              >
                <DatePicker
                  name="employementStartDate"
                  value={formValues.employmentStartDate}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "employmentStartDate")
                  }
                  placeholder="Select start date"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item name="dob" label="DOB">
                <DatePicker
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
                label="Gender"
                rules={[
                  {
                    required: true,
                    message: "Please select sex!",
                  },
                ]}
              >
                <Radio.Group
                  name="sex"
                  value={formValues.sex}
                  onChange={handleChange}
                >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="idNumber"
                label="Employee ID Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee ID number!",
                  },
                ]}
              >
                <Input
                  name="idNumber"
                  value={formValues.idNumber}
                  onChange={handleChange}
                  placeholder="ID number"
                />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Phone"
                rules={[
                  {
                    pattern: /^[0-9]{10,15}$/, // Allows only digits with a length of 10 to 15
                    message:
                      "Please enter a valid phone number (10-15 digits)!",
                  },
                ]}
              >
                <Input
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee email!",
                  },
                ]}
              >
                <Input
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </Form.Item>

              <Form.Item name="city" label="City">
                <Input
                  name="city"
                  value={formValues.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </Form.Item>

              <Form.Item name="country" label="Country/Region">
                <Select
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

              <Form.Item name="state" label="State/Province">
                <Select
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
                name="zip"
                label="Zip / Postal Code"
                rules={[
                  {
                    pattern: /^\d{5}(-\d{4})?$/, // Regex for US ZIP codes (5 digits, optional 4 digits)
                    message: "Please enter a valid ZIP code!",
                  },
                ]}
              >
                <Input
                  name="zip"
                  value={formValues.zip}
                  onChange={handleChange}
                  placeholder="Ward"
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100px" }}
                loading={loading}
                // disabled={loading}
              >
                {loading ? "Continue ..." : "Continue"}
              </Button>
            </div>
          </Form>
        </TabPane>
        {/* Time Off Tab */}
        <TabPane tab="Time Off" key="2">
          {!timeOffButton ? (
            <Button
              type="primary"
              style={{ width: "100px" }}
              onClick={handleOpenModal}
            >
              Add Time Off
            </Button>
          ) : (
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                width={200}
                style={{ background: "#f0f0f0", padding: "10px" }}
              >
                <List
                  style={{ marginTop: "20px" }}
                  bordered
                  dataSource={timeOffList}
                  renderItem={(timeOff) => (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectTimeOff(timeOff.key)}
                      className={
                        selectedTimeOffId === timeOff.key ? "selected" : ""
                      }
                    >
                      {timeOff.label}
                    </List.Item>
                  )}
                />
              </Sider>

              <Layout style={{ padding: "20px" }}>
                <Content>
                  {selectedTimeOffId ? (
                    <>
                      {/* Render details of only the selected policy */}
                      {timeOffList.map(
                        (policy, index) =>
                          selectedTimeOffId === policy.key && (
                            <div key={policy.key}>
                              <h2>{`${policy.label} Details`}</h2>
                              <Form layout="vertical">
                                {/* Credits Input */}
                                <Form.Item label="Credits">
                                  <Input
                                    value={policiesData[index]?.credits}
                                    onChange={(e) =>
                                      handlePolicyChange(
                                        index,
                                        "credits",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Credits"
                                    suffix="/month"
                                  />
                                </Form.Item>

                                {/* Carryforward Switch and Input */}
                                <Form.Item label="Carryforward unused leaves upto">
                                  <Switch
                                    checked={policiesData[index]?.carryforward}
                                    onChange={(checked) =>
                                      handlePolicyChange(
                                        index,
                                        "carryforward",
                                        checked
                                      )
                                    }
                                  />
                                  {policiesData[index]?.carryforward && (
                                    <Input
                                      style={{ marginTop: "10px" }}
                                      value={
                                        policiesData[index]?.carryforwardAmount
                                      }
                                      onChange={(e) =>
                                        handlePolicyChange(
                                          index,
                                          "carryForwardUnits",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter carryforward amount"
                                      suffix="/hrs/year"
                                    />
                                  )}
                                </Form.Item>

                                {/* Maximum Accrual Switch and Input */}
                                <Form.Item label="Maximum accrual">
                                  <Switch
                                    checked={
                                      policiesData[index]?.maximumAccrual
                                    }
                                    onChange={(checked) =>
                                      handlePolicyChange(
                                        index,
                                        "maximumAccrual",
                                        checked
                                      )
                                    }
                                  />
                                  {policiesData[index]?.maximumAccrual && (
                                    <Input
                                      style={{ marginTop: "10px" }}
                                      value={
                                        policiesData[index]
                                          ?.maximumAccrualAmount
                                      }
                                      onChange={(e) =>
                                        handlePolicyChange(
                                          index,
                                          "accuralUnits",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter maximum accrual"
                                      suffix="/hrs/year"
                                    />
                                  )}
                                </Form.Item>

                                {/* Encashment Switch and Input */}
                                <Form.Item label="Encash unused leave upto">
                                  <Switch
                                    checked={policiesData[index]?.encashment}
                                    onChange={(checked) =>
                                      handlePolicyChange(
                                        index,
                                        "encashment",
                                        checked
                                      )
                                    }
                                  />
                                  {policiesData[index]?.encashment && (
                                    <Input
                                      style={{ marginTop: "10px" }}
                                      value={
                                        policiesData[index]?.encashmentAmount
                                      }
                                      onChange={(e) =>
                                        handlePolicyChange(
                                          index,
                                          "EncashedUnusedLeaveUnits",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter encashment amount"
                                      suffix="/unit"
                                    />
                                  )}
                                </Form.Item>

                                {/* Reset Frequency Selector */}
                                <Form.Item label="Reset Frequency">
                                  <Select
                                    value={policiesData[index]?.resetType}
                                    onChange={(value) =>
                                      handlePolicyChange(
                                        index,
                                        "resetType",
                                        value
                                      )
                                    }
                                  >
                                    <Option value="monthly">Monthly</Option>
                                    <Option value="yearly">Yearly</Option>
                                  </Select>
                                  <div style={{ marginTop: "10px" }}>
                                    {policiesData[index]?.resetType ===
                                    "monthly"
                                      ? "On the last day of the month"
                                      : "On 31st of December"}
                                  </div>
                                </Form.Item>

                                <Divider />
                              </Form>
                            </div>
                          )
                      )}
                      <Button
                        type="primary"
                        block
                        onClick={handleSubmitTimeOff}
                      >
                        Submit
                      </Button>
                    </>
                  ) : (
                    <h3>Select a time-off policy to edit</h3>
                  )}
                </Content>
              </Layout>
            </Layout>
          )}
          {/* Render Modal */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-modal" onClick={handleCloseModal}>
                  Close
                </button>
                <GeneralTimeOff />
                {}
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>
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
