import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import UsitiveLogo from "../../../assets/usitive-logo.svg";
import participantsIcon from "../../../assets/Icons/three-users-icon.svg";
import addUserIcon from "../../../assets/Icons/user-plus-icon.svg";
import pollIcon from "../../../assets/Icons/poll-icon.svg";
import boardIcon from "../../../assets/Icons/board-icon.svg";
import captionIcon from "../../../assets/Icons/caption-icon.svg";
import settingsIcon from "../../../assets/Icons/settings-icon.svg";
import recordIcon from "../../../assets/Icons/record-icon.svg";
import recordRedIcon from "../../../assets/Icons/record-icon-red.svg";
import pauseIcon from "../../../assets/Icons/pause-icon.svg";
import mediaStopIcon from "../../../assets/Icons/media-stop-icon.svg";
import infoIcon from "../../../assets/Icons/information-icon.svg";
import gridIcon from "../../../assets/Icons/grid-icon.svg";
import micIcon from "../../../assets/Icons/mic-icon.svg";
import videoIcon from "../../../assets/Icons/camera video.svg";
import arrowUpIcon from "../../../assets/Icons/arrow up.svg";
import handRaiseIcon from "../../../assets/Icons/hand raise.svg";
import emojiIcon from "../../../assets/Icons/emoji.svg";
import chatIcon from "../../../assets/Icons/chat.svg";
import AIIcon from "../../../assets/Icons/AI Generate.svg";
import crossIcon from "../../../assets/Icons/cross.svg";
import ParticipantsDrawer from "./ParticipantsDrawer";
import InviteDrawer from "./InviteDrawer";
import PollDrawer from "./PollDrawer";
import Video from "../Test/Room";
import "./style.css";

function VideoHomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
  };

  const toggleParticipantsPanel = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
  };

  const toggleInvitePanel = () => {
    setIsInviteOpen(!isInviteOpen);
  };

  const togglePollPanel = () => {
    setIsPollOpen(!isPollOpen);
  };

  const menuItems = [
    {
      number: "4",
      icon: participantsIcon,
      text: "Participants",
      onClick: toggleParticipantsPanel,
    },
    {
      icon: addUserIcon,
      text: "invite",
      onClick: toggleInvitePanel,
    },
    {
      icon: pollIcon,
      text: "Poll",
      onClick: togglePollPanel,
    },
    {
      icon: boardIcon,
      text: "White board",
    },
    {
      icon: captionIcon,
      text: "Caption",
    },
    {
      icon: settingsIcon,
      text: "Settings",
    },
  ];

//   const meetingAction = [
//     {
//       icon: micIcon,
//       text: "Mute",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: videoIcon,
//       text: "Stop video",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: arrowUpIcon,
//       text: "Share",
//       backgroundColor: "#009A4E",
//     },
//     {
//       icon: handRaiseIcon,
//       text: "Hand raise",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: emojiIcon,
//       text: "Reaction",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: chatIcon,
//       text: "Chat",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: AIIcon,
//       text: "AI",
//       backgroundColor: "#272A32",
//     },
//     {
//       icon: crossIcon,
//       text: "End meeting",
//       backgroundColor: "#ED1C24",
//     },
//   ];

  return (
    <div className="video-home-container">
      <div className="video-home-left-menu-container">
        <div className="video-logo">
          <img src={UsitiveLogo} alt="Usitive Logo" />
          <div className="video-logo-text">usitive meet</div>
        </div>
        <div className="video-home-menu-items">
          {menuItems.map((menu, index) => (
            <motion.div
              key={index}
              className="video-home-menu"
              //   whileTap={{ scale: 0.9 }} // Slight press-down effect
              whileHover={{ scale: 1.1 }} // Slight hover effect
              animate={{ opacity: 1, y: [5, 0] }} // Small bounce effect
              transition={{ type: "spring", stiffness: 300 }}
              onClick={menu.onClick}
            >
              <div className="video-menu">
                {menu.number && <div>{menu.number}</div>}
                <img src={menu.icon} alt={`${menu.text} icon`} />
              </div>
              <div style={{ marginTop: "5px" }}>{menu.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="video-home-main-container">
        {/* <div className="video-home-header">
          <div style={{ width: "150px" }}>
            <motion.div
              className="video-record-container"
              onClick={handleRecordClick}
              animate={{ width: isRecording ? 150 : 100 }}
              transition={{
                duration: 0.6,
                // ease: "easeOut",
                stiffness: 500, // More bounce effect
                damping: 15, // Controls how fast it settles
                type: "spring",
              }}
            >
              <div className="video-record">
                <img
                  src={isRecording ? recordRedIcon : recordIcon}
                  alt="record icon"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isRecording ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {" "}
                      <span>{"00:00"}</span>{" "}
                      <img src={pauseIcon} alt="pause icon" />
                      <img src={mediaStopIcon} alt="media stop icon" />
                    </div>
                  ) : (
                    "Record"
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div className="video-header-title-container">
            <div className="video-header-title">Quaterly planning meeting</div>
            <div className="video-header-time">10:36 pm</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={infoIcon} alt="info icon" />{" "}
              <span style={{ fontWeight: 500 }}>Meeting Agenda</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={gridIcon} alt="grid icon" />{" "}
              <span style={{ fontWeight: 500 }}>Layouts</span>
            </div>
          </div>
        </div> */}
        {/* <div className="video-home-meeting-container"> */}
            <Video />

          {/* Participants Side Panel */}
          {/* <ParticipantsDrawer
            isOpen={isParticipantsOpen}
            onClose={() => setIsParticipantsOpen(false)}
            participants={participants}
          /> */}

          {/* Invite Side Panel */}
          <InviteDrawer
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
          />

          {/* Poll Side Panel */}
          <PollDrawer
            isOpen={isPollOpen}
            onClose={() => setIsPollOpen(false)}
          />
        </div>
        {/* <div className="meeting-actions-container">
          {meetingAction.map((item, index) => (
            <motion.div
              key={index}
              className="video-home-menu"
              // whileTap={{ scale: 0.9 }} // Slight press-down effect
              whileHover={{ scale: 1.1 }} // Slight hover effect
              animate={{ opacity: 1, y: [5, 0] }} // Small bounce effect
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="video-menu"
                style={{ backgroundColor: item.backgroundColor }}
              >
                <img src={item.icon} alt={`${item.text} icon`} />
              </div>
              <div style={{ marginTop: "10px" }}>{item.text}</div>
            </motion.div>
          ))}
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default VideoHomeScreen;
