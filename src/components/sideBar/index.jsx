/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./style.css";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineMessage,
  AiOutlineClockCircle,
  AiOutlineBarChart,
} from "react-icons/ai";
import { BsPersonBadge } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import Logo from "../../assets/usitive-logo-with-text.png";
import { ArrowLeftOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Sidebar = (props) => {
  const [selectedItem, setSelectedItem] = useState("overview");

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="sidebar-container">
      <div
        className="sidebar_icon_container"
        // style={{ padding: "10px", marginBottom: "20px" }}
      >
        <img className="sidebar-logo" src={Logo} alt="Logo" />
        {props.isDrawer === "drawer" ? (
          ""
        ) : (
          <MenuFoldOutlined
            className="sidebar_collapse_icon"
            onClick={() => props.collapse(false)}
          />
        )}
      </div>
      <div className="sidebar-section-container">
        <div className="sidebar-section">
          <h3 className="section-title">Dashboard</h3>
          <div
            className={`menu-item ${
              selectedItem === "overview" ? "selected" : ""
            }`}
            onClick={() => handleSelect("overview")}
          >
            <AiOutlineHome className="menu-icon" />
            <span className="menu-text">Overview</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Employee Hub</h3>
          <div
            className={`menu-item ${
              selectedItem === "employee" ? "selected" : ""
            }`}
            onClick={() => handleSelect("employee")}
          >
            <AiOutlineUser className="menu-icon" />
            <span className="menu-text">Employee</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "organization" ? "selected" : ""
            }`}
            onClick={() => handleSelect("organization")}
          >
            <BsPersonBadge className="menu-icon" />
            <span className="menu-text">Organisation Chart</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "contacts" ? "selected" : ""
            }`}
            onClick={() => handleSelect("contacts")}
          >
            <AiOutlineMessage className="menu-icon" />
            <span className="menu-text">Contacts</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">HR & Administrative Functions</h3>
          <div
            className={`menu-item ${
              selectedItem === "attendance" ? "selected" : ""
            }`}
            onClick={() => handleSelect("attendance")}
          >
            <AiOutlineCalendar className="menu-icon" />
            <span className="menu-text">Attendance</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "timeTracker" ? "selected" : ""
            }`}
            onClick={() => handleSelect("timeTracker")}
          >
            <AiOutlineClockCircle className="menu-icon" />
            <span className="menu-text">Time Tracker</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "payroll" ? "selected" : ""
            }`}
            onClick={() => handleSelect("payroll")}
          >
            <FiSettings className="menu-icon" />
            <span className="menu-text">Payroll and Benefits</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "performance" ? "selected" : ""
            }`}
            onClick={() => handleSelect("performance")}
          >
            <AiOutlineBarChart className="menu-icon" />
            <span className="menu-text">Performance</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Employee Engagements</h3>
          <div
            className={`menu-item ${
              selectedItem === "updates" ? "selected" : ""
            }`}
            onClick={() => handleSelect("updates")}
          >
            <AiOutlineMessage className="menu-icon" />
            <span className="menu-text">Updates</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "survey" ? "selected" : ""
            }`}
            onClick={() => handleSelect("survey")}
          >
            <AiOutlineMessage className="menu-icon" />
            <span className="menu-text">Survey</span>
          </div>
          <div
            className={`menu-item ${
              selectedItem === "events" ? "selected" : ""
            }`}
            onClick={() => handleSelect("events")}
          >
            <AiOutlineMessage className="menu-icon" />
            <span className="menu-text">Events</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
