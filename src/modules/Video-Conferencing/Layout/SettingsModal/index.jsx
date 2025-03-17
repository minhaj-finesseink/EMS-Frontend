/* eslint-disable */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal, Menu, Switch, Select, Button, Slider } from "antd";
import {
  AudioMutedOutlined,
  AudioOutlined,
  CloseOutlined,
  SoundFilled,
  SoundOutlined,
} from "@ant-design/icons";
import Settings1Icon from "../../../../assets/NewIcons/setting-1.svg";
import Settings2Icon from "../../../../assets/NewIcons/setting-2.svg";
import Mic1Icon from "../../../../assets/NewIcons/mic-1.svg";
import Mic2Icon from "../../../../assets/NewIcons/mic-2.svg";
import Video1Icon from "../../../../assets/NewIcons/video-1.svg";
import Video2Icon from "../../../../assets/NewIcons/video-2.svg";
import Recording1Icon from "../../../../assets/NewIcons/recording-1.svg";
import Recording2Icon from "../../../../assets/NewIcons/recording-2.svg";
import Board1Icon from "../../../../assets/NewIcons/board-1.svg";
import Board2Icon from "../../../../assets/NewIcons/board-2.svg";
import Share1Icon from "../../../../assets/NewIcons/share-1.svg";
import Share2Icon from "../../../../assets/NewIcons/share-2.svg";
import AI1Icon from "../../../../assets/NewIcons/Ai-1.svg";
import AI2Icon from "../../../../assets/NewIcons/Ai-2.svg";
import Scheduling1Icon from "../../../../assets/NewIcons/mail-notification-2.svg";
import Scheduling2Icon from "../../../../assets/NewIcons/mail-notification-2.svg";
import Notification1Icon from "../../../../assets/NewIcons/notification-1.svg";
import Notification2Icon from "../../../../assets/NewIcons/notification-2.svg";
import Security1Icon from "../../../../assets/NewIcons/security-1.svg";
import Security2Icon from "../../../../assets/NewIcons/security-2.svg";
import SpeakerIcon from "../../../../assets/NewIcons/speaker.svg";
import LightModeIcon from "../../../../assets/NewIcons/settings-light-mode.png";
import DarkModeIcon from "../../../../assets/newIcons/settings-dark-mode.png";
import SystemModeIcon from "../../../../assets/newIcons/settings-system-mode.png";
import "./style.css";

const { Option } = Select;

