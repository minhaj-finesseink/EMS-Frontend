/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import mailIcon from "../../../../assets/Icons/mail.svg";
import copyIcon from "../../../../assets/Icons/copy.svg";
import QR from "../../../../assets/video-call-test-images/QR.png";
import "./style.css";

function InviteDrawer({ isOpen, onClose }) {
  return (
    <Drawer
      className="invite-drawer"
      title={<span style={{ color: "white" }}>Invite</span>}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ fontWeight: 600 }}>Details</div>
          <div style={{ cursor: "pointer" }}>
            https://ustive .meet.com/AOIWYB
          </div>
          <div style={{ cursor: "pointer" }}>Dial-in nfnefiubfebfbjbvv</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            backgroundColor: "#272A32",
            padding: "15px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <div style={{ width: "30px" }}>
            <img src={copyIcon} alt="copy icon" />
          </div>
          <div style={{ fontWeight: 700 }}>Copy joining info</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            backgroundColor: "#272A32",
            padding: "15px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <div style={{ width: "30px" }}>
            <img src={mailIcon} alt="mail icon" />
          </div>
          <div style={{ fontWeight: 700 }}>Join through email</div>
        </div>
        <div style={{ padding: "20px" }}>
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "10px",
              color: "#000000",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#2C2E33",
                marginBottom: "20px",
                cursor: "pointer",
              }}
            >
              https://ustive .meet.com/AOIWYB
            </div>
            <img style={{ cursor: "pointer" }} src={QR} alt="QR Code" />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default InviteDrawer;
