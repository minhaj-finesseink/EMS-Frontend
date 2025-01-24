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
  style = {},
  ...props
}) => {
  const disabled = disabledCondition; // Apply the condition to determine if the button should be disabled

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
    borderRadius: "18px",
    cursor: disabled ? "not-allowed" : "pointer", // Change cursor for disabled
    width: "150px",
    height: "48px",
    fontFamily: "Inter",
    opacity: disabled ? 0.6 : 1, // Reduce opacity for disabled
    ...style, // Allows additional custom styles
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? null : onClick} // Prevent click if disabled
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;

// Usage

// import React from 'react';
// import CustomButton from './CustomButton';

// const App = () => {
//   return (
//     <div>
//       <CustomButton color="red">Red Button</CustomButton>
//       <CustomButton color="blue" onClick={() => alert('Clicked!')}>
//         Blue Button
//       </CustomButton>
//     </div>
//   );
// };

// export default App;