function SettingsModal({ isOpen, onClose }) {
  const [selectedMenu, setSelectedMenu] = useState("general");

  // General
  const [selectedMode, setSelectedMode] = useState("light");
  const [maxParticipants, setMaxParticipants] = useState("15");

  // Audio
  const [microphone, setMicrophone] = useState("Microphone Array (Audio)");
  const [speaker, setSpeaker] = useState("Speaker Array (Audio)");
  const [micVolume, setMicVolume] = useState(100);
  const [speakerVolume, setSpeakerVolume] = useState(100);
  const [micLevel, setMicLevel] = useState(0);
  const [speakerLevel, setSpeakerLevel] = useState(0);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);
  let micStream = null;
  let micAnimation = null;
  let speakerAnimation = null;

  // Whiteboard
  const [selected, setSelected] = useState([]);

  // Screen share
  const [screenSize, setScreenSize] = useState("full");
  const [screenShare, setScreenShare] = useState("specific");

  // AI
  const [autoShareSummary, setAutoShareSummary] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("");

  const menuItems = [
    {
      key: "general",
      icon:
        selectedMenu === "general" ? (
          <img src={Settings2Icon} alt="settings" />
        ) : (
          <img src={Settings1Icon} alt="settings" />
        ),
      label: "General",
    },
    {
      key: "audio",
      icon:
        selectedMenu === "audio" ? (
          <img src={Mic2Icon} alt="mic" />
        ) : (
          <img src={Mic1Icon} alt="mic" />
        ),
      label: "Audio",
    },
    {
      key: "video",
      icon:
        selectedMenu === "video" ? (
          <img src={Video2Icon} alt="video" />
        ) : (
          <img src={Video1Icon} alt="video" />
        ),
      label: "Video",
    },
    {
      key: "recording",
      icon:
        selectedMenu === "recording" ? (
          <img src={Recording2Icon} alt="rec" />
        ) : (
          <img src={Recording1Icon} alt="rec" />
        ),
      label: "Recording",
    },

    {
      key: "whiteboard",
      icon:
        selectedMenu === "whiteboard" ? (
          <img src={Board2Icon} alt="whiteboard" />
        ) : (
          <img src={Board1Icon} alt="whiteboard" />
        ),
      label: "Whiteboard",
    },
    {
      key: "screenShare",
      icon:
        selectedMenu === "screenShare" ? (
          <img src={Share2Icon} alt="screenShare" />
        ) : (
          <img src={Share1Icon} alt="screenShare" />
        ),
      label: "Screen Share",
    },
    {
      key: "aiAssistant",
      icon:
        selectedMenu === "aiAssistant" ? (
          <img src={AI2Icon} alt="aiAssistant" />
        ) : (
          <img src={AI1Icon} alt="aiAssistant" />
        ),
      label: "AI Assistant",
    },
    {
      key: "scheduling",
      icon:
        selectedMenu === "scheduling" ? (
          <img src={Scheduling2Icon} alt="scheduling" />
        ) : (
          <img src={Scheduling1Icon} alt="scheduling" />
        ),
      label: "Scheduling & Email",
    },
    {
      key: "notification",
      icon:
        selectedMenu === "notification" ? (
          <img src={Notification2Icon} alt="notification" />
        ) : (
          <img src={Notification1Icon} alt="notification" />
        ),
      label: "Notification",
    },
    {
      key: "security",
      icon:
        selectedMenu === "security" ? (
          <img src={Security2Icon} alt="security" />
        ) : (
          <img src={Security1Icon} alt="security" />
        ),
      label: "Security",
    },
  ];

  // 🎤 Function to Start/Stop Microphone Test
  const toggleMicTest = async () => {
    if (isMicTesting) {
      setIsMicTesting(false);
      setMicLevel(0);
      if (micStream) micStream.getTracks().forEach((track) => track.stop());
      cancelAnimationFrame(micAnimation);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream = stream;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphoneSource = audioContext.createMediaStreamSource(stream);
      microphoneSource.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function updateMicLevel() {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setMicLevel(Math.min(average, 100));
        micAnimation = requestAnimationFrame(updateMicLevel);
      }

      updateMicLevel();
      setIsMicTesting(true);
    } catch (error) {
      console.error("Microphone test failed:", error);
    }
  };

  // 🔊 Function to Start/Stop Speaker Test
  const toggleSpeakerTest = () => {
    if (isSpeakerTesting) {
      setIsSpeakerTesting(false);
      setSpeakerLevel(0);
      cancelAnimationFrame(speakerAnimation);
      return;
    }

    const testAudio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    testAudio.loop = true;
    testAudio.play();

    function updateSpeakerLevel() {
      setSpeakerLevel(Math.floor(Math.random() * 50) + 10);
      speakerAnimation = setTimeout(updateSpeakerLevel, 500);
    }

    updateSpeakerLevel();
    setIsSpeakerTesting(true);

    // Stop sound after 3 seconds
    setTimeout(() => {
      testAudio.pause();
      testAudio.currentTime = 0;
      setIsSpeakerTesting(false);
      setSpeakerLevel(0);
    }, 3000);
  };

  // Whiteboard
  const toggleCheckbox = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // AI
  const toggleSummaryAutoShareCheckbox = (value) => {
    if (autoShareSummary.includes(value)) {
      setAutoShareSummary(autoShareSummary.filter((item) => item !== value));
    } else {
      setAutoShareSummary([...autoShareSummary, value]);
    }
  };

  const toggleSummaryStyleCheckbox = (value) => {
    if (summaryStyle.includes(value)) {
      setSummaryStyle(summaryStyle.filter((item) => item !== value));
    } else {
      setSummaryStyle([...summaryStyle, value]);
    }
  };

  return (
    <div>
      {" "}
      <Modal
        // title="Settings"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        className="settings-modal"
        width="56%"
        closeIcon={null}
      >
        <div className="settings-container">
          {/* Left Sidebar Menu */}
          <Menu
            mode="vertical"
            selectedKeys={[selectedMenu]}
            onClick={(e) => setSelectedMenu(e.key)}
            className="settings-menu"
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>

          {/* Right Content Section */}
          <div className="settings-content">
            {/* Close Button on Top Right */}
            <div className="settings-close-icon" onClick={onClose}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginLeft: "30%",
                }}
              >
                General
              </div>
              <div style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </div>
            </div>
            {selectedMenu === "general" && (
              <>
                <div className="setting-item">
                  <div>
                    <div className="settings-item-title">Language</div>
                    <div className="settings-item-desc">
                      Restart meet to apply these settings
                    </div>
                  </div>
                  <Select defaultValue="en-US" className="settings-select">
                    <Option value="en-US">English (United States)</Option>
                    <Option value="fr">French</Option>
                    <Option value="es">Spanish</Option>
                  </Select>
                </div>

                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      No Participants Detected
                    </div>
                    <div className="settings-item-desc">
                      The call will close in 15 minutes unless others join.
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>

                <div style={{ padding: "10px 20px" }}>
                  <div className="settings-item-title">Appearance Modes</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    {/* Light Mode */}
                    <div
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => setSelectedMode("light")}
                    >
                      {" "}
                      <img
                        src={LightModeIcon}
                        alt="Light Mode"
                        style={{ cursor: "pointer" }}
                      />
                      <div className="appearence-mode-selecter">
                        <input
                          type="radio"
                          name="appearanceMode"
                          value="light"
                          checked={selectedMode === "light"}
                        />{" "}
                        <div className="settings-item-desc">Light Mode</div>
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => setSelectedMode("dark")}
                    >
                      <img
                        src={DarkModeIcon}
                        alt="Dark Mode"
                        style={{ cursor: "pointer" }}
                      />
                      <div className="appearence-mode-selecter">
                        <input
                          type="radio"
                          name="appearanceMode"
                          value="dark"
                          checked={selectedMode === "dark"}
                        />{" "}
                        <div className="settings-item-desc">Dark Mode</div>
                      </div>
                    </div>

                    {/* System Mode */}
                    <div
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => setSelectedMode("system")}
                    >
                      <img
                        src={SystemModeIcon}
                        alt="System Mode"
                        style={{ cursor: "pointer" }}
                      />
                      <div className="appearence-mode-selecter">
                        <input
                          type="radio"
                          name="appearanceMode"
                          value="system"
                          checked={selectedMode === "system"}
                        />{" "}
                        <div className="settings-item-desc">System Mode</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-item">
                  <div>
                    <div className="settings-item-title">
                      Maximum number of participants visible per screen in
                      gallery view
                    </div>
                    <div
                      className="settings-item-desc"
                      style={{ display: "flex", gap: "20px" }}
                    >
                      {/* 15 Participants Option */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="maxParticipants"
                          value="15"
                          checked={maxParticipants === "15"}
                          onChange={() => setMaxParticipants("15")}
                        />
                        15 Participants
                      </label>

                      {/* 25 Participants Option */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="maxParticipants"
                          value="25"
                          checked={maxParticipants === "25"}
                          onChange={() => setMaxParticipants("25")}
                        />
                        25 Participants
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedMenu === "audio" && (
              <>
                <div style={{ padding: "20px" }}>
                  <div className="settings-item-title">Microphone</div>
                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    // className="input-container"
                  >
                    <Select
                      style={{ height: "40px", width: "70%" }}
                      value={microphone}
                      onChange={setMicrophone}
                      className="settings-select"
                    >
                      <Option value="Microphone Array (Audio)">
                        Microphone Array (Audio)
                      </Option>
                      <Option value="USB Microphone">USB Microphone</Option>
                    </Select>
                    <Button
                      className={`test-button ${isMicTesting ? "active" : ""}`}
                      onClick={toggleMicTest}
                      style={{
                        height: "40px",
                        backgroundColor: "#272A32",
                        padding: "10px",
                        border: 0,
                      }}
                    >
                      <AudioOutlined /> Test
                    </Button>
                  </div>

                  {/* Input Level (Controlled by Test Button) */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                      Input level
                    </div>
                    <div className="level-bar">
                      <div
                        className="level-fill"
                        style={{ width: `${micLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="volume-control">
                    <span style={{ fontSize: "12px" }}>Volume</span>
                    <div style={{ margin: "0 10px 0 20px" }}>
                      <AudioMutedOutlined />
                    </div>
                    <span style={{ fontSize: "12px" }}>{micVolume}</span>
                    <Slider
                      value={micVolume}
                      onChange={setMicVolume}
                      className="volume-slider"
                    />
                  </div>
                </div>

                {/* Speaker Section */}
                <div style={{ padding: "0 20px" }}>
                  <div className="settings-item-title">Speaker</div>
                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Select
                      style={{ height: "40px", width: "70%" }}
                      value={speaker}
                      onChange={setSpeaker}
                      className="settings-select"
                    >
                      <Option value="Speaker Array (Audio)">
                        Speaker Array (Audio)
                      </Option>
                      <Option value="External Speaker">External Speaker</Option>
                    </Select>
                    <Button
                      className={`test-button ${
                        isSpeakerTesting ? "active" : ""
                      }`}
                      onClick={toggleSpeakerTest}
                      style={{
                        height: "40px",
                        backgroundColor: "#272A32",
                        padding: "10px",
                        border: 0,
                      }}
                    >
                      <SoundOutlined /> Test
                    </Button>
                  </div>

                  {/* Output Level (Controlled by Test Button) */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap" }}>Output level</div>
                    <div className="level-bar">
                      <div
                        className="level-fill"
                        style={{ width: `${speakerLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="volume-control">
                    <span style={{ fontSize: "12px" }}>Volume</span>
                    <div style={{ margin: "0 10px 0 20px" }}>
                      <SoundFilled />
                    </div>
                    <span style={{ fontSize: "12px" }}>{speakerVolume}</span>
                    <Slider
                      value={speakerVolume}
                      onChange={setSpeakerVolume}
                      className="volume-slider"
                    />
                  </div>
                </div>

                <div style={{ paddingTop: "35px" }} className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">Noise reduction</div>
                    <div className="settings-item-desc">
                      Reduce your background noise
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>
              </>
            )}
            {selectedMenu === "video" && <>Video</>}
            {selectedMenu === "recording" && (
              <>
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">Auto record</div>
                    <div className="settings-item-desc">
                      Enable automatic recording for all meeting you create{" "}
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Allow participants to record
                    </div>
                    <div className="settings-item-desc">
                      Meeting participants can also record the session for
                      future reference.{" "}
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Indicate when a meeting is being recorded{" "}
                    </div>
                    <div className="settings-item-desc">
                      Display recording indicator when someone is recording the
                      meeting{" "}
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">Records to file</div>
                    <div className="settings-item-desc">
                      Enable hosts and participants to capture the meeting on
                      their local devices. The recording will capture both video
                      and shared content .{" "}
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      {"Display Participants' Names"}
                    </div>
                    <div className="settings-item-desc">
                      {
                        "Participant's name is visible on their video feed during the recorded session"
                      }
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Screen Sharing Recording
                    </div>
                    <div className="settings-item-desc">
                      Recording shared content along with participant
                      interactions.{" "}
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>
              </>
            )}
            {selectedMenu === "whiteboard" && (
              <>
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Activate Whiteboard
                    </div>
                    <div className="settings-item-desc">
                      Enable the in-meeting whiteboard for interactive
                      collabration
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Enable Cloud Whiteboard Saving
                    </div>
                    <div className="settings-item-desc">
                      Allow whiteboards to be saved to the cloud
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Allow export of whiteboard content
                    </div>
                    <div className="settings-item-desc">
                      Users can export in PDF, PNG, CSV formats of whiteboards.
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>

                <div
                  className="setting-item"
                  style={{
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="hostAndParticipants"
                        checked={selected.includes("hostAndParticipants")}
                        onChange={() => toggleCheckbox("hostAndParticipants")}
                      />
                      Host and Participants
                    </label>
                  </div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="hostOnly"
                        checked={selected.includes("hostOnly")}
                        onChange={() => toggleCheckbox("hostOnly")}
                      />
                      Host only
                    </label>
                  </div>
                </div>
              </>
            )}
            {selectedMenu === "screenShare" && (
              <div>
                <div className="setting-item">
                  <div>
                    <div className="settings-item-title">
                      Window size during screen sharing
                    </div>
                    <div
                      className="settings-item-desc"
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="screenSize"
                          value="full"
                          checked={screenSize === "full"}
                          onChange={() => setScreenSize("max")}
                        />
                        Full Screen
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="screenSize"
                          value="max"
                          checked={screenSize === "max"}
                          onChange={() => setScreenSize("full")}
                        />
                        Maximized Window
                      </label>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <div>
                    <div className="settings-item-title">Share Application</div>
                    <div
                      className="settings-item-desc"
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="screenShare"
                          value="specific"
                          checked={screenShare === "specific"}
                          onChange={() => setScreenShare("all")}
                        />
                        Specific Application Window
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="screenShare"
                          value="all"
                          checked={screenShare === "all"}
                          onChange={() => setScreenShare("specific")}
                        />
                        Al windows
                      </label>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <div style={{ maxWidth: "65%" }}>
                    <div className="settings-item-title">
                      Annotation Options
                    </div>
                    <div className="settings-item-desc">
                      Enable annotation for participants to interact with shared
                      content.
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>
              </div>
            )}
            {selectedMenu === "aiAssistant" && (
              <div>
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Meeting summary with AI assistant
                    </div>
                    <div className="settings-item-desc">
                      You can generate and receive AI-powered meeting summaries
                      after the meeting has ended.
                    </div>
                  </div>
                  <Switch className="settings-switch" />
                </div>{" "}
                <div
                  className="setting-item"
                  style={{
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="settings-item-title">
                    Automatically share summary with:
                  </div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="onlyMe"
                        checked={autoShareSummary.includes("onlyMe")}
                        onChange={() =>
                          toggleSummaryAutoShareCheckbox("onlyMe")
                        }
                      />
                      Only Me
                    </label>
                  </div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="meAndOrganizer"
                        checked={autoShareSummary.includes("meAndOrganizer")}
                        onChange={() =>
                          toggleSummaryAutoShareCheckbox("meAndOrganizer")
                        }
                      />
                      Me and Meeting Organizer
                    </label>
                  </div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="meAndInvitees"
                        checked={autoShareSummary.includes("meAndInvitees")}
                        onChange={() =>
                          toggleSummaryAutoShareCheckbox("meAndInvitees")
                        }
                      />
                      Me and Meeting Invitees
                    </label>
                  </div>
                </div>
                <div
                  className="setting-item"
                  style={{
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="settings-item-title">Summary style:</div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="concise"
                        checked={summaryStyle.includes("concise")}
                        onChange={() => toggleSummaryStyleCheckbox("concise")}
                      />
                      Concise (short key points)
                    </label>
                  </div>
                  <div className="settings-item-desc">
                    <label className="whiteboard-custom-checkbox">
                      <input
                        type="checkbox"
                        value="casual"
                        checked={summaryStyle.includes("casual")}
                        onChange={() => toggleSummaryStyleCheckbox("casual")}
                      />
                      Casual (conversational tone)
                    </label>
                  </div>
                </div>
              </div>
            )}
            {selectedMenu === "scheduling" && (
              <div>
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Calendar and contacts integration
                    </div>
                    <div className="settings-item-desc">
                      We support goggle calendar and contacts
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Authentication expiry email alerts
                    </div>
                    <div className="settings-item-desc">
                      Receive an email alert when your calendar authentication
                      expires
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>
              </div>
            )}
            {selectedMenu === "notification" && (
              <div>
                {" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Chat Messages & Mentions
                    </div>
                    <div className="settings-item-desc">
                      Notify when someone sends a message or mentions you in
                      chat.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Recording Notification
                    </div>
                    <div className="settings-item-desc">
                      Notify you when the meeting is being recorded.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Joined Notification
                    </div>
                    <div className="settings-item-desc">
                      Alerts when a participant enters the meeting.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">Left Notification</div>
                    <div className="settings-item-desc">
                      Alerts when a participant exits the meeting.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>
              </div>
            )}
            {selectedMenu === "security" && (
              <div>
                {" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      {" "}
                      End-to-End Encryption
                    </div>
                    <div className="settings-item-desc">
                      End-to-end encryption provides additional protection to
                      your video, audio, and messages.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>{" "}
                <div className="setting-item">
                  <div style={{ maxWidth: "80%" }}>
                    <div className="settings-item-title">
                      Two-Factor Authentication (2FA){" "}
                    </div>
                    <div className="settings-item-desc">
                      Extra security for host/admin logins.
                    </div>
                  </div>{" "}
                  <Switch className="settings-switch" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SettingsModal;
