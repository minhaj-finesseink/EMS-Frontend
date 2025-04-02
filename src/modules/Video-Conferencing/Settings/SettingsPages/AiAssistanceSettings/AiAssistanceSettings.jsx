import React from "react";
import ToggleWithOptions from "../../SettingsComponents/ToggleWithOptions";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function AiAssistanceSettings({ isActive, updatedValue }) {
  return (
    <div style={{ width: "90%" }}>
      <ToggleComponent
        toggleKey="meetingSummary"
        title="Meeting Summary with AI Assistant"
        description="You can generate and receive AI-powered meeting summaries after the meeting has ended."
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleWithOptions
        toggleKey="shareMeetingSummary"
        title=" Automatically Share Summary With:"
        // description="Users can export in PDF, PNG, CSV formats of whiteboards."
        options={[
          {
            value: "onlyMe",
            description: "Only Me",
          },
          {
            value: "meAndMeetingOrg",
            description: "Me and Meeting Organizer",
          },
          {
            value: "meAndMeetingInvitees",
            description: "Me and Meeting Invitees",
          },
        ]}
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleWithOptions
        toggleKey="summaryStyle"
        title="Summary Style:"
        // description="Users can export in PDF, PNG, CSV formats of whiteboards."
        options={[
          {
            value: "concise",
            description: "Concise (Short key points)",
          },
          {
            value: "tone",
            description: "Casual (Conversational tone)",
          },
        ]}
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default AiAssistanceSettings;
