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
  Drawer,
} from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  DownloadOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
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
import GeneralTimeOff from "../../components/GeneralTimeOff";
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
import ExistingEmployee from "../../components/ExistingEmployee";
import OverviewCards from "../../components/OverviewCards";
import AddUser from "../../assets/add-user.svg";
import AddExistingUser from "../../assets/add-existing-user.svg";
import AddContactor from "../../assets/add-contactor.svg";
import QuestionMark from "../../assets/question.svg";

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
  // const [accountSetup, setAccountSetup] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [visible, setVisible] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState(null); // Content to show in the modal
  const [showAddEmployees, setShowAddEmployees] = useState(false); // State to show/hide "Add Employees"
  const [leavePolicy, setLeavePolicy] = useState(false);
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [accountSetupComplete, setAccountSetupComplete] = useState(null); // Track active tab
  const [addEmployees, setAddEmployees] = useState(false);
  const [addExistingEmployees, setAddExistingEmployees] = useState(false);
  const [addContractor, setAddContractor] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // Track if mobile/tablet view
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // This effect will collapse the sidebar on mobile or tablet, and expand it on larger screens
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 1024) {
        setIsSidebarCollapsed(false); // Collapse for mobile and tablet
        setIsMobileView(true); // It's a mobile or tablet device
      } else {
        setIsSidebarCollapsed(true); // Expand for larger screens
        setIsMobileView(false); // It's a desktop device
      }
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Open or close the drawer (sidebar in mobile/tablet view)
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  useEffect(() => {
    if (props.loginData.loginResponse) {
      let data = props.loginData.loginResponse;
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      setAccountSetupComplete(data.user.isSetupComplete);
    } else if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.user.role === "admin") {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        setAccountSetupComplete(data.user.isSetupComplete);
      }
    } else if (props.companyData.addCompanyResponse) {
      let data = props.companyData.addCompanyResponse;
      if (data.success) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        setAccountSetupComplete(data.user.isSetupComplete);
      }
    } else if (userInfo) {
      setAccountSetupComplete(userInfo.isSetupComplete);
    }
    props.loginData.loginResponse = null;
    props.userData.addUserResponse = null;
    props.companyData.addCompanyResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.loginData.loginResponse,
    props.userData.addUserResponse,
    props.companyData.addCompanyResponse,
    userInfo,
  ]);

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
      if (userInfo.role === "user") {
        setRole("user");
      } else {
        setRole("admin");
      }
    }
  }, []);

  return (
    <Layout style={layoutStyle}>
      {/* <Sider style={siderStyle} width={isSidebarCollapsed ? 300 : 30}>
        {isSidebarCollapsed ? (
          <SideBar collapse={setIsSidebarCollapsed} />
        ) : (
          <>
            <div className="collapse_container">
              <ArrowRightOutlined
                className="collapse_icon"
                onClick={toggleSidebar}
              />
            </div>
          </>
        )}
      </Sider> */}

      {/* Sidebar for Desktop View */}
      {!isMobileView && (
        <Sider
          style={{ backgroundColor: "#FFFFFF" }}
          width={isSidebarCollapsed ? 300 : 30}
        >
          {isSidebarCollapsed ? (
            <SideBar collapse={setIsSidebarCollapsed} />
          ) : (
            <div className="collapse_container">
              {/* <ArrowRightOutlined
                className="collapse_icon"
                onClick={toggleSidebar}
              /> */}
              <MenuUnfoldOutlined
                className="collapse_icon"
                onClick={toggleSidebar}
              />
            </div>
          )}
        </Sider>
      )}

      {/* Drawer for Mobile/Tablet View */}
      {isMobileView && (
        <>
          <Sider style={{ backgroundColor: "#FFFFFF" }} width={30}>
            <div className="collapse_container">
              <MenuUnfoldOutlined
                className="collapse_icon"
                onClick={toggleDrawer}
              />
            </div>
          </Sider>
          <Drawer
            style={{ padding: 0 }}
            // title="Sidebar"
            placement="left"
            // closable={false}
            onClose={toggleDrawer}
            visible={drawerVisible}
            // width={400}
          >
            <SideBar isDrawer={"drawer"} />
          </Drawer>
        </>
      )}

      <Layout>
        <Header style={headerStyle}>
          <HeaderBar />
        </Header>
        <Content style={contentStyle}>
          <div
            className="dashboard_content_container"
            style={{ width: "100%", display: "flex" }}
          >
            <div
              className={`${
                showAddEmployees || leavePolicy
                  ? "dashboard_content_center_ful"
                  : "dashboard_content_center"
              }`}
              // style={{ width: showAddEmployees ? "100%" : "70%" }}
            >
              {role === "user" ? (
                "user tabs"
              ) : // <Tabs
              //   style={{ padding: "20px" }}
              //   activeKey={activeTab}
              //   onChange={handleTabChange}
              // >
              //   <TabPane tab="Personal Details" key="1">
              //     <PeronalDetails
              //       handleTabChange={handleTabChange}
              //       tabKey={activeTab}
              //     />
              //   </TabPane>
              //   <TabPane tab="Contact Details" key="2">
              //     <ContactDetails
              //       handleTabChange={handleTabChange}
              //       tabKey={activeTab}
              //     />
              //   </TabPane>
              //   <TabPane tab="Address Details" key="3">
              //     <AddressDetails
              //       handleTabChange={handleTabChange}
              //       tabKey={activeTab}
              //     />
              //   </TabPane>
              //   <TabPane tab="Education Details" key="4">
              //     <EducationDetails
              //       handleTabChange={handleTabChange}
              //       tabKey={activeTab}
              //     />
              //   </TabPane>
              //   <TabPane tab="Visa Details" key="5" tabKey={activeTab}>
              //     <VisaDetails />
              //   </TabPane>
              // </Tabs>

              !accountSetupComplete ? (
                <AccountSetup showModal={accountSetupComplete} />
              ) : showAddEmployees ? (
                addExistingEmployees ? (
                  <div>
                    <ExistingEmployee
                      existingEmployees={() => setAddExistingEmployees()}
                    />
                  </div>
                ) : (
                  // <div
                  //   style={{
                  //     padding: "20px",
                  //     maxWidth: "800px",
                  //     margin: "0 auto",
                  //   }}
                  // >
                  //   <Title
                  //     level={2}
                  //     style={{
                  //       textAlign: "center",
                  //       marginBottom: "30px",
                  //     }}
                  //   >
                  //     Add Employees
                  //   </Title>
                  //   <Row gutter={[16, 16]}>
                  //     {employeeData.map((item, index) => (
                  //       <Col span={24} key={index}>
                  //         <Card
                  //           className="employee-card"
                  //           onClick={() => handleCardClick(item)}
                  //         >
                  //           <Row align="middle" gutter={[16, 16]}>
                  //             <Col flex="auto">
                  //               <Title level={4}>{item.title}</Title>
                  //               <Text>{item.description}</Text>
                  //               <div>
                  //                 <Link href="#" style={{ color: "#1890ff" }}>
                  //                   {item.link}
                  //                 </Link>
                  //               </div>
                  //             </Col>
                  //             <Col>
                  //               <RightOutlined
                  //                 style={{
                  //                   fontSize: "18px",
                  //                   color: "#1890ff",
                  //                 }}
                  //               />
                  //             </Col>
                  //           </Row>
                  //         </Card>
                  //       </Col>
                  //     ))}
                  //   </Row>
                  //   <Modal
                  //     title={modalContent?.title}
                  //     visible={visible}
                  //     onCancel={handleCloseModal}
                  //     width="50%"
                  //     footer={null}
                  //     bodyStyle={{
                  //       maxHeight: "70vh",
                  //       overflowY: "auto",
                  //       overflowX: "hidden",
                  //     }}
                  //   >
                  //     <div>
                  //       {modalContent?.value == 1 ? (
                  //         <AddEmployee onClose={handleCloseModal} />
                  //       ) : modalContent?.value == 2 ? (
                  //         <ExistingEmployee onClose={handleCloseModal} />
                  //       ) : (
                  //         "Hello 3"
                  //       )}
                  //     </div>
                  //   </Modal>
                  //   <Button
                  //     type="primary"
                  //     onClick={() => setShowAddEmployees(false)}
                  //     style={{
                  //       backgroundColor: "#1890ff",
                  //       borderColor: "#1890ff",
                  //       color: "#fff",
                  //       width: "100px",
                  //       marginTop: "20px",
                  //     }}
                  //   >
                  //     Back
                  //   </Button>
                  // </div>
                  <div className="add-employee-container">
                    <div className="add-employee-heading">
                      <div>
                        <div className="add-employee-title">
                          Create Employee Profile
                        </div>
                        <div className="add-employee-desc">
                          Create a comprehensive employee profile to streamline
                          HR processes
                        </div>
                      </div>
                      <div className="add-employee-help">
                        <img src={QuestionMark} alt="Q Mark" />
                        Need help?
                      </div>
                    </div>

                    <div className="add-employee-cards">
                      <div className="add-employee-card-1">
                        <div className="add-employee-card-items-wrapper">
                          <div
                            className="add-employee-card-icon-container"
                            // style={{ backgroundColor: card.backgoundColor }}
                          >
                            <div
                              style={{
                                backgroundColor: "#ED1C24",
                                borderRadius: "50%",
                                height: "48px",
                                width: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                className="add-employee-card-icon"
                                src={AddUser}
                                alt="Icon"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="add-employee-card-title">
                              Add New Employee
                            </div>
                            <div className="add-employee-card-description">
                              Add a new employee to the system.{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="add-employee-card-2"
                        onClick={() => {
                          setAddExistingEmployees(true);
                        }}
                      >
                        <div className="add-employee-card-items-wrapper">
                          <div
                            className="add-employee-card-icon-container"
                            // style={{ backgroundColor: card.backgoundColor }}
                          >
                            <div
                              style={{
                                backgroundColor: "#007DC5",
                                borderRadius: "50%",
                                height: "48px",
                                width: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                className="add-employee-card-icon"
                                src={AddExistingUser}
                                alt="Icon"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="add-employee-card-title">
                              Add Existing Employee
                            </div>
                            <div className="add-employee-card-description">
                              Bring an existing employee into the system
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-employee-card-3">
                        <div className="add-employee-card-items-wrapper">
                          <div
                            className="add-employee-card-icon-container"
                            // style={{ backgroundColor: card.backgoundColor }}
                          >
                            <div
                              style={{
                                backgroundColor: "#FFCB05",
                                borderRadius: "50%",
                                height: "48px",
                                width: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                className="add-employee-card-icon"
                                src={AddContactor}
                                alt="Icon"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="add-employee-card-title">
                              Add Contractor
                            </div>
                            <div className="add-employee-card-description">
                              Bring on a new contractor to support your team
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setShowAddEmployees(false);
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )
              ) : leavePolicy ? (
                <div style={{ padding: "20px" }}>
                  <GeneralTimeOff />
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
                </div>
              ) : (
                <div style={{ padding: "20px" }}>
                  {/* <h2>Overview</h2>
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
                    <Button className="custom-button">Add a Project</Button>
                    <Button className="custom-button">Add an Event</Button>
                    <Button className="custom-button">Add Payroll</Button>
                    <Button className="custom-button">Setup Learning</Button>
                    <Button className="custom-button">Send Offer Letter</Button>
                  </div> */}
                  <div>
                    <OverviewCards
                      addEmployees={setShowAddEmployees}
                      leavePolicy={setLeavePolicy}
                    />
                  </div>
                </div>
              )}
            </div>
            {!showAddEmployees && !leavePolicy && (
              <div
                // className="dashboard_content_right"
                // style={{ width: "30%", marginRight: "20px" }}
                className={`${
                  showAddEmployees || leavePolicy
                    ? "dashboard_content_right_ful"
                    : "dashboard_content_right"
                }`}
              >
                <Activity />
                <Calender />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  loginData: state.login,
  userData: state.user,
  companyData: state.company,
});

Dashboard.propTypes = {
  loginData: PropTypes.object,
  employeeData: PropTypes.object,
  registerData: PropTypes.object,
};

export default connect(mapStateToProps)(Dashboard);
