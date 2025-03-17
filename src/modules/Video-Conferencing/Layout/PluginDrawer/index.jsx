/* eslint-disable react/prop-types */
import React from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import pollIcon from "../../../../assets/NewIcons/plugin-poll.png";
import fileIcon from "../../../../assets/NewIcons/plugin-file.png";
import excalidrawIcon from "../../../../assets/NewIcons/plugin-excalidraw.png";
import "./style.css";

function PluginDrawer({ isOpen, onClose }) {
  return (
    <Drawer
      className="plugin-drawer"
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        close: { right: "20px" }, // Moves close icon to rightmost end
      }}
    >
      {/* Add your content inside the drawer */}
      <div className="plugin-drawer-container">
        <div className="plugin-drawer-items">
          <div></div>
          <div>Whiteboard</div>
        </div>
        <div className="plugin-drawer-items">
          <div>
            <img
              src={pollIcon}
              alt="icon"
              width={"30px"}
              height={"30px"}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div>Poll and Q&A</div>
        </div>
        <div className="plugin-drawer-items">
          <div>
            <img
              src={fileIcon}
              alt="icon"
              width={"30px"}
              height={"30px"}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div>DocShare</div>
        </div>
        <div className="plugin-drawer-items">
          <div style={{ backgroundColor: "#8BFFC6" }}></div>
          <div>Streamer</div>
        </div>
        <div className="plugin-drawer-items">
          <div>
            <img
              src={pollIcon}
              alt="icon"
              width={"30px"}
              height={"30px"}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div>Rustpad v2</div>
        </div>
        <div className="plugin-drawer-items">
          <div>
            <img
              src={excalidrawIcon}
              alt="icon"
              width={"30px"}
              height={"30px"}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div>Excalidraw</div>
        </div>
      </div>
    </Drawer>
  );
}

export default PluginDrawer;
