import React from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const SettingsDropdown = ({ options, defaultValue, onChange, style }) => {
  return (
    <Select
      defaultValue={defaultValue}
      onChange={onChange}
      style={{
        // width: "100%",
        height: "48px",
        backgroundColor: "#DEDEDE4A",
        borderRadius: "8px",
        padding: "10px",
        color: "#696969",
        fontSize: "16px",
        border: "none",
        boxShadow: "none",
        ...style,
      }}
      dropdownStyle={{
        borderRadius: "8px",
        backgroundColor: "#F5F5F5",
        border: "none",
      }}
      suffixIcon={<DownOutlined style={{ color: "#464454" }} />}
      bordered={false}
    >
      {options.map((option) => (
        <Option
          key={option.value}
          value={option.value}
          style={{ color: "#696969", backgroundColor: "transparent" }}
        >
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default SettingsDropdown;

// import React from "react";
// import { Select } from "antd";
// import { DownOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const SettingsDropdown = ({ options, selectedValue, updateSetting, settingKey }) => {
//   const handleChange = (value) => {
//     updateSetting(settingKey, value);
//     // console.log(`Dropdown Changed: ${settingKey} ->`, value);
//   };

//   return (
//     <Select
//       value={selectedValue}
//       onChange={handleChange}
//       style={{
//         height: "48px",
//         backgroundColor: "#DEDEDE4A",
//         borderRadius: "8px",
//         padding: "10px",
//         color: "#696969",
//         fontSize: "16px",
//         border: "none",
//       }}
//       dropdownStyle={{
//         borderRadius: "8px",
//         backgroundColor: "#F5F5F5",
//       }}
//       suffixIcon={<DownOutlined style={{ color: "#464454" }} />}
//       bordered={false}
//     >
//       {options.map((option) => (
//         <Option key={option.value} value={option.value} style={{ color: "#696969" }}>
//           {option.label}
//         </Option>
//       ))}
//     </Select>
//   );
// };

// export default SettingsDropdown;
