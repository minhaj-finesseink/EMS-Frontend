import React, { useState } from "react";
import {
  FaHome,
  FaCalendar,
  FaComments,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import Logo from "../../../assets/usitive-logo.svg";
import "./style.css";

function SideBar({ setActivePage }) {
  const [selected, setSelected] = useState("Home");

  const menuItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Calendar", icon: <FaCalendar /> },
    { name: "Chat", icon: <FaComments /> },
    { name: "Analytics", icon: <FaChartBar /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  const handleItemClick = (name) => {
    setSelected(name);
    setActivePage(name);
  };

  return (
    <div className="video-sidebar">
      <div className="video-sidebar-logo">
        <img
          style={{ height: "28px", width: "28px" }}
          src={Logo}
          alt="usitive logo"
        />
        <div style={{ fontSize: "24px", fontWeight: 600 }}>usitive meet</div>
      </div>
      <div style={{ padding: "60px 30px" }}>
        <ul>
          {menuItems.map(({ name, icon }) => (
            <li
              key={name}
              className={selected === name ? "selected" : ""}
              onClick={() => handleItemClick(name)}
            >
              {icon} <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
