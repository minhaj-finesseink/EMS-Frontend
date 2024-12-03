import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import the default styles

const CircularProgress = () => {
  return (
    <div style={{ width: "90px", height: "90px", margin: "0 auto" }}>
      <CircularProgressbar
        value={76}
        text="76%"
        styles={{
          path: {
            stroke: "#9566F2", // Progress color
            strokeWidth: 8,
            trailColor: "#FFFFFF", // Background color
            strokeLinecap: "round", // Rounded end for the stroke
          },
          text: {
            fill: "#23272C", // Text color
            fontSize: "18px",
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
};

export default CircularProgress;
