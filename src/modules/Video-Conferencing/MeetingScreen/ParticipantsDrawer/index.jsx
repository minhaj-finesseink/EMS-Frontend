/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Drawer, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import searchIcon from "../../../../assets/Icons/search.svg";
import CustomButton from "../../../../components/CustomButton";
import micIcon from "../../../../assets/Icons/mic-icon.svg";
import videoIcon from "../../../../assets/Icons/camera video.svg";
import "./style.css";

function ParticipantsDrawer({ isOpen, onClose, participants }) {
  const colors = ["#AADDC4", "#F8F3D6", "#CCE5F3"];
  return (
    <Drawer
      className="participants-drawer"
      title={
        <span style={{ color: "white" }}>
          Participants - {participants.length}
        </span>
      }
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400} // Adjust width as needed
      closeIcon={<CloseOutlined style={{ color: "white", fontSize: "16px" }} />}
      styles={{
        body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
        header: {
          backgroundColor: "#1A1A1A",
          //   borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        close: { right: "20px" }, // Moves close icon to rightmost end
      }}
    >
      {/* Search Bar */}
      <Input
        className="participant-search-input"
        placeholder="Search people"
        prefix={<img src={searchIcon} alt="Search" />}
        style={{
          backgroundColor: "#252525",
          borderColor: "#6D6D6D",
          color: "white",
          marginBottom: "15px",
          borderRadius: "10px",
          height: "43px",
        }}
      />

      <div style={{ border: "1px solid #CCCCCC2E" }}>
        <div
          style={{
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #CCCCCC2E",
          }}
        >
          <div
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            ON THIS CALL - {participants.length}
          </div>
          <div>
            <CustomButton
              style={{ width: "120px", height: "40px" }}
              color={"blue"}
            >
              Add people
            </CustomButton>
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {participants.map((participant, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    backgroundColor: colors[index % colors.length],
                    borderRadius: "50%",
                    height: "30px",
                    width: "30px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    color: "black",
                    fontWeight: 500,
                  }}
                >
                  {participant.initials}
                </div>
                <div >
                  <div style={{ marginBottom: "5px" }}>{participant.name}</div>
                  {participant.host && <div>Host</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <img src={micIcon} alt="mic icon" />
                <img src={videoIcon} alt="video icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export default ParticipantsDrawer;
