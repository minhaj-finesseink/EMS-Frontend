/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Tabs,
  Select,
  Layout,
  Menu,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Switch,
  Dropdown,
  Space,
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser } from "../../redux/User/user.action";
import { getDepartment } from "../../redux/Add-department/department.action";
import { getGeneralTimeOff } from "../../redux/GeneralTimeOff/generalTimeOff.action";
import GeneralTimeOff from "../GeneralTimeOff";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;
const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const AddEmployee = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [form] = Form.useForm();
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
    address: "",
    street: "",
    state: "",
    city: "",
    zip: "",
    country: "",
    department: "",
  });
  const [accountId, setAccountId] = useState(null);
  const [changeTab, setChangeTab] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [isTimeOffVisible, setIsTimeOffVisible] = useState(false); // State to control time off visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [carryForward, setCarryForward] = useState(false);
  const [maxAccrual, setMaxAccrual] = useState(true);
  const [cashOut, setCashOut] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState("Paid Time Off");
  const [resetValue, setResetValue] = useState("");
  const [timeOffList, setTimeOffList] = useState([]);

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

  const handleDateChange = (date, dateString, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: dateString,
    });
  };

  const handleSelectChange = (value, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: value,
    });

    switch (value) {
      case "monthly":
        setResetValue("On last day of month");
        break;
      case "yearly":
        setResetValue("On 31st on Dec");
        break;
      default:
    }
  };

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

  const handleSubmit = (values) => {
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
      // console.log("data", data);
      if (data.success) {
        setActiveTab("2"); // Navigate to Benefits tab on form submission
        setChangeTab(true);
      }
    }
  }, [props.userData.addUserResponse]);

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
        setTimeOffList(policies);

        setIsTimeOffVisible(data.success);
      }
    }
  }, [props.generalTimeOffData.getGeneralTimeOffResponse]);

  useEffect(() => {
    if (props.generalTimeOffData.addGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.addGeneralTimeOffResponse;
      if (data.success) {
        props.getGeneralTimeOff(userInfo.companyId);
      }
    }
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

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
        handleCloseModal();
      }
    }
    props.generalTimeOffData.addGeneralTimeOffResponse = null;
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

  const handleMenuClick = (e) => {
    const selected = timeOffList.find((policy) => policy.key === e.key);
    setSelectedPolicy(selected.label);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {timeOffList.map((policy) => (
        <Menu.Item key={policy.key}>{policy.label}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>{getHeadingContent()}</h2>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {/* Profile Details Tab */}
        <TabPane tab="Profile Detail" key="1">
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

              <Form.Item name="phoneNumber" label="Phone">
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

              <Form.Item name="street" label="Street">
                <Input
                  name="street"
                  value={formValues.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
              </Form.Item>

              <Form.Item name="state" label="State/Province">
                <Input
                  name="state"
                  value={formValues.state}
                  onChange={handleChange}
                  placeholder="State / Province"
                />
              </Form.Item>

              <Form.Item name="city" label="City">
                <Select
                  value={formValues.city}
                  onChange={(value) => handleSelectChange(value, "city")}
                  placeholder="City"
                >
                  <Option value="city1">City 1</Option>
                  <Option value="city2">City 2</Option>
                </Select>
              </Form.Item>

              <Form.Item name="zip" label="Zip / Postal Code">
                <Input
                  name="zip"
                  value={formValues.zip}
                  onChange={handleChange}
                  placeholder="Ward"
                />
              </Form.Item>

              <Form.Item name="country" label="Country/Region">
                <Select
                  value={formValues.country}
                  onChange={(value) => handleSelectChange(value, "country")}
                  placeholder="Country / Region"
                >
                  <Option value="country1">Country 1</Option>
                  <Option value="country2">Country 2</Option>
                </Select>
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
              >
                Continue
              </Button>
            </div>
          </Form>
        </TabPane>

        {/* Benefits Tab */}
        <TabPane tab="Time Off" key="2">
          {isTimeOffVisible ? (
            <Layout style={{ background: "#fff", minHeight: "100vh" }}>
              {/* Leave Policies Section */}
              <Content style={{ padding: "20px" }}>
                <Title level={4}>Leave Policies</Title>

                {/* Leave Policies Dropdown */}
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Button style={{ marginBottom: "20px", width: "200px" }}>
                    <Space>
                      {selectedPolicy}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>

                {/* Paid Time Off Section */}
                <Title level={4}>{selectedPolicy}</Title>
                <Card bordered={false} style={{ background: "#f7f7f7" }}>
                  <Form onFinish={handleSubmit} layout="horizontal">
                    {/* Credit Hours */}
                    <Form.Item label="Credit hours" name="creditHours">
                      <Input placeholder="15" suffix="/month" />
                    </Form.Item>

                    <Divider />

                    {/* Carryforward Toggle */}
                    <Form.Item
                      label="Carryforward Unused leave upto"
                      name="carryForward"
                      valuePropName="checked"
                      initialValue={carryForward}
                    >
                      <Switch
                        onChange={(checked) => setCarryForward(checked)}
                      />
                    </Form.Item>
                    <Form.Item name="carryForwardLimit" noStyle>
                      <Input
                        placeholder="5"
                        disabled={!carryForward}
                        suffix="/hrs/year"
                      />
                    </Form.Item>

                    <Divider />

                    {/* Maximum Annual Accrual */}
                    <Form.Item
                      label="Maximum Annual Accrual limit"
                      name="maxAccrual"
                      valuePropName="checked"
                      initialValue={maxAccrual}
                    >
                      <Switch onChange={(checked) => setMaxAccrual(checked)} />
                    </Form.Item>
                    <Form.Item name="maxAccrualLimit" noStyle>
                      <Input
                        placeholder="5"
                        disabled={!maxAccrual}
                        suffix="/hrs/year"
                      />
                    </Form.Item>

                    <Divider />

                    {/* Cashout Unused Time */}
                    <Form.Item
                      label="Cashout Unused Time limit"
                      name="cashOut"
                      valuePropName="checked"
                      initialValue={cashOut}
                    >
                      <Switch onChange={(checked) => setCashOut(checked)} />
                    </Form.Item>
                    <Form.Item name="cashOutLimit" noStyle>
                      <Input
                        placeholder="5"
                        disabled={!cashOut}
                        suffix="unit"
                      />
                    </Form.Item>

                    <Divider />

                    {/* Reset */}
                    <Form.Item label="Reset" name="reset">
                      <Select
                        style={{ width: "150px" }}
                        onChange={(value) => handleSelectChange(value, "reset")}
                        value={resetValue}
                      >
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Text>{resetValue}</Text>
                    </Form.Item>

                    <Divider />

                    {/* Submit Button */}
                    <Form.Item>
                      <Button
                        style={{ width: "100px" }}
                        type="primary"
                        htmlType="submit"
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Content>
            </Layout>
          ) : (
            <Button
              type="primary"
              style={{ width: "100px" }}
              onClick={handleOpenModal}
            >
              Add Time Off
            </Button>
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
};

const mapStateToProps = (state) => ({
  userData: state.user,
  loginData: state.login,
  registerData: state.register,
  departmentData: state.department,
  generalTimeOffData: state.generalTimeOff,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
  getDepartment: (values) => dispatch(getDepartment(values)),
  getGeneralTimeOff: (values) => dispatch(getGeneralTimeOff(values)),
});

AddEmployee.propTypes = {
  addUser: PropTypes.func,
  getDepartment: PropTypes.func,
  getGeneralTimeOff: PropTypes.func,
  departmentData: PropTypes.object,
  userData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);