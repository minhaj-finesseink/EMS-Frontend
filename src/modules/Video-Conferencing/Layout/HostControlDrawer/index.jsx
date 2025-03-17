/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./style.css";

function HostControl({ isOpen, onClose }) {
  return (
    <div>
      {/* Drawer Component */}
      <Drawer
        className="host-drawer"
        title={<span style={{ color: "white" }}>Host Control</span>}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={400} // Adjust width as needed
        closeIcon={
          <CloseOutlined style={{ color: "white", fontSize: "16px" }} />
        }
        styles={{
          body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
          header: {
            backgroundColor: "#1A1A1A",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
          close: { right: "20px" }, // Moves close icon to rightmost end
        }}
      >
        {/* Drawer Content */}
        <p>Test Host Control</p>
      </Drawer>
    </div>
  );
}

export default HostControl;
