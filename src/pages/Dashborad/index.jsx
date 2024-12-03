/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Layout, Space, DatePicker, Button } from "antd";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/header";
import AttendanceAndPayroll from "../../components/attendanceAndPayroll";
import {
  CalendarOutlined,
  DownloadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import EmployeeList from "../../components/employeeList";
import TaskOverview from "../../components/taskOverview";
import Activity from "../../components/activity";
import Calender from "../../components/calender";
import AccountSetup from "../../components/Account-setup";
const { Header, Sider, Content } = Layout;
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

  useEffect(() => {
    if (props.loginData.loginResponse) {
      let data = props.loginData.loginResponse;
      setAccountSetup(data.user.isSetupComplete);
    }

    if (props.employeeData?.addEmployeeResponse) {
      let data = props.employeeData.addEmployeeResponse;
      setAccountSetup(data.account.isSetupComplete);
    }

    if (props.registerData?.registerResponse) {
      let data = props.registerData.registerResponse;
      setAccountSetup(data.user.isSetupComplete);
    }
  }, [props.loginData, props.employeeData, props.registerData]);

  return (
    <Layout style={layoutStyle}>
      <Sider style={siderStyle} width={300}>
        <>
          <SideBar />
        </>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <HeaderBar />
        </Header>
        <Content style={contentStyle}>
          <div style={styles.contentTitle}>
            <h1>Dashboard</h1>
            <div style={styles.container}>
              {/* Date Picker */}
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
                    // value={dates && dates[0]}
                    // onChange={(date) => handleDateChange([date, dates?.[1]])}
                    bordered={false}
                    placeholder="Start Date"
                    suffixIcon={null}
                  />
                  <span style={{ margin: "0 4px" }}>-</span>
                  <DatePicker
                    style={{ width: 87, padding: 0 }}
                    // value={dates && dates[1]}
                    // onChange={(date) => handleDateChange([dates?.[0], date])}
                    bordered={false}
                    placeholder="End Date"
                    suffixIcon={null}
                  />
                </Space>
                <DownOutlined />
              </Button>

              {/* Export Button */}
              <Button
                type="primary" 
                style={styles.exportButton}
                icon={<DownloadOutlined />}
                // onClick={onExport}
              >
                Export to CSV
              </Button>
            </div>
          </div>
          {/* Main content */}
          <div style={{ width: "100%", display: "flex" }}>
            <div style={{ width: "70%" }}>
              {/* Conditional Rendering for Account Setup or Main Components */}
              {accountSetup ? (
                <>
                  <AttendanceAndPayroll />
                  <EmployeeList />
                  <TaskOverview />
                </>
              ) : (
                <AccountSetup />
              )}
            </div>
            {/* Right panel */}
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
  datePickerContainer: {
    flex: 1,
    width: "220px",
  },
  datePicker: {
    borderRadius: "8px",
  },
  exportButton: {
    backgroundColor: "#28a745", // Green color
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

const mapDispatchToProps = (dispatch) => ({
  // login: (values) => dispatch(login(values)),
});

Dashboard.propTypes = {
  login: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
