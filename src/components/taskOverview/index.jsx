import React from "react";
import { Button, DatePicker, Space } from "antd";
import { CalendarOutlined, DownOutlined } from "@ant-design/icons";
import "./style.css";

function TaskOverview() {
  return (
    <div className="task-container">
      <div>
        <div
          style={{ fontSize: "22px", color: "#FFFFFF", marginBottom: "10px" }}
        >
          Task Overview
        </div>{" "}
        {/* Date Picker */}
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "0px 10px",
            backgroundColor: "#135CCA",
            borderColor: "rgba(255, 255, 255, 0.16)",
            color: "#FFFFFF",
          }}
        >
          <CalendarOutlined />
          <Space size={0}>
            <DatePicker
              className="custom-date-picker"
              style={{ width: 87, padding: 0, color: "#FFFFFF" }}
              // value={dates && dates[0]}
              // onChange={(date) => handleDateChange([date, dates?.[1]])}
              bordered={false}
              placeholder="Start Date"
              suffixIcon={null}
            />
            <span style={{ margin: "0 4px" }}>-</span>
            <DatePicker
              className="custom-date-picker"
              style={{ width: 87, padding: 0, color: "#FFFFFF" }}
              // value={dates && dates[1]}
              // onChange={(date) => handleDateChange([dates?.[0], date])}
              bordered={false}
              placeholder="End Date"
              suffixIcon={null}
            />
          </Space>
          <DownOutlined />
        </Button>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div className="task-card1">
          <div>210</div>
          <div>Completed Task</div>
          <div></div>
        </div>{" "}
        <div className="task-card2">
          <div>15</div>
          <div>Pending Task</div>
          <div></div>
        </div>{" "}
        <div className="task-card3">
          <div>71.67%</div>
          <div>Avge progress</div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default TaskOverview;
