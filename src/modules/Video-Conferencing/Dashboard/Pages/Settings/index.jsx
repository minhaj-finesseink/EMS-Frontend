/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Settings1Icon from "../../../../../assets/GeneralSettings/settings.svg";
import Settings2Icon from "../../../../../assets/NewIcons/setting-2.svg";
import Mic1Icon from "../../../../../assets/GeneralSettings/mic.svg";
import Mic2Icon from "../../../../../assets/NewIcons/mic-2.svg";
import Video1Icon from "../../../../../assets/GeneralSettings/video.svg";
import Video2Icon from "../../../../../assets/NewIcons/video-2.svg";
import Recording1Icon from "../../../../../assets/GeneralSettings/recording.svg";
import Recording2Icon from "../../../../../assets/NewIcons/recording-2.svg";
import Board1Icon from "../../../../../assets/GeneralSettings/board.svg";
import Board2Icon from "../../../../../assets/NewIcons/board-2.svg";
import Share1Icon from "../../../../../assets/GeneralSettings/share.svg";
import Share2Icon from "../../../../../assets/NewIcons/share-2.svg";
import AI1Icon from "../../../../../assets/GeneralSettings/ai.svg";
import AI2Icon from "../../../../../assets/NewIcons/Ai-2.svg";
import Scheduling1Icon from "../../../../../assets/GeneralSettings/mail-notification.svg";
import Scheduling2Icon from "../../../../../assets/NewIcons/mail-notification-2.svg";
import Notification1Icon from "../../../../../assets/GeneralSettings/notification.svg";
import Notification2Icon from "../../../../../assets/NewIcons/notification-2.svg";
import LightModeIcon from "../../../../../assets/NewIcons/settings-light-mode.png";
import DarkModeIcon from "../../../../../assets/GeneralSettings/dark-mode.png";
import SystemModeIcon from "../../../../../assets/GeneralSettings/system-mode.png";
import { Menu, Switch, Select, Checkbox, Button, Slider } from "antd";
import {
  AudioMutedOutlined,
  AudioOutlined,
  DownOutlined,
  SoundFilled,
  SoundOutlined,
} from "@ant-design/icons";
import "./style.css";

const { Option } = Select;

