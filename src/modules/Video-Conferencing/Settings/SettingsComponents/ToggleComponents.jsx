import React, { useState } from "react";
import { Switch } from "antd";

const ToggleComponent = ({
  toggleKey,
  title,
  description,
  isActive,
  updatedValue,
}) => {
  const [isEnabled, setIsEnabled] = useState(isActive[toggleKey] || false);

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    // console.log({ [toggleKey]: checked });
    updatedValue({ [toggleKey]: checked });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 0",
      }}
    >
      <div>
        <h3
          style={{ marginBottom: "10px", color: "#2D2D2D", fontWeight: "bold" }}
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

export default ToggleComponent;
