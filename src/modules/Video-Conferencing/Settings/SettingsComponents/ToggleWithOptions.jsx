// import React, { useState } from "react";
// import { Switch, Checkbox } from "antd";

// const ToggleWithOptions = ({
//   toggleKey,
//   title,
//   description,
//   options,
//   isActive,
//   updatedValue,
// }) => {
//   const [isEnabled, setIsEnabled] = useState(isActive[toggleKey] || false);
//   const [selectedOptions, setSelectedOptions] = useState(
//     options.reduce((acc, option) => ({ ...acc, [option.value]: false }), {}) // Initialize all options as false
//   );

//   // console.log('selectedOptions', selectedOptions);

//   const handleToggle = (checked) => {
//     setIsEnabled(checked);
//     // console.log({ [toggleKey]: checked });

//     if (!checked) {
//       // Reset all options when switch is turned off
//       setSelectedOptions(
//         options.reduce((acc, option) => ({ ...acc, [option.value]: false }), {})
//       );
//     }
//   };

//   const handleCheckboxChange = (value) => {
//     setSelectedOptions((prevSelected) => {
//       const newSelected = {
//         ...prevSelected,
//         [value]: !prevSelected[value], // Toggle the value between true/false
//       };
//       const clickedItem = { [value]: newSelected[value] }; // Store only the clicked item as key-value pair
//       // console.log("Clicked Item:", clickedItem); // Logs only the clicked item      // updatedValue(newSelected);
//       updatedValue(clickedItem);
//       return newSelected;
//     });
//   };

//   return (
//     <div style={{ width: "100%", padding: "10px 0" }}>
//       {/* Title & Switch */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <div>
//           <h4
//             style={{
//               margin: 0,
//               color: "#2D2D2D",
//               fontWeight: "bold",
//               marginBottom: "10px",
//             }}
//           >
//             {title}
//           </h4>
//           <p style={{ margin: 0, color: "#666" }}>{description}</p>
//         </div>
//         <Switch checked={isEnabled} onChange={handleToggle} />
//       </div>

//       {/* Checkboxes (Visible only when Switch is enabled) */}
//       {isEnabled && (
//         <div style={{ marginTop: "10px" }}>
//           {options.map((option) => (
//             <label
//               key={option.value}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 padding: "10px 0",
//                 cursor: "pointer",
//               }}
//             >
//               <Checkbox
//                 checked={selectedOptions[option.value]}
//                 onChange={() => handleCheckboxChange(option.value)}
//                 style={{
//                   background: "transparent",
//                   padding: "5px",
//                   borderRadius: "5px",
//                   width: "20px",
//                   height: "20px",
//                 }}
//               />
//               <div>
//                 <h4 style={{ margin: 0, color: "#2D2D2D", fontSize: "16px" }}>
//                   {option.label}
//                 </h4>
//                 <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
//                   {option.description}
//                 </p>
//               </div>
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ToggleWithOptions;

import React, { useState, useEffect } from "react";
import { Switch, Checkbox } from "antd";

const ToggleWithOptions = ({ toggleKey, title, description, options, updatedValue, isActive }) => {
  const [isEnabled, setIsEnabled] = useState(isActive[toggleKey] || false);

  // Initialize options state from isActive
  const [selectedOptions, setSelectedOptions] = useState(
    options.reduce((acc, option) => ({
      ...acc,
      [option.value]: isActive[option.value] || false, // Read initial state from isActive
    }), {})
  );

  // Sync state when `isActive` changes
  useEffect(() => {
    setIsEnabled(isActive[toggleKey] || false);
    setSelectedOptions(
      options.reduce((acc, option) => ({
        ...acc,
        [option.value]: isActive[option.value] || false, // Sync with `isActive`
      }), {})
    );
  }, [isActive, toggleKey, options]);

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    updatedValue(prevState => ({
      ...prevState,
      [toggleKey]: checked
    }));

    if (!checked) {
      setSelectedOptions(
        options.reduce((acc, option) => ({
          ...acc,
          [option.value]: false,
        }), {})
      );
    }
  };

  const handleCheckboxChange = (value) => {
    setSelectedOptions(prevSelected => {
      const newSelected = {
        ...prevSelected,
        [value]: !prevSelected[value],
      };

      updatedValue(prevState => ({
        ...prevState,
        [value]: newSelected[value], // Update only the selected checkbox
      }));

      return newSelected;
    });
  };

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      {/* Title & Switch */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ margin: 0, color: "#2D2D2D", fontWeight: "bold", marginBottom: "10px" }}>
            {title}
          </h4>
          <p style={{ margin: 0, color: "#666" }}>{description}</p>
        </div>
        <Switch checked={isEnabled} onChange={handleToggle} />
      </div>

      {/* Checkboxes (Visible only when Switch is enabled) */}
      {isEnabled && (
        <div style={{ marginTop: "10px" }}>
          {options.map((option) => (
            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer" }}>
              <Checkbox checked={selectedOptions[option.value]} onChange={() => handleCheckboxChange(option.value)} />
              <div>
                <h4 style={{ margin: 0, color: "#2D2D2D", fontSize: "16px" }}>{option.label}</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleWithOptions;
