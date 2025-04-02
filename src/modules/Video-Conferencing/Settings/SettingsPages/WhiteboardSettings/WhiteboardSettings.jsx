import React from "react";
import ToggleWithOptions from "../../SettingsComponents/ToggleWithOptions";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function WhiteboardSettings({ isActive, updatedValue }) {
  return (
    <div style={{ width: "90%" }}>
      <ToggleComponent
        toggleKey="enableWhiteboard"
        title="Activate Whiteboard"
        description="Enable the in-meeting whiteboard for interactive collabration"
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleWithOptions
        toggleKey="enableExportWhiteboard"
        title="Allow export of whiteboard content"
        description="Users can export in PDF, PNG, CSV formats of whiteboards."
        options={[
          {
            value: "hostAndParticipants",
            description: "Host and Participants",
          },
          {
            value: "hostOnly",
            description: "Host Only",
          },
        ]}
        updatedValue={updatedValue}
        isActive={isActive}
      />
    </div>
  );
}

export default WhiteboardSettings;