function Settings() {
  const [selectedMenu, setSelectedMenu] = useState("general");
  const [selectedMode, setSelectedMode] = useState("light");
  const [maxParticipants, setMaxParticipants] = useState("10");

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
  ];

  const LanguageDropdown = () => {
    return (
      <Select
        defaultValue="spanish"
        style={{
          width: "100%",
          height: "48px", // Set dropdown height
          backgroundColor: "#DEDEDE4A", // Semi-transparent gray
          borderRadius: "8px",
          padding: "10px",
          color: "#696969", // Grayish text color
          fontSize: "16px",
          border: "none", // Remove border
          boxShadow: "none", // Remove shadow on click
          display: "flex",
          alignItems: "center", // Center text vertically
        }}
        dropdownStyle={{
          borderRadius: "8px",
          backgroundColor: "#F5F5F5", // Background color for dropdown list
          border: "none", // Remove dropdown border
        }}
        suffixIcon={<DownOutlined style={{ color: "#464454" }} />} // Custom arrow color
        bordered={false} // Remove border
      >
        <Option
          value="english"
          style={{
            color: "#696969",
            backgroundColor: "transparent",
            height: "48px",
          }}
        >
          English (United States)
        </Option>
        <Option
          value="french"
          style={{
            color: "#696969",
            backgroundColor: "transparent",
            height: "48px",
          }}
        >
          French (France)
        </Option>
        <Option
          value="spanish"
          style={{
            color: "#464454",
            fontWeight: "bold",
            backgroundColor: "#E0E0E0",
            height: "48px",
          }}
        >
          Spanish (Spain)
        </Option>
      </Select>
    );
  };

  const ToggleComponent = ({ toggleKey, title, description }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (checked) => {
      setIsEnabled(checked);
      console.log({ [toggleKey]: checked }); // Logs key & state
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          // maxWidth: "600px",
          padding: "10px 0",
        }}
      >
        <div>
          <h3
            style={{
              marginBottom: "10px",
              color: "#2D2D2D",
              fontWeight: "bold",
            }}
          >
            {title}
          </h3>
          <p style={{ margin: 0, color: "#666" }}>{description}</p>
        </div>
        <Switch
          checked={isEnabled}
          onChange={handleToggle}
          style={{ backgroundColor: isEnabled ? "#1890FF" : "#ccc" }}
        />
      </div>
    );
  };

  const ToggleWithOptions = ({ toggleKey, title, description, options }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]); // Multiple selections

    const handleToggle = (checked) => {
      setIsEnabled(checked);
      console.log({ [toggleKey]: checked });

      // Reset checkbox selection if switch is turned off
      if (!checked) {
        setSelectedOptions([]);
      }
    };

    const handleCheckboxChange = (value) => {
      // Toggle selection: If already selected, remove it; otherwise, add it
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
      console.log({ [toggleKey + "_options"]: selectedOptions });
    };

    return (
      <div
        style={{
          width: "100%",
          padding: "10px 0",
        }}
      >
        {/* Title & Switch */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#2D2D2D", fontWeight: "bold" }}>
              {title}
            </h4>
            <p style={{ margin: 0, color: "#666" }}>{description}</p>
          </div>
          <Switch
            checked={isEnabled}
            onChange={handleToggle}
            style={{ backgroundColor: isEnabled ? "#1890FF" : "#ccc" }}
          />
        </div>

        {/* Checkboxes (Multiple Selection Allowed) */}
        {isEnabled && (
          <div style={{ marginTop: "10px" }}>
            {options.map((option) => (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 0",
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  style={{
                    background: "transparent",
                    padding: "5px",
                    borderRadius: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, color: "#2D2D2D", fontSize: "16px" }}>
                    {option.label}
                  </h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

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

  return (
    <div className="general-settings-container">
      <div className="general-settings-menu-container">
        <Menu
          mode="vertical"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          className="general-settings-menu"
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="general-settings-content-container">
        {" "}
        {selectedMenu === "general" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#2D2D2D",
                    fontWeight: "bold",
                  }}
                >
                  Language
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                  Restart meet to apply these settings
                </p>
              </div>
              <div>
                <LanguageDropdown />
              </div>
            </div>
            <ToggleComponent
              toggleKey="noParticipants"
              title="No Participants Detected"
              description="The call will close in 15 minutes unless others join."
            />
            <div>
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#2D2D2D",
                  fontWeight: "bold",
                }}
              >
                Appearance Modes
              </h3>
              <div style={{ display: "flex", gap: "50px" }}>
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
            <div>
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#2D2D2D",
                  fontWeight: "bold",
                }}
              >
                Maximum number of participants visible per screen in gallery
                view
              </h3>
              <div style={{ display: "flex", gap: "20px" }}>
                {/* 10 Participants Option */}
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
                    checked={maxParticipants === "10"}
                    onChange={() => setMaxParticipants("10")}
                  />
                  10 Participants
                </label>

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
                    value="25"
                    checked={maxParticipants === "15"}
                    onChange={() => setMaxParticipants("15")}
                  />
                  15 Participants
                </label>
              </div>
            </div>
            <ToggleComponent
              toggleKey="participantsName"
              title="Display Participants' Names"
              description="Participant's name is visible on their video feed during the recorded session"
            />
            <ToggleWithOptions
              toggleKey="hostEntry"
              title="Host Entry Controls"
              description="Manage who can join and how they enter the meeting."
              options={[
                {
                  label: "Host Must Join First",
                  value: "hostMustJoin",
                  description: "Participants cannot start without the host.",
                },
                {
                  label: "Auto-Lock Meeting",
                  value: "autoLock",
                  description:
                    "Option to lock the meeting after a set time or a specific number of participants.",
                },
              ]}
            />
            <ToggleWithOptions
              toggleKey="meetingContril"
              title="Host In-Meeting Controls"
              description="Manage participant interactions and permissions during the meeting."
              options={[
                {
                  value: "assignCoHost",
                  label: "Assign Co- Host",
                  description:
                    "When enabled, the host can assign co-hosts to help manage the meeting.",
                },
                {
                  value: "screenShare",
                  label: "Screen Sharing Control",
                  description:
                    "When disabled, only the host  can share their screen.",
                },
                {
                  value: "chatControl",
                  label: "Chat Control",
                  description:
                    "When disabled, only the host can send messages.",
                },
                {
                  value: "audioControl",
                  label: "Audio Control",
                  description:
                    "When disabled, only the host can unmute themselves.",
                },
                {
                  value: "recordingControl",
                  label: " Recording control",
                  description:
                    "When enabled, participants can record the meeting",
                },
                {
                  value: "whiteboardControl",
                  label: "Whiteboard control",
                  description:
                    "When enabled, participants can collaborate using a shared whiteboard.",
                },
              ]}
            />
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
                  className={`test-button ${isSpeakerTesting ? "active" : ""}`}
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
      </div>
    </div>
  );
}

export default Settings;
