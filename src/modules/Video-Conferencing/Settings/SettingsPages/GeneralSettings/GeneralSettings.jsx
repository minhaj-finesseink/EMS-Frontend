/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";
import ToggleWithOptions from "../../SettingsComponents/ToggleWithOptions";
import LightModeIcon from "../../../../../assets/NewIcons/settings-light-mode.png";
import DarkModeIcon from "../../../../../assets/GeneralSettings/dark-mode.png";
import SystemModeIcon from "../../../../../assets/GeneralSettings/system-mode.png";
import SettingsDropdown from "../../SettingsComponents/SettingsDrodown";

const GeneralSettings = ({ isActive, updatedValue }) => {
  // const [selectedMode, setSelectedMode] = useState(isActive.appearence);
  // const [maxParticipants, setMaxParticipants] = useState("10");
  // console.log("isActive", isActive.appearence);

  const languageOptions = [
    { label: "English (United States)", value: "en-us" },
    { label: "French (France)", value: "french" },
    { label: "Spanish (Spain)", value: "spanish" },
  ];

  return (
    <div style={{ width: "90%" }}>
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
        <SettingsDropdown
          options={languageOptions}
          defaultValue="english"
          onChange={(value) => updatedValue({ language: value })}
        />{" "}
      </div>

      <ToggleComponent
        toggleKey="noParticipantDetection"
        title="No Participants Detected"
        description="The call will close in 15 minutes unless others join."
        isActive={isActive}
        updatedValue={updatedValue}
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
            // onClick={() => setSelectedMode("light")}
            onClick={() => updatedValue({ appearence: "light" })}
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
                checked={isActive.appearence === "light"}
              />{" "}
              <div className="settings-item-desc">Light Mode</div>
            </div>
          </div>
          {/* Dark Mode */}
          <div
            style={{ textAlign: "center", cursor: "pointer" }}
            // onClick={() => setSelectedMode("dark")}
            onClick={() => updatedValue({ appearence: "dark" })}
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
                checked={isActive.appearence === "dark"}
              />{" "}
              <div className="settings-item-desc">Dark Mode</div>
            </div>
          </div>
          {/* System Mode */}
          <div
            style={{ textAlign: "center", cursor: "pointer" }}
            // onClick={() => setSelectedMode("system")}
            onClick={() => updatedValue({ appearence: "system" })}
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
                checked={isActive.appearence === "system"}
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
          Maximum number of participants visible per screen in gallery view
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
              value="10"
              checked={isActive.maxParticipantsInScreen === "10"}
              onChange={() => updatedValue({ maxParticipantsInScreen: "10" })}
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
              value="15"
              checked={isActive.maxParticipantsInScreen === "15"}
              onChange={() => updatedValue({ maxParticipantsInScreen: "15" })}
            />
            15 Participants
          </label>
        </div>
      </div>

      <ToggleComponent
        toggleKey="displayParticipantsName"
        title="Display Participants' Names"
        description="Participant’s name is visible on their video feed during the recorded session"
        isActive={isActive}
        updatedValue={updatedValue}
      />

      <ToggleWithOptions
        toggleKey="hostEntryControl"
        title="Host Entry Controls"
        description="Manage who can join and how they enter the meeting."
        options={[
          {
            value: "hostJoinFirst",
            label: "Host Must Join First",
            description: "Participants cannot start without the host.",
          },
          {
            value: "autolock",
            label: "Auto-Lock Meeting",
            description:
              "Option to lock the meeting after a set time or a specific number of participants.",
          },
        ]}
        isActive={isActive}
        updatedValue={updatedValue}
      />

      <ToggleWithOptions
        toggleKey="hostInMeetingControl"
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
            value: "allowScreenSharing",
            label: "Screen Sharing Control",
            description:
              "When disabled, only the host  can share their screen.",
          },
          {
            value: "enableChat",
            label: "Chat Control",
            description: "When disabled, only the host can send messages.",
          },
          {
            value: "permitUnmute",
            label: "Audio Control",
            description: "When disabled, only the host can unmute themselves.",
          },
          {
            value: "allowRecording",
            label: " Recording control",
            description: "When enabled, participants can record the meeting",
          },
          {
            value: "enableWhiteboard",
            label: "Whiteboard control",
            description:
              "When enabled, participants can collaborate using a shared whiteboard.",
          },
        ]}
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
};

export default GeneralSettings;
