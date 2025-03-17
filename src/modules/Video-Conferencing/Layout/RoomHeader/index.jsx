/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion } from "framer-motion";
import recordIcon from "../../../../assets/Icons/record-icon.svg";
import recordRedIcon from "../../../../assets/Icons/record-icon-red.svg";
import pauseIcon from "../../../../assets/Icons/pause-icon.svg";
import mediaStopIcon from "../../../../assets/Icons/media-stop-icon.svg";
import infoIcon from "../../../../assets/Icons/information-icon.svg";
import gridIcon from "../../../../assets/Icons/grid-icon.svg";
import "./style.css";

function RoomHeader({ openMeetingAgenda, isRecording, timer, onStartStop }) {
  return (
    <div className="room-header-container">
      <div style={{ width: "130px" }}>
        <motion.div
          className="room-header-recording-container"
          onClick={onStartStop}
          animate={{ width: isRecording ? 130 : 62 }}
          transition={{
            duration: 0.6,
            // ease: "easeOut",
            stiffness: 500, // More bounce effect
            damping: 15, // Controls how fast it settles
            type: "spring",
          }}
        >
          <img
            src={isRecording ? recordRedIcon : recordIcon}
            alt="record icon"
          />
          {isRecording ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span>{timer} </span> <img src={pauseIcon} alt="pauseb icon" />
              <img src={mediaStopIcon} alt="srop icon" />
            </div>
          ) : (
            <span>REC</span>
          )}
        </motion.div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ fontSize: "18px", fontWeight: 500 }}>
          Quaterly planning meeting
        </div>
        <div style={{ fontSize: "12px", fontWeight: 600 }}>10:36 pm</div>
      </div>
      <div className="room-header-right-section">
        <div className="room-header-right" onClick={openMeetingAgenda}>
          <div>
            <img src={infoIcon} alt="agenda icon" />
          </div>
          <div
            style={{ fontSize: "12px", fontWeight: 500, marginBottom: "3px" }}
          >
            Agenda
          </div>
        </div>
        <div className="room-header-right">
          <div>
            <img src={gridIcon} alt="layout icon" />
          </div>
          <div style={{ fontSize: "12px", fontWeight: 500 }}>Layout</div>
        </div>
      </div>
    </div>
  );
}

export default RoomHeader;
