/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion } from "framer-motion";
import micIcon from "../../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../../assets/Icons/camera video.svg";
import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
import arrowUpIcon from "../../../../assets/Icons/arrow up.svg";
import handRaiseIcon from "../../../../assets/Icons/hand raise.svg";
import emojiIcon from "../../../../assets/Icons/emoji.svg";
import chatIcon from "../../../../assets/Icons/chat.svg";
import AIIcon from "../../../../assets/Icons/AI Generate.svg";
import crossIcon from "../../../../assets/Icons/cross.svg";
import captionIcon from "../../../../assets/Icons/caption-icon.svg";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./style.css";

function RoomFooter({
  caption,
  pagination,
  toggleVideo,
  toggleAudio,
  isAudioEnabled,
  isVideoEnabled,
  toggleScreenShare,
  isScreenSharing,
}) {
  const { currentPage, totalPages, setCurrentPage } = pagination;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCaption = () => {
    caption((prev) => !prev);
  };

  const meetingAction = [
    {
      icon: isAudioEnabled ? micIcon : micMuteIcon,
      text: isAudioEnabled ? "Mute" : "Unmute",
      backgroundColor: "#272A32",
      onClick: toggleAudio,
    },
    {
      icon: isVideoEnabled ? videoIcon : videoOffIcon,
      text: isVideoEnabled ? "Stop video" : "Start video",
      backgroundColor: "#272A32",
      onClick: toggleVideo,
    },
    {
      icon: arrowUpIcon,
      text: isScreenSharing ? "Stop" : "Share",
      backgroundColor: isScreenSharing ? "#ED1C24" : "#009A4E",
      onClick: toggleScreenShare,
    },
    {
      icon: handRaiseIcon,
      text: "Hand raise",
      backgroundColor: "#272A32",
    },
    {
      icon: emojiIcon,
      text: "Reaction",
      backgroundColor: "#272A32",
    },
    {
      icon: chatIcon,
      text: "Chat",
      backgroundColor: "#272A32",
    },
    {
      icon: AIIcon,
      text: "AI",
      backgroundColor: "#272A32",
    },
    {
      icon: captionIcon,
      text: "Caption",
      onClick: handleCaption,
    },
    {
      icon: crossIcon,
      text: "End meeting",
      backgroundColor: "#ED1C24",
      //   onClick: endMeeting,
    },
  ];

  return (
    <div className="room-button-container">
      {meetingAction.map((item, index) => (
        <motion.div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
          whileHover={{ scale: 1.1 }} // Slight hover effect
          animate={{ opacity: 1, y: [5, 0] }} // Small bounce effect
          transition={{ type: "spring", stiffness: 300 }}
          onClick={item.onClick}
        >
          <div className="room-button-icon">
            <img src={item.icon} alt={`${item.text} icon`} />
          </div>
          <span>{item.text}</span>
        </motion.div>
      ))}
      {totalPages > 1 && (
        <div className="room-pagination">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            style={{
              background: "none",
              border: 0,
              color: "white",
              fontSize: "20px",
            }}
          >
            <ArrowLeftOutlined />
          </button>{" "}
          <button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            style={{
              background: "none",
              border: 0,
              color: "white",
              fontSize: "20px",
            }}
          >
            <ArrowRightOutlined />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

export default RoomFooter;
