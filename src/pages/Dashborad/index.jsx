/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Layout,
  Space,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Modal,
  Tabs,
} from "antd";
import {
  CalendarOutlined,
  DownloadOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/header";
import AttendanceAndPayroll from "../../components/attendanceAndPayroll";
import EmployeeList from "../../components/employeeList";
import TaskOverview from "../../components/taskOverview";
import Activity from "../../components/activity";
import Calender from "../../components/calender";
import AccountSetup from "../../components/Account-setup";
import AddEmployee from "../../components/AddEmployee";
import AddLeavePolicy from "../../components/AddLeavePolicy";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import AddExistingEmployee from "../../components/AddExistingEmployee";
import TabPane from "antd/es/tabs/TabPane";
import PeronalDetails from "../../components/PeronalDetails";
import ContactDetails from "../../components/ContactDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails";
import VisaDetails from "../../components/VisaDetails";

const { Header, Sider, Content } = Layout;
const { Title, Text, Link } = Typography;

const layoutStyle = { backgroundColor: "#FFFFFF" };
const siderStyle = { backgroundColor: "#FFFFFF" };
const headerStyle = {
  backgroundColor: "#FFFFFF",
  padding: "20px 20px",
  height: "85px",
};
const contentStyle = { backgroundColor: "#FFFFFF" };

function Dashboard(props) {
  const [accountSetup, setAccountSetup] = useState(null);
  const [visible, setVisible] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState(null); // Content to show in the modal
  const [showAddEmployees, setShowAddEmployees] = useState(false); // State to show/hide "Add Employees"
  const [leavePolicy, setLeavePolicy] = useState(false);
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab

  useEffect(() => {
    if (props.loginData.loginResponse) {
      let data = props.loginData.loginResponse;
      setAccountSetup(data.user.isSetupComplete);
      // Store user information in local storage
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      // if (data.user.role === "employee") {
      //   setRole("employee");
      // } else {
      //   setRole("admin");
      // }
    }

    if (props.employeeData?.addEmployeeResponse) {
      let data = props.employeeData.addEmployeeResponse;
      setAccountSetup(data.account.isSetupComplete);
    }

    if (props.registerData?.registerResponse) {
      let data = props.registerData.registerResponse;
      setAccountSetup(data.user.isSetupComplete);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
    }
  }, [props.loginData, props.employeeData, props.registerData]);

  const employeeData = [
    {
      value: 1,
      title: "Add New Employee",
      description: "An employee is a hired individual who works for a company.",
      link: "Find out more",
      imgSrc: "https://via.placeholder.com/50", // Replace with actual icon URL
    },
    {
      value: 2,
      title: "Add Existing Employee",
      description: "Independent service provider with a written contract.",
      link: "Find out more",
      imgSrc: "https://via.placeholder.com/50", // Replace with actual icon URL
    },
    {
      value: 3,
      title: "Add Contractor",
      description: "Independent service provider with a written contract.",
      link: "Find out more",
      imgSrc: "https://via.placeholder.com/50", // Replace with actual icon URL
    },
  ];

  const handleCardClick = (cardInfo) => {
    setModalContent(cardInfo); // Set the content for the modal
    setVisible(true); // Show the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setVisible(false);
    setModalContent(null);
  };

  const handleTabChange = (key) => {
    setActiveTab(key); // Update the active tab key
  };

  // New useEffect to fetch user info from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    if (userInfo) {
      if (userInfo.role === "employee") {
        setRole("employee");
      } else {
        setRole("admin");
      }
    }
  }, []);

  return (
    <Layout style={layoutStyle}>
      <Sider style={siderStyle} width={300}>
        <SideBar />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <HeaderBar />
        </Header>
        <Content style={contentStyle}>
          <div style={styles.contentTitle}>
            <h1>Dashboard</h1>
            <div style={styles.container}>
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px",
                }}
              >
                <CalendarOutlined />
                <Space size={0}>
                  <DatePicker
                    style={{ width: 87, padding: 0 }}
                    bordered={false}
                    placeholder="Start Date"
                    suffixIcon={null}
                  />
                  <span style={{ margin: "0 4px" }}>-</span>
                  <DatePicker
                    style={{ width: 87, padding: 0 }}
                    bordered={false}
                    placeholder="End Date"
                    suffixIcon={null}
                  />
                </Space>
                <DownOutlined />
              </Button>
              <Button
                type="primary"
                style={styles.exportButton}
                icon={<DownloadOutlined />}
              >
                Export to CSV
              </Button>
            </div>
          </div>
          <div style={{ width: "100%", display: "flex" }}>
            <div style={{ width: "70%" }}>
              {role === "employee" ? (
                <Tabs
                  style={{ padding: "20px" }}
                  activeKey={activeTab}
                  onChange={handleTabChange}
                >
                  <TabPane tab="Personal Details" key="1">
                    <PeronalDetails
                      handleTabChange={handleTabChange}
                      tabKey={activeTab}
                    />
                  </TabPane>
                  <TabPane tab="Contact Details" key="2">
                    <ContactDetails
                      handleTabChange={handleTabChange}
                      tabKey={activeTab}
                    />
                  </TabPane>
                  <TabPane tab="Address Details" key="3">
                    <AddressDetails
                      handleTabChange={handleTabChange}
                      tabKey={activeTab}
                    />
                  </TabPane>
                  <TabPane tab="Education Details" key="4">
                    <EducationDetails
                      handleTabChange={handleTabChange}
                      tabKey={activeTab}
                    />
                  </TabPane>
                  <TabPane tab="Visa Details" key="5" tabKey={activeTab}>
                    <VisaDetails />
                  </TabPane>
                </Tabs>
              ) : (
                <>
                  {accountSetup ? (
                    <>
                      <AttendanceAndPayroll />
                      <EmployeeList />
                      <TaskOverview />
                    </>
                  ) : (
                    <>
                      <div style={{ padding: "20px" }}>
                        {showAddEmployees ? (
                          <div
                            style={{
                              padding: "20px",
                              maxWidth: "800px",
                              margin: "0 auto",
                            }}
                          >
                            <Title
                              level={2}
                              style={{
                                textAlign: "center",
                                marginBottom: "30px",
                              }}
                            >
                              Add Employees
                            </Title>
                            <Row gutter={[16, 16]}>
                              {employeeData.map((item, index) => (
                                <Col span={24} key={index}>
                                  <Card
                                    className="employee-card"
                                    onClick={() => handleCardClick(item)}
                                  >
                                    <Row align="middle" gutter={[16, 16]}>
                                      <Col flex="auto">
                                        <Title level={4}>{item.title}</Title>
                                        <Text>{item.description}</Text>
                                        <div>
                                          <Link
                                            href="#"
                                            style={{ color: "#1890ff" }}
                                          >
                                            {item.link}
                                          </Link>
                                        </div>
                                      </Col>
                                      <Col>
                                        <RightOutlined
                                          style={{
                                            fontSize: "18px",
                                            color: "#1890ff",
                                          }}
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                            <Modal
                              title={modalContent?.title}
                              visible={visible}
                              onCancel={handleCloseModal}
                              footer={null}
                              bodyStyle={{
                                maxHeight: "70vh",
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                            >
                              <div>
                                {modalContent?.value == 1 ? (
                                  <AddEmployee onClose={handleCloseModal} />
                                ) : modalContent?.value == 2 ? (
                                  <AddExistingEmployee />
                                ) : (
                                  "Hello 3"
                                )}
                              </div>
                            </Modal>
                            {/* Back Button */}
                            <Button
                              type="primary"
                              onClick={() => setShowAddEmployees(false)}
                              style={{
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                color: "#fff",
                                width: "100px",
                                marginTop: "20px",
                              }}
                            >
                              Back
                            </Button>
                          </div>
                        ) : leavePolicy ? (
                          <>
                            <AddLeavePolicy />
                            <div>
                              <Button
                                type="primary"
                                onClick={() => setLeavePolicy(false)}
                                style={{
                                  backgroundColor: "#1890ff",
                                  borderColor: "#1890ff",
                                  color: "#fff",
                                  width: "100px",
                                  marginTop: "20px",
                                  marginLeft: "20px",
                                }}
                              >
                                Back
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <AccountSetup />
                            <h2>Overview</h2>
                            <div className="button-container">
                              <Button
                                className="custom-button"
                                onClick={() => setShowAddEmployees(true)}
                              >
                                Add User
                              </Button>
                              <Button
                                className="custom-button"
                                onClick={() => setLeavePolicy(true)}
                              >
                                Setup Leave Policy
                              </Button>
                              <Button className="custom-button">
                                Add a Project
                              </Button>
                              <Button className="custom-button">
                                Add an Event
                              </Button>
                              <Button className="custom-button">
                                Add Payroll
                              </Button>
                              <Button className="custom-button">
                                Setup Learning
                              </Button>
                              <Button className="custom-button">
                                Send Offer Letter
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div style={{ width: "30%", marginRight: "20px" }}>
              <Activity />
              <Calender />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  exportButton: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    borderRadius: "8px",
    color: "#fff",
    width: "150px",
  },
  contentTitle: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
};

const mapStateToProps = (state) => ({
  loginData: state.login,
  employeeData: state.addEmployee,
  registerData: state.register,
});

Dashboard.propTypes = {
  loginData: PropTypes.object,
  employeeData: PropTypes.object,
  registerData: PropTypes.object,
};

export default connect(mapStateToProps)(Dashboard);
