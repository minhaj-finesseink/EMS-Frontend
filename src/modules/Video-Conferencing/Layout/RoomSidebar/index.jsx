import React from "react";
import { motion } from "framer-motion";
import UsitiveLogo from "../../../../assets/usitive-logo.svg";
import participantsIcon from "../../../../assets/Icons/three-users-icon.svg";
import addUserIcon from "../../../../assets/Icons/user-plus-icon.svg";
import pollIcon from "../../../../assets/Icons/poll-icon.svg";
import boardIcon from "../../../../assets/Icons/board-icon.svg";
import captionIcon from "../../../../assets/Icons/caption-icon.svg";
import settingsIcon from "../../../../assets/Icons/settings-icon.svg";
import gridIcon from "../../../../assets/Icons/grid-icon.svg";
import "./style.css";

function RoomSideBar() {
  const menuItems = [
    {
      number: "4",
      icon: participantsIcon,
      text: "Participants",
      // onClick: toggleParticipantsPanel,
    },
    {
      icon: addUserIcon,
      text: "Invite",
      // onClick: toggleInvitePanel,
    },
    {
      icon: pollIcon,
      text: "Poll",
      // onClick: togglePollPanel,
    },
    {
      icon: boardIcon,
      text: "White board",
    },
    // {
    //   icon: captionIcon,
    //   text: "Caption",
    // },
    { icon: gridIcon, text: "Breakouts" },
    { icon: participantsIcon, text: "Host Control" },
    {
      icon: settingsIcon,
      text: "Settings",
    },
  ];

  return (
    <div className="room-sidebar-container">
      <div className="room-sidebar-logo">
        <img src={UsitiveLogo} alt="usitive logo" />
        <div className="room-sidebar-title">usitive meet</div>
      </div>
      <div className="room-sidebar-items-container">
        {menuItems.map((menu, index) => (
          <motion.div
            key={index} //   whileTap={{ scale: 0.9 }} // Slight press-down effect
            whileHover={{ scale: 1.1 }} // Slight hover effect
            animate={{ opacity: 1, y: [5, 0] }} // Small bounce effect
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            // onClick={menu.onClick}
          >
            <div className="room-sidebar-items">
              <img src={menu.icon} alt={`${menu.text} icon`} />
              {menu.number && <span>{menu.number}</span>}
            </div>
            <div>{menu.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RoomSideBar;
