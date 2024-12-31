import React, { useEffect, useState } from "react";
import { Avatar, Badge, Switch, Menu, Popover, Drawer } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import SettingsIcon from "../../assets/IoSettings.png";
import BellIcon from "../../assets/bell-icon.svg";
import UsitiveLogo from "../../assets/usitive-logo-with-text.png";
import "./style.css";
import Sidebar from "../sideBar";

function Header() {
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

  const menu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Settings</Menu.Item>
      <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
  );
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
          <div className="header_title">Overview</div>
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
                checkedChildren="🌞"
                unCheckedChildren="🌙"
                style={{ backgroundColor: "#ffc107" }}
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
                      John Reese
                    </span>
                    <span style={{ color: "gray", fontSize: "12px" }}>
                      Admin
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
