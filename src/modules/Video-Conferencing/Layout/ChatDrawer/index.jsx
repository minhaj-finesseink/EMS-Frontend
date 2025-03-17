/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import { 
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
// import ChatEmpty from "../../../../assets/Icons/Chat Empty.png";
import SendIcon from "../../../../assets/NewIcons/Send.svg";
import "./style.css";
import socket from "../../socket"; 
 
function ChatDrawer({ isOpen, onClose, meetingId, name }) {
  const [chatNav, setChatNav] = useState("everyone");
  const [messages, setMessages] = useState({}); // Store messages separately for each user
  const [groupMessages, setGroupMessages] = useState([]); // Store group messages
  const [messageInput, setMessageInput] = useState(""); // Stores input text
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji Picker State
  const [participants, setParticipants] = useState([]); // Store Participants
  const [selectedRecipient, setSelectedRecipient] = useState(null); // Selected user for direct chat
  const chatEndRef = useRef(null); // For auto-scrolling

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);
 
  useEffect(() => {
    if (!socket) return;

    // Get list of participants
    socket.on("update-participants", (participantList) => {
      const participantsArray = Object.values(participantList); // Convert Object to Array
      setParticipants(participantsArray);
    });

    // Listen for incoming group group-messages
    socket.on("group-message", ({ sender, message, file }) => {
      // Prevent adding the message twice
      if (sender !== name) {
        setGroupMessages((prev) => [
          ...prev,
          {
            sender,
            message: message || null,
            file: file
              ? {
                  name: file.name,
                  type: file.type,
                  url: file.url, // Ensure URL is included
                }
              : null,
            timestamp: new Date(),
          },
        ]);
      }
    });

    // Listen for direct messages
    socket.on("direct-message", ({ sender, recipientId, message }) => {
      setMessages((prev) => ({
        ...prev,
        [sender]: [
          ...(prev[sender] || []),
          { sender, message, timestamp: new Date() },
        ],
      }));
    });

    return () => {
      socket.off("group-message");
      socket.off("direct-message");
      socket.off("update-participants");
    };
  }, [name]);

  // Function to send message
  //   const sendMessage = () => {
  //     if (messageInput.trim() === "") return;

  //     // Emit message to the server
  //     // socket.emit("group-message", {
  //     //   meetingId,
  //     //   message: messageInput,
  //     // });

  //     if (chatNav === "everyone") {
  //       socket.emit("group-message", { meetingId, message: messageInput });
  //       setGroupMessages((prev) => [
  //         ...prev,
  //         { sender: name, message: messageInput, timestamp: new Date() },
  //       ]);
  //       // Add message to UI immediately
  //       setGroupMessages((prev) => [
  //         ...prev,
  //         { sender: name, message: messageInput, timestamp: new Date() },
  //       ]);
  //       setMessageInput(""); // Clear input
  //       setShowEmojiPicker(false);
  //     } else if (selectedRecipient) {
  //       socket.emit("direct-message", {
  //         meetingId,
  //         message: messageInput,
  //         recipientId: selectedRecipient.socketId,
  //       });

  //       setMessages((prev) => ({
  //         ...prev,
  //         [selectedRecipient.socketId]: [
  //           ...(prev[selectedRecipient.socketId] || []),
  //           { sender: "Me", message: messageInput, timestamp: new Date() },
  //         ],
  //       }));
  //     }
  //   };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    if (chatNav === "everyone") {
      // Emit message to the server
      socket.emit("group-message", { meetingId, message: messageInput });

      // ✅ Only one call to update UI immediately
      setGroupMessages((prev) => [
        ...prev,
        { sender: name, message: messageInput, timestamp: new Date() },
      ]);
    } else if (selectedRecipient) {
      socket.emit("direct-message", {
        meetingId,
        message: messageInput,
        recipientId: selectedRecipient.socketId,
      });

      setMessages((prev) => ({
        ...prev,
        [selectedRecipient.socketId]: [
          ...(prev[selectedRecipient.socketId] || []),
          { sender: "Me", message: messageInput, timestamp: new Date() },
        ],
      }));
    }

    setMessageInput(""); // Clear input
    setShowEmojiPicker(false);
  };

  // Format timestamp (4:56 PM)
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to add emoji to input field
  const addEmoji = (emoji) => {
    setMessageInput((prev) => prev + emoji.native); // Add emoji to input field
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a FormData object to send the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Emit file through socket
        socket.emit("group-message", {
          meetingId,
          file: {
            name: file.name,
            type: file.type,
            data: reader.result, // File in Base64
          },
        });

        // Show file in UI
        setGroupMessages((prev) => [
          ...prev,
          {
            sender: name,
            file: { name: file.name, type: file.type },
            timestamp: new Date(),
          },
        ]);
      };
    }
  };

  return (
    <div>
      <Drawer
        className="chat-drawer"
        title={<span style={{ color: "white" }}>Chat</span>}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={400} // Adjust width as needed
        closeIcon={
          <CloseOutlined style={{ color: "white", fontSize: "16px" }} />
        }
        styles={{
          body: {
            backgroundColor: "#1A1A1A",
            color: "white",
            padding: "20px 10px",
          },
          header: {
            backgroundColor: "#1A1A1A",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
          close: { right: "20px" }, // Moves close icon to rightmost end
        }}
      >
        <div className="chat-drawer-container">
          <div
            className="chat-navigation"
            onClick={() => setShowEmojiPicker(false)}
          >
            <div
              className="chat-navigation-selected"
              style={{
                backgroundColor: chatNav === "everyone" ? "#3D3D3E" : "#272A32",
              }}
              onClick={() => setChatNav("everyone")}
            >
              Everyone
            </div>
            <div
              className="chat-navigation-selected"
              style={{
                backgroundColor: chatNav === "direct" ? "#3D3D3E" : "#272A32",
              }}
              onClick={() => setChatNav("direct")}
            >
              Direct
            </div>
          </div>
          {/* Chat Messages */}
          <div>
            <div
              className="chat-content"
              onClick={() => setShowEmojiPicker(false)}
              style={{
                height: chatNav === "direct" ? "500px" : "450px",
              }}
            >
              {chatNav === "everyone" ? (
                <>
                  {groupMessages.length === 0 ? (
                    <div className="chat-empty">
                      {/* <img src={ChatEmpty} alt="chat empty" /> */}
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 600,
                          margin: "10px 0",
                        }}
                      >
                        Start a conversation
                      </div>
                      <div>
                        There are no messages here yet. Start a conversation by
                        sending a message.
                      </div>
                    </div>
                  ) : (
                    <div className="chat-messages">
                      {groupMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`chat-message-container ${
                            msg.sender === name ? "chat-sent" : "chat-received"
                          }`}
                        >
                          {/* Name + Time */}
                          {msg.sender !== name && (
                            <div className="chat-user-initial">
                              {msg.sender.charAt(0)}
                            </div>
                          )}
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                justifyContent:
                                  msg.sender === name
                                    ? "flex-end"
                                    : "flex-start",
                              }}
                              className="chat-message-info"
                            >
                              {msg.sender === name ? (
                                <span className="chat-user-name">You</span>
                              ) : (
                                <>
                                  <span className="chat-user-name">
                                    {msg.sender}
                                  </span>
                                </>
                              )}
                              <span className="chat-time">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>

                            {/* Message Bubble && Display File */}
                            {msg.file ? (
                              <div className="chat-message-bubble">
                                <button
                                  className="chat-file-download-button"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = msg.file.url;
                                    link.download = msg.file.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                >
                                  📎 {msg.file.name}
                                </button>
                              </div>
                            ) : (
                              <div className="chat-message-bubble">
                                {msg.message}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Search people"
                      className="chat-direct-search-input"
                    />
                    <SearchOutlined
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "gray",
                        fontSize: "18px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      margin: "30px 0",
                    }}
                  >
                    Participants
                  </div>
                  <div className="chat-participants-list">
                    <div>
                      {/* Direct Chat List */}
                      <div className="chat-participants-list">
                        {participants.length > 0 ? (
                          participants.map((user) => (
                            <div
                              key={user.socketId}
                              className={`participant-item ${
                                selectedRecipient?.socketId === user.socketId
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => setSelectedRecipient(user)}
                              style={{
                                // padding: "10px",
                                cursor: "pointer",
                                // background:
                                //   selectedRecipient?.socketId === user.socketId
                                //     ? "#3D3D3E"
                                //     : "#272A32",
                              }}
                            >
                              <div style={{ display: "flex", gap: "10px" }}>
                                <div className="chat-user-initial">
                                  {user.name.charAt(0)}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    // flexDirection: "column",
                                    // gap: "3px",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{user.name}</span>
                                  {/* <span>Can you join the meeting?</span> */}
                                </div>
                              </div>
                              {/* <div>2 mins ago</div> */}
                            </div>
                          ))
                        ) : (
                          <div className="no-participants">
                            No participants available
                          </div>
                        )}
                      </div>

                      {/* Direct Chat Messages */}
                      {selectedRecipient && (
                        <div className="chat-messages">
                          {(messages[selectedRecipient.socketId] || []).map(
                            (msg, index) => (
                              <div
                                key={index}
                                className={`chat-message-container ${
                                  msg.sender === name
                                    ? "chat-sent"
                                    : "chat-received"
                                }`}
                              >
                                <div className="chat-message-bubble">
                                  {msg.message}
                                </div>
                                <span className="chat-time">
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                            )
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Chat Input */}
            {chatNav === "everyone" && (
              <div className="chat-section">
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                >
                  <label htmlFor="file-upload" style={{ display: "flex" }}>
                    <PlusOutlined
                      style={{ fontSize: "24px", color: "white" }}
                    />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <SmileOutlined
                    style={{ fontSize: "24px", color: "white" }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                  <img
                    style={{ width: "30px", cursor: "pointer" }}
                    src={SendIcon}
                    alt="send"
                    onClick={sendMessage}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default ChatDrawer;
