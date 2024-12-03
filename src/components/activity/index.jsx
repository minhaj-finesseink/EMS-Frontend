import React from "react";
import { Button } from "antd";
import "./style.css";

function Activity() {
  return (
    <div>
      <div className="activity-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "0 5px 10px 5px",
          }}
        >
          <span style={{ fontSize: "22px", color: "#FFFFFF" }}>
            Recently Activity
          </span>
          <Button className="activity-btn">All activity</Button>
        </div>
        <div className="activity-content">
          <div style={{ fontSize: "14px", color: "#FFFFFF" }}>
            11:20 AM Mon 12 Sep 2023
          </div>
          <div
            style={{ fontSize: "18px", color: "#FFFFFF", marginTop: "10px" }}
          >
            We welcomed Sophia Anderson to our team as a Network Administrator.
          </div>
        </div>
        <div className="activity-card-text">Today you makes 12 Activity</div>
      </div>
    </div>
  );
}

export default Activity;
