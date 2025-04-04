/* eslint-disable react/prop-types */
import React from "react";
import UsitiveLogo from "../../../../assets/usitive-logo.svg";
import HomeIcon1 from "../../../../assets/Video-Home-Icons/home-1.svg";
import HomeIcon2 from "../../../../assets/Video-Home-Icons/home-2.svg";
import CalendarIcon1 from "../../../../assets/Video-Home-Icons/calendar-1.svg";
import CalendarIcon2 from "../../../../assets/Video-Home-Icons/calendar-2.svg";
import ChartIcon1 from "../../../../assets/Video-Home-Icons/chart-1.svg";
import ChartIcon2 from "../../../../assets/Video-Home-Icons/chart-2.svg";
import SettingsIcon1 from "../../../../assets/Video-Home-Icons/settings-1.svg";
import SettingsIcon2 from "../../../../assets/Video-Home-Icons/settings-2.svg";
import QuestionMarkicon from "../../../../assets/Video-Home-Icons/Question-mark.svg";
import "./style.css";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      name: "Home",
      icon: activePage === "Home" ? HomeIcon2 : HomeIcon1,
    },
    {
      name: "Calendar",
      icon: activePage === "Calendar" ? CalendarIcon2 : CalendarIcon1,
    },
    {
      name: "Analytics",
      icon: activePage === "Analytics" ? ChartIcon2 : ChartIcon1,
    },
    {
      name: "Settings",
      icon: activePage === "Settings" ? SettingsIcon2 : SettingsIcon1,
    },
  ];

  const handleSelectMenu = (menu) => {
    setActivePage(menu);
  };

  return (
    <div className="video-sidebar">
      <div className="video-sidebar-logo">
        <img src={UsitiveLogo} alt="" /> usitive meet
      </div>
      <div className="video-sidebar-menu-container">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`video-sidebar-menu-item ${
              activePage === item.name ? "selected" : ""
            }`}
            onClick={() => handleSelectMenu(item.name)}
          >
            <span>
              <img src={item.icon} alt="icon" />{" "}
            </span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <div className="video-sidebar-footer-container">
        <div className="video-sidebar-footer">
          <img src={QuestionMarkicon} alt="? Icon" />
          Help
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
