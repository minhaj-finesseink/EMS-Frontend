import React, { useState } from "react";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function ScreenShareSettings({ isActive, updatedValue }) {
  const [screenSize, setScreenSize] = useState("");
  const [shareOption, setShareOption] = useState("");
  return (
    <div style={{ width: "90%" }}>
      <h3>Window size during screen sharing</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        <label>
          <input
            type="radio"
            name="screenSize"
            value="full-screen"
            checked={screenSize === "full-screen"}
            onChange={(e) => setScreenSize(e.target.value)}
          />
          Full Screen
        </label>
        <label>
          <input
            type="radio"
            name="screenSize"
            value="maximized-window"
            checked={screenSize === "maximized-window"}
            onChange={(e) => setScreenSize(e.target.value)}
          />
          Maximized Window
        </label>
      </div>
      <h3>Share application</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        <label>
          <input
            type="radio"
            name="shareOption"
            value="specific-window"
            checked={shareOption === "specific-window"}
            onChange={(e) => setShareOption(e.target.value)}
          />
          Specific Application Window
        </label>
        <label>
          <input
            type="radio"
            name="shareOption"
            value="all-windows"
            checked={shareOption === "all-windows"}
            onChange={(e) => setShareOption(e.target.value)}
          />
          All Windows
        </label>
      </div>
      <ToggleComponent
        toggleKey="annotationOptions"
        title="Annotation Options"
        description="Enable annotations for participants to interact with shared content."
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default ScreenShareSettings;
