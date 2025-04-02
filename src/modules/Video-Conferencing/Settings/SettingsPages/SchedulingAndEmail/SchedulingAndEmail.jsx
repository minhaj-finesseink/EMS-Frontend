import React from "react";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function SchedulingAndEmail({ isActive, updatedValue }) {
  return (
    <div style={{ width: "90%" }}>
      <ToggleComponent
        toggleKey="calendarAndContact"
        title="Calendar and contacts integration"
        description="We support goggle calendar and contacts"
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleComponent
        toggleKey="emailExpiryAlert"
        title="Authentication expiry email alerts"
        description="Receive an email alert when your calendar authentication expires"
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default SchedulingAndEmail;
