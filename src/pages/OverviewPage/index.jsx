/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Activity from "../../components/activity";
import Calender from "../../components/calender";
import OverviewCards from "../../components/OverviewCards";
import GeneralTimeOff from "../../components/GeneralTimeOff";
import PeronalDetails from "../../components/PeronalDetails";
import ContactDetails from "../../components/ContactDetails";
import AddressDetails from "../../components/AddressDetails";
import EducationDetails from "../../components/EducationDetails";
import ExistingEmployee from "../../components/ExistingEmployee";
import AddExistingUser from "../../assets/add-existing-user.svg";
import AddContactor from "../../assets/add-contactor.svg";
import QuestionMark from "../../assets/question.svg";
import AccountSetup from "../../components/Account-setup";
import "./style.css";

function Dashboard(props) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  // const [showAddEmployees, setShowAddEmployees] = useState(false); // State to show/hide "Add Employees"
  // const [leavePolicy, setLeavePolicy] = useState(false);
  const [role, setRole] = useState("");
  const [accountSetupComplete, setAccountSetupComplete] = useState(null); // Track active tab
  const [addExistingEmployees, setAddExistingEmployees] = useState(false);
  // const [drawerVisible, setDrawerVisible] = useState(false);
  // const [isTabView, setIsTabView] = useState(false); // Track if tablet view
  // const [isDesktopView, setIsDesktopView] = useState(false); // Track if desktop view
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [tabsDisabled, setTabsDisabled] = useState({
    1: false,
    2: true,
    3: true,
    4: true,
  });
  // const [profileComplete, setProfileComplete] = useState(false);

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
    // props.companyData.addCompanyResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.loginData.loginResponse,
    props.userData.addUserResponse,
    props.companyData.addCompanyResponse,
    userInfo,
  ]);

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

  const handleTabChange = (key) => {
    setActiveTab(key); // Update the active tab key
  };

  // Function to enable the next tab (to be called from child components)
  const enableNextTab = (tabKey) => {
    setTabsDisabled((prevState) => ({
      ...prevState,
      [tabKey]: false,
    }));
  };

  return (
    <div
      className="dashboard_content_container"
      style={{ width: "100%", display: "flex" }}
    >
      <div
        className={`${
          props.showAddEmployees ||
          props.leavePolicy ||
          role === "user" ||
          props.profileComplete
            ? "dashboard_content_center_ful"
            : "dashboard_content_center"
        }`}
      >
        {role === "user" || props.profileComplete ? (
          <div className="user_tabs_container">
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane tab="Personal Details" key="1">
                <PeronalDetails
                  tabKey={activeTab}
                  handleTabChange={handleTabChange}
                  enableNextTab={enableNextTab} // Passing function to enable next tab
                />
              </TabPane>
              <TabPane tab="Contact Details" key="2" disabled={tabsDisabled[2]}>
                <ContactDetails
                  tabKey={activeTab}
                  handleTabChange={handleTabChange}
                />
              </TabPane>
              <TabPane tab="Address Details" key="3" disabled={tabsDisabled[3]}>
                <AddressDetails
                  tabKey={activeTab}
                  handleTabChange={handleTabChange}
                />
              </TabPane>
              <TabPane
                tab="Education Details"
                key="4"
                disabled={tabsDisabled[4]}
              >
                <EducationDetails
                  tabKey={activeTab}
                  handleTabChange={handleTabChange}
                  profileComplete={props.setProfileComplete}
                />
              </TabPane>
            </Tabs>
          </div>
        ) : !accountSetupComplete ? (
          <AccountSetup showModal={accountSetupComplete} />
        ) : props.showAddEmployees ? (
          addExistingEmployees ? (
            <div>
              <ExistingEmployee
                existingEmployees={() => setAddExistingEmployees()}
              />
            </div>
          ) : (
            <div className="add-employee-container">
              <div className="add-employee-heading">
                <div>
                  <div className="add-employee-title">
                    Create Employee Profile
                  </div>
                  <div className="add-employee-desc">
                    Create a comprehensive employee profile to streamline HR
                    processes
                  </div>
                </div>
                <div className="add-employee-help">
                  <img src={QuestionMark} alt="Q Mark" />
                  Need help?
                </div>
              </div>

              <div className="add-employee-cards">
                <div
                  className="add-employee-card-2"
                  onClick={() => {
                    setAddExistingEmployees(true);
                  }}
                >
                  <div className="add-employee-card-items-wrapper">
                    <div className="add-employee-card-icon-container">
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
                        Add Employee
                      </div>
                      <div className="add-employee-card-description">
                        Bring an employee into the system
                      </div>
                    </div>
                  </div>
                </div>
                <div className="add-employee-card-3">
                  <div className="add-employee-card-items-wrapper">
                    <div className="add-employee-card-icon-container">
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
              </div>
            </div>
          )
        ) : props.leavePolicy ? (
          <div style={{ padding: "20px" }}>
            <GeneralTimeOff />
          </div>
        ) : (
          <div>
            <div>
              <OverviewCards
                addEmployees={props.setShowAddEmployees}
                leavePolicy={props.setLeavePolicy}
                profileComplete={props.setProfileComplete}
              />
            </div>
          </div>
        )}
      </div>
      {!props.showAddEmployees &&
        !props.leavePolicy &&
        role !== "user" &&
        !props.profileComplete && (
          <div
            className={`${
              props.showAddEmployees || props.leavePolicy || role === "user"
                ? "dashboard_content_right_ful"
                : "dashboard_content_right"
            }`}
          >
            <Activity />
            <Calender />
          </div>
        )}
    </div>
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
