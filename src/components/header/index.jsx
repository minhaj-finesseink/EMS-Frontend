/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Switch, Menu, Popover, Drawer } from "antd";
import {
  ArrowLeftOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "../../assets/IoSettings.png";
import BellIcon from "../../assets/bell-icon.svg";
import UsitiveLogo from "../../assets/usitive-logo-with-text.png";
import Sidebar from "../sideBar";
import { toSentenceCase } from "../../utils/sentenceCase";
import "./style.css";

function Header(props) {
  const navigate = useNavigate(); // Initialize navigation
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [theme, setTheme] = useState("light");
  const [isMobileView, setIsMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Open or close the drawer (sidebar in mobile/tablet view)
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  useEffect(() => {
    // Function to check device width
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 767) {
        setIsMobileView(true); // Mobile or tablet
      } else {
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

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    navigate("/sign-in"); // Redirect to login page
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Settings</Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save the selected theme in localStorage
  };

  useEffect(() => {
    // Retrieve the theme from localStorage when the component mounts
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme); // Set the theme from localStorage
    }
  }, []);

  useEffect(() => {
    // Apply the theme class to the body element after the theme is set
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  return (
    <div className="header_container">
      {isMobileView ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 20px",
          }}
        >
          <div>
            <MenuOutlined
              style={{ fontSize: "18px", color: "#000" }}
              onClick={toggleDrawer}
            />
            <Drawer
              style={{ padding: 0 }}
              // title="Sidebar"
              placement="left"
              // closable={false}
              onClose={toggleDrawer}
              visible={drawerVisible}
              width={"100%"}
            >
              <Sidebar isDrawer={"drawer"} />
            </Drawer>
          </div>
          <div>
            <img
              style={{ width: "82px" }}
              src={UsitiveLogo}
              alt="usitive logo"
            />
          </div>
          <div>
            <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" />
          </div>
        </div>
      ) : (
        <>
          <div className="header_title">
            <div
              className="header_back_button_container"
              onClick={() => {
                props.profileComplete(false);
                props.showAddEmployees(false);
                props.showLeavePolicy(false);
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: "18px", color: "black" }} />
            </div>
            Overview
          </div>
          <div className="header_right_section">
            {/* Notification Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <Badge count={6} offset={[0, 4]}>
                <img src={BellIcon} alt="bell icon" />
              </Badge>
            </div>
            {/* Light/Dark Mode Toggle */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Switch
                checked={theme === "dark"}
                checkedChildren="🌞"
                unCheckedChildren="🌙"
                style={{ backgroundColor: "#ffc107" }}
                onClick={toggleTheme}
              />
            </div>
            {/* Settings Icon */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={SettingsIcon} alt="settings icon" />
            </div>
            {/* User Info with Dropdown */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Popover
                content={menu}
                trigger="click"
                placement="bottomRight"
                overlayClassName="profile-popover"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    style={{ marginRight: "8px" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {toSentenceCase(
                        `${userInfo.firstName} ${userInfo.middleName || ""} ${
                          userInfo.lastName || ""
                        }`.trim()
                      )}
                    </span>
                    <span style={{ color: "gray", fontSize: "12px" }}>
                      {toSentenceCase(userInfo.role)}
                    </span>
                  </div>
                  <DownOutlined className="header_dropdown_down_iocn" />
                </div>
              </Popover>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
