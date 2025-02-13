/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const COLORS = {
  red: "#ED1C24",
  blue: "#007DC5",
  green: "#009A4E",
  yellow: "#FFCB05",
  grey: "#E0E5EB",
};

const CustomButton = ({
  color,
  transparent,
  children,
  onClick,
  disabledCondition,
  loading,
  block,
  style = {},
  ...props
}) => {
  const disabled = disabledCondition || loading; // Disable if loading
  const buttonStyle = {
    backgroundColor: disabled
      ? COLORS.grey // Use grey color for disabled
      : transparent
      ? "transparent" // Transparent or solid color
      : COLORS[color],
    color: disabled
      ? "#A9A9A9" // Disabled text color
      : color === "yellow" || color === "grey" || transparent
      ? "black" // Text color for certain colors and transparent
      : "white", // Text color for other buttons
    border: transparent ? `2px solid ${COLORS.grey}` : "none", // Border for transparent buttons
    fontSize: "16px",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer", // Change cursor for disabled
    // width: block ? "100%" : "150px",
    // height: "48px",
    width: block ? "100%" : style.width || "150px", // Custom width if provided, else default
    height: style.height || "48px", // Custom height if provided, else default
    fontFamily: "Inter",
    opacity: disabled ? 0.6 : 1, // Reduce opacity for disabled
    display: "flex", // Flexbox for centering
    justifyContent: "center",
    alignItems: "center",
    gap: "8px", // Space between loader and text
    ...style, // Allows additional custom styles
  };

  const handleHover = (e) => {
    if (!disabled) {
      e.target.style.backgroundColor = COLORS[color] + "cc"; // Change background color on hover (lighter)
    }
  };

  const handleMouseOut = (e) => {
    if (!disabled) {
      e.target.style.backgroundColor = buttonStyle.backgroundColor; // Revert background color
      e.target.style.color = buttonStyle.color; // Revert text color
    }
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? null : onClick} // Prevent click if disabled
      disabled={disabled}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseOut}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: "14px",
            height: "14px",
            border: "2px solid #A9A9A9",
            borderTop: `2px solid ${COLORS[color]}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></span>
      )}
      {children}
    </button>
  );
};

// Add a keyframe for loading spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);

export default CustomButton;

// Usage Example

// import React from 'react';
// import CustomButton from './CustomButton';

// const App = () => {
//   return (
//     <div>
//       <CustomButton color="red" loading={true}>
//         Submit
//       </CustomButton>
//       <CustomButton color="blue" onClick={() => alert('Clicked!')}>
//         Blue Button
//       </CustomButton>
//     </div>
//   );
// };

// export default App;
