/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UsitiveLogo from "../../../../assets/usitive-logo.svg";
import participantsIcon from "../../../..//assets/NewIcons/user-1.svg";
import participants2Icon from "../../../..//assets/NewIcons/user-2.svg";
import inviteIcon from "../../../../assets/NewIcons/invite-1.svg";
import invite2Icon from "../../../../assets/NewIcons/invite-2.svg";
import pluginIcon from "../../../../assets/NewIcons/plugin-1.svg";
import settingsIcon from "../../../../assets/NewIcons/setting-1.svg";
import settings2Icon from "../../../../assets/NewIcons/setting-2.svg";
import breakoutIcon from "../../../../assets/NewIcons/breakout-1.svg";
import breakout2Icon from "../../../../assets/NewIcons/breakout-2.svg";
import hostIcon from "../../../../assets/NewIcons/host-1.svg";
import socket from "../../socket";
import "./style.css";

function RoomSideBar({
  openParticipants,
  openInvite,
  openBreakout,
  openPlugin,
  openSettings,
  openHostControl,
  participant,
  invite,
  breakout,
  plugin,
  settings,
  hostControl,
  hostData,
}) {
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, []);

  const menuItems = [
    {
      number: participants ? Object.keys(participants).length : 0,
      icon: participant ? participants2Icon : participantsIcon,
      text: "Participants",
      onClick: openParticipants,
    },
    {
      icon: invite ? invite2Icon : inviteIcon,
      text: "Invite",
      onClick: openInvite,
    },
    {
      icon: breakout ? breakout2Icon : breakoutIcon,
      text: "Breakouts",
      onClick: openBreakout,
    },
    {
      icon: pluginIcon,
      text: "Plugins",
      onClick: openPlugin,
    },
    //  {
    //       icon: hostIcon,
    //       text: "Host Control",
    //       onClick: openHostControl,
    //     },
    ...(hostData?.hostName
      ? []
      : [
          {
            icon: hostIcon,
            text: "Host Control",
            onClick: openHostControl,
          },
        ]),
    {
      icon: settings ? settings2Icon : settingsIcon,
      text: "Settings",
      onClick: openSettings,
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
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={menu.onClick}
          >
            <div className="room-sidebar-items">
              <img src={menu.icon} alt={`${menu.text} icon`} />
              {menu.number && <span>{menu.number}</span>}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 500 }}>{menu.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RoomSideBar;
