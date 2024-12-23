import React from "react";
import Sidebar from "../../components/sideBar";
import "./style.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="sideBar">
        <Sidebar />
      </div>
      <div className="dashboard-wrapper">
        <div className="dashboard-header"></div>
        <div className="dashboard-content"></div>
      </div>
    </div>
  );
}

export default Dashboard;
