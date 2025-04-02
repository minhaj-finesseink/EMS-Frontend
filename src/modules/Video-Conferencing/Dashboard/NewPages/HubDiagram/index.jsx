import React from "react";
import UsitiveLogo from "../../../../../assets/usitive-logo.svg";
import GoogleCalendar from "../../../../../assets/Integrations/google-calendar.png";
import HubSpot from "../../../../../assets/Integrations/hubspot.png";
import Monday from "../../../../../assets/Integrations/monday.svg";
import Outlook from "../../../../../assets/Integrations/outlook.png";
import Slack from "../../../../../assets/Integrations/slack.png";
import Trello from "../../../../../assets/Integrations/trello.png";

const HubDiagram = () => {
  const centerImage = UsitiveLogo;

  const icons = [
    { src: Outlook, width: "36px", height: "36px" },
    { src: Trello, width: "32px", height: "32px" },
    { src: Slack, width: "60px", height: "60px" },
    { src: Monday, width: "39px", height: "29px" },
    { src: GoogleCalendar, width: "48px", height: "48px" },
    { src: HubSpot, width: "33px", height: "31px" },
  ];

  // Positions for outer icons
  const positions = [
    { top: "7%", left: "44%" }, // Top
    { top: "27%", left: "83%" }, // Top Right
    { top: "62%", left: "82%" }, // Bottom Right
    { top: "79%", left: "44%" }, // Bottom
    { top: "62%", left: "6%" }, // Bottom Left
    { top: "27%", left: "5%" }, // Top Left
  ];

  // Line positions with curved and straight lines
  const linePositions = [
    { top: "26%", left: "50%", width: "2px", height: "35px", curved: false }, // Top (Straight)
    { top: "33%", left: "24%", curved: true, transform: "scaleX(-1)" }, // Top Left (Curved)
    { top: "33%", left: "61%", curved: true }, // Top Right (Curved)
    { top: "65%", left: "50%", width: "1px", height: "35px", curved: false }, // Bottom (Straight)
    { top: "62%", left: "25%", curved: true, transform: "rotate(180deg)" }, // Bottom Left (Curved)
    { top: "62%", left: "60%", curved: true, transform: "scaleY(-1)" }, // Bottom Right (Flipped Curved)
  ];

  // Inline SVG for the curved lines
  const CurvedLineSVG = () => (
    <svg
      width="62"
      height="26"
      viewBox="0 0 62 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.4375 24.6853L40.0397 1.25781C40.0397 1.25781 53.1137 1.25781 61.4909 1.25781"
        stroke="#A2A2A2"
        strokeWidth="0.910696"
      />
    </svg>
  );

  return (
    <div
      style={{
        position: "relative",
        width: "400px",
        height: "400px",
        // backgroundColor: "antiquewhite",
      }}
    >
      {/* Center Hub */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120px",
          height: "120px",
          background: "#D9D9D93B",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img src={centerImage} alt="Center Logo" style={{ width: "60px" }} />
      </div>

      {/* Custom Lines (Curved & Straight) */}
      {linePositions.map((line, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: line.curved ? "62px" : line.width,
            height: line.curved ? "26px" : line.height,
            backgroundColor: line.curved ? "transparent" : "#A2A2A2",
            transform: line.transform || "none", // Apply rotation or flip if exists
            ...line,
          }}
        >
          {line.curved ? <CurvedLineSVG /> : null}
        </div>
      ))}

      {/* Outer Icons */}
      {icons.map((icon, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            border: "1px solid #007DC578",
            background: "#fff",
            boxShadow: "0px 0px 10.928px 1.821px rgba(0, 0, 0, 0.08)",
            ...positions[index],
          }}
        >
          <img
            src={icon.src}
            alt={`Icon ${index}`}
            width={icon.width}
            height={icon.height}
          />
        </div>
      ))}
    </div>
  );
};

export default HubDiagram;
