import React from "react";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function RecordingSettings({ isActive, updatedValue }) {
  return (
    <div style={{ width: "90%" }}>
      <ToggleComponent
        toggleKey="autoRecord"
        title="Auto Record"
        description="Enable automatic recording for all meeting you create"
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleComponent
        toggleKey="allowParticipantRecording"
        title="Allow participants to record"
        description="Meeting participants can also record the session for future reference."
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleComponent
        toggleKey="recordingIndicator"
        title="Indicate when a meeting is being recorded"
        description="Display  recording indicator when someone is recording the meeting"
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default RecordingSettings;
