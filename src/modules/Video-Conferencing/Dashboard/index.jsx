import React, { useState } from "react";
import SideBar from "./Sidebar";
import Header from "./Header";
import Settings from "../Settings/SettingsMain/Settings";
import HomePage from "./NewPages/HomePage";
import Calendar from "./NewPages/Calendar";
import "./style.css";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("Home");
  const renderContent = () => {
    switch (activePage) {
      case "Calendar":
        return <Calendar />;
      // case "Chat":
      //   return <Chat />;
      // case "Analytics":
      //   return <Analytics />;
      case "Settings":
        return <Settings />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };
  return (
    <div className="video-dashboard-container">
      {/* Sidebar */}
      <aside className="video-sidebar-container">
        <SideBar activePage={activePage} setActivePage={setActivePage} />
      </aside>

      {/* Main Section */}
      <div className="video-main-content">
        {/* Header */}
        <header className="video-header-container">
          <Header />
        </header>

        {/* Scrollable Content */}
        <div className="video-dash-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
