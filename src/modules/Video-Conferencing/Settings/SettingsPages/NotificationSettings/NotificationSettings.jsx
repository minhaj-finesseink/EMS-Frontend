import React from "react";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function NotificationSettings({ isActive, updatedValue }) {
  return (
    <div style={{ width: "90%" }}>
      <ToggleComponent
        toggleKey="chatNotification"
        title="Chat Messages & Mentions"
        description="Notify when someone sends a message or mentions you in chat."
        isActive={isActive}
        updatedValue={updatedValue}
      />

      <ToggleComponent
        toggleKey="recordingNotification"
        title="Recording Notification"
        description="Notify you when the meeting is being recorded."
        isActive={isActive}
        updatedValue={updatedValue}
      />

      <ToggleComponent
        toggleKey="participantsJoined"
        title="Joined Notification"
        description="Alerts when a participant enters the meeting."
        isActive={isActive}
        updatedValue={updatedValue}
      />

      <ToggleComponent
        toggleKey="participantsLeft"
        title="Left Notification"
        description="Alerts when a participant exits the meeting."
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default NotificationSettings;
