/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Drawer, Input, message, Modal, Popover, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import socket from "../../socket";
import searchIcon from "../../../../assets/Icons/search.svg";
import CustomButton from "../../../../components/CustomButton";
import micIcon from "../../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../../assets/Icons/camera video.svg";
import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
import InviteEmail from "../../Components/InviteEmail";
import "./style.css";

function ParticipantsDrawer({ isOpen, onClose }) {
  const colors = ["#AADDC4", "#F8F3D6", "#CCE5F3"];
  const [participants, setParticipants] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, []);

  return (
    <>
      <Drawer
        className="participants-drawer"
        title={
          <span style={{ color: "white" }}>
            Participants - {participants && Object.keys(participants).length}
          </span>
        }
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
            <div style={{ fontSize: "14px", fontWeight: 600 }}>
              ON THIS CALL - {participants && Object.keys(participants).length}
            </div>
            <div>
              <CustomButton
                style={{ width: "120px", height: "40px" }}
                color={"blue"}
                onClick={() => setIsModalOpen(true)}
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
            {participants &&
              Object.entries(participants).map(([userId, user]) => (
                <div
                  key={userId}
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
                        backgroundColor:
                          colors[
                            Object.keys(participants).indexOf(userId) %
                              colors.length
                          ],
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
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ marginBottom: "5px" }}>{user.name}</div>
                      {user.host && <div>Host</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <img
                      src={user.isAudioEnabled ? micIcon : micMuteIcon}
                      alt="mic icon"
                    />
                    <img
                      src={user.isVideoEnabled ? videoIcon : videoOffIcon}
                      alt="video icon"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Drawer>
      {/* ✅ Add People Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={null} // Hides the default close button
        styles={{
          body: { backgroundColor: "#1A1A1A", color: "white", padding: 0 },
          content: {
            backgroundColor: "#1A1A1A",
            padding: 0,
            borderRadius: "8px",
            overflow: "hidden",
          }, // Remove padding and fix border issues
        }}
        width={400}
      >
        <div
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
            padding: "15px",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
          Add People
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "16px", color: "white" }}
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div style={{ padding: "20px" }}>
          <InviteEmail />
        </div>
      </Modal>
    </>
  );
}

export default ParticipantsDrawer;
