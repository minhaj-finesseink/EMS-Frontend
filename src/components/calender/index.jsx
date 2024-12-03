import React, { useState } from "react";
import { Calendar, Card, Typography, Space } from "antd";
import "./style.css";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const onDateSelect = (date) => {
    setSelectedDate(date);
  };

  const scheduleData = [
    {
      time: "09:00",
      type: "ONLINE WEBINAR",
      title: "Skillsswap Session",
      color: "#E6F4FF",
      borderColor: "#1890FF",
    },
    {
      time: "10:30",
      type: "ONLINE WEBINAR",
      title: "Skills Webinar",
      color: "#FFF7E6",
      borderColor: "#FFA940",
    },
  ];

  return (
    <div className="calender-container">
      {/* Calendar Section */}
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Calendar
          fullscreen={false}
          headerRender={({ value, onChange }) => {
            const month = value.format("MMMM");
            const year = value.format("YYYY");
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  alignItems: "center",
                }}
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {month} {year}
                </Typography.Title>
                <div style={{ display: "flex" }}>
                  <button
                    onClick={() => onChange(value.clone().subtract(1, "month"))}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#898989",
                      fontWeight: 400,
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => onChange(value.clone().add(1, "month"))}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#898989",
                      fontWeight: 400,
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            );
          }}
          onSelect={onDateSelect}
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </div>

      {/* Schedule Section */}
      <div style={{ marginTop: 16 }}>
        <Typography.Title level={5}>Schedule</Typography.Title>
        <Typography.Text type="secondary">TODAY</Typography.Text>
        <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
          {scheduleData.map((item, index) => (
            <Card
              key={index}
              bodyStyle={{
                padding: 16,
                backgroundColor: item.color,
                borderLeft: `4px solid ${item.borderColor}`,
              }}
              style={{
                border: "none",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {item.time}
                </Typography.Title>
                <div>
                  <Typography.Text type="secondary">
                    {item.type}
                  </Typography.Text>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {item.title}
                  </Typography.Title>
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default Schedule;
