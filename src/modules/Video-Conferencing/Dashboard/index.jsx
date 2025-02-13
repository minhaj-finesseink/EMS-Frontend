import React, { useState } from "react";
import SideBar from "../Sidebar";
import Calendar from "./Pages/Calendar";
import Chat from "./Pages/Chat";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import Home from "./Pages/Home";
import "./style.css";
import Header from "../Header";

function VideoDashboard() {
  const [activePage, setActivePage] = useState("Home");

  const renderContent = () => {
    switch (activePage) {
      case "Calendar":
        return <Calendar />;
      case "Chat":
        return <Chat />;
      case "Analytics":
        return <Analytics />;
      case "Settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="video-dashboard-container">
      <SideBar setActivePage={setActivePage} />
      <div style={{ width: "calc(100% - 250px)" }}>
        <Header />
        <div className="video-dashboard-content">
          {/* <h1>{activePage}</h1> */}
          <div className="content-box">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default VideoDashboard;
