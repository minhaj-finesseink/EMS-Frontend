/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Popover, Tooltip } from "antd";
import socket from "../../socket";
import micIcon from "../../../../assets/NewIcons/mic-1.svg";
import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../../assets/NewIcons/video-1.svg";
import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
import shareIcon from "../../../../assets/NewIcons/share-1.svg";
import share2Icon from "../../../../assets/NewIcons/share-2.svg";
import captionIcon from "../../../../assets/NewIcons/caption-1.svg";
import caption2Icon from "../../../../assets/NewIcons/caption-2.svg";
import emojiIcon from "../../../../assets/NewIcons/emoji-1.svg";
import emoji2Icon from "../../../../assets/NewIcons/emoji-2.svg";
import handRaiseIcon from "../../../../assets/NewIcons/hand-1.svg";
import handRaise2Icon from "../../../../assets/NewIcons/hand-2.svg";
import AIIcon from "../../../../assets/NewIcons/Ai-1.svg";
import AI2Icon from "../../../../assets/NewIcons/Ai-2.svg";
import chatIcon from "../../../../assets/NewIcons/chat-1.svg";
import chat2Icon from "../../../../assets/NewIcons/chat-2.svg";
import endIcon from "../../../../assets/NewIcons/end-1.svg";
import "./style.css";

function RoomFooter({
  meetingId,
  caption,
  setCaption,
  pagination,
  toggleVideo,
  toggleAudio,
  isAudioEnabled,
  isVideoEnabled,
  toggleScreenShare,
  isScreenSharing,
  toggleHandRaise,
  isHandRaised,
  chat,
  openChat,
  AIEnable,
  AI,
  onEndMeeting,
}) {
  const navigate = useNavigate();
  const { currentPage, totalPages, setCurrentPage } = pagination;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCaption = () => {
    setCaption((prev) => !prev);
  };
  const handleEnableAI = () => {
    AIEnable((prev) => !prev);
    const newAiState = !isAIEnabled;
    setIsAIEnabled(newAiState);

    // Emit event to notify other participants
    socket.emit("note-taker", { meetingId, isNoteTakerEnabled: newAiState });
  };

  const handleReaction = (visible) => {
    setIsPopoverOpen(visible);
  };

  // Handle emoji click: Add emoji & remove after animation
  const sendReaction = (emoji) => {
    const id = Date.now(); // Unique ID for each emoji
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);

    // Remove emoji after animation completes (2 sec)
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2500);

    // Hide popover
    setIsPopoverOpen(false);

    // Socket call
    socket.emit("reaction", { meetingId, reaction: emoji });
  };

  // Reaction Content inside Popover
  const reactionContent = (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      {["👍", "❤️", "👏", "😂", "🔥", "🎉"].map((emoji) => (
        <Button
          key={emoji}
          type="text"
          className="reaction-emoji"
          onClick={() => sendReaction(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );

  const meetingAction = [
    {
      icon: isAudioEnabled ? micIcon : micMuteIcon,
      text: isAudioEnabled ? "Turn off microphone" : "Turn on microphone",
      onClick: toggleAudio,
      arrow: true,
    },
    {
      icon: isVideoEnabled ? videoIcon : videoOffIcon,
      text: isVideoEnabled ? "Turn off camera" : "Turn on camera",
      onClick: toggleVideo,
      arrow: true,
    },
    {
      icon: isScreenSharing ? share2Icon : shareIcon,
      text: isScreenSharing ? "Turn off screen share" : "Turn on screen share",
      onClick: toggleScreenShare,
    },
    {
      icon: isHandRaised ? handRaise2Icon : handRaiseIcon,
      text: isHandRaised ? "Lower hand" : "Raise hand",
      onClick: toggleHandRaise,
    },
    {
      icon: isPopoverOpen ? emoji2Icon : emojiIcon,
      text: "Send a reaction",
      popover: true,
    },
    {
      icon: chat ? chat2Icon : chatIcon,
      text: "Chat with participants",
      onClick: openChat,
    },
    {
      icon: AI ? AI2Icon : AIIcon,
      text: "Enable AI Assistant",
      onClick: handleEnableAI,
      arrow: true,
    },
    {
      icon: caption ? caption2Icon : captionIcon,
      text: caption ? "Turn off caption" : "Turn on caption",
      onClick: handleCaption,
    },
    {
      icon: endIcon,
      text: "End meeting",
      background: "#ED1C24",
      onClick: onEndMeeting,
    },
  ];

  return (
    <div className="room-button-container">
      {meetingAction.map((item, index) => (
        <Tooltip
          key={index}
          title={item.text}
          placement="top"
          overlayClassName="custom-tooltip"
          arrow={false}
        >
          <motion.div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "5px",
              position: "relative", // Required for Popover positioning
            }}
            whileHover={{ scale: 1.1 }}
            animate={{ opacity: 1, y: [5, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
            // onClick={item.onClick}
          >
            {item.popover ? (
              // Popover for the Reaction button
              <Popover
                content={reactionContent}
                // title="Select a Reaction"
                trigger="click"
                open={isPopoverOpen}
                onOpenChange={handleReaction} // Handle popover visibility
                placement="top"
                overlayClassName="custom-reaction-popover"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="room-button-icon"
                    style={{
                      background: item.background
                        ? item.background
                        : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <img src={item.icon} alt={`${item.text} icon`} />
                  </div>
                  {/* <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  {item.text}
                </span> */}
                </div>
              </Popover>
            ) : (
              // Normal buttons
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                  onClick={item.onClick}
                >
                  <div
                    className="room-button-icon"
                    style={{
                      background: item.background
                        ? item.background
                        : "transparent",
                    }}
                  >
                    <img src={item.icon} alt={`${item.text} icon`} />
                  </div>
                  {/* <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  {item.text}
                </span> */}
                </div>
                <div
                // style={{ marginTop: "20px" }}
                >
                  {/* {item.arrow && (
                  <UpOutlined
                    style={{
                      fontSize: "14px",
                      color: "#464454",
                      strokeWidth: "3",
                    }}
                  />
                )} */}
                  {item.arrow && (
                    <Popover
                      content={<div>Dummy content for {item.text}</div>}
                      trigger="click"
                      open={openPopoverIndex === index}
                      // onOpenChange={(visible) => {
                      //   setOpenPopoverIndex(visible ? index : null);
                      // }}
                      placement="top"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          cursor: "pointer",
                          marginTop: "20px",
                        }}
                      >
                        <UpOutlined
                          style={{
                            fontSize: "14px",
                            color: "white",
                            strokeWidth: "3",
                          }}
                        />
                      </div>
                    </Popover>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </Tooltip>
      ))}
      {/* Floating Emoji Animation */}
      <AnimatePresence>
        {floatingEmojis.map(({ id, emoji }) => (
          <motion.div
            key={id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="floating-emoji"
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
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
