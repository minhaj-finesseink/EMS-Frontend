// /* eslint-disable react/prop-types */
// /* eslint-disable react/display-name */
// import React, { useState } from "react";
// import { Input } from "antd";
// import PropTypes from "prop-types";

// // Base input style shared across all input components
// const baseInputStyle = {
//   height: "48px",
//   borderRadius: "8px",
//   fontSize: "16px",
//   padding: "8px 16px",
//   color: "#65686A",
//   transition: "all 0.3s ease-in-out",
//   outline: "none",
// };

// // Function to get final style with error and focus handling
// const getInputStyle = (error, isFocused, customStyle = {}) => {
//   return {
//     ...baseInputStyle,
//     border: error ? "1px solid red" : "1px solid #ccc",
//     boxShadow: isFocused ? "0 0 5px rgba(0, 125, 197, 0.5)" : "none",
//     ...customStyle, // Allow custom styles to override base styles
//   };
// };

// const CustomInput = ({
//   type,
//   placeholder,
//   value,
//   onChange,
//   error,
//   style,
//   className,
//   ...props
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   // Get final input style based on focus, error, and custom styles
//   const inputStyle = getInputStyle(error, isFocused, style);

//   return (
//     <Input
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}
//       style={inputStyle}
//       className={className}
//       {...props}
//     />
//   );
// };

// // Attach all Ant Design Input components with shared styles
// CustomInput.Password = ({ style, error, ...props }) => {
//   const inputStyle = getInputStyle(error, props.isFocused, style);
//   return <Input.Password {...props} style={inputStyle} />;
// };

// CustomInput.TextArea = ({ style, error, ...props }) => {
//   const inputStyle = getInputStyle(error, props.isFocused, style);
//   return <Input.TextArea {...props} style={inputStyle} />;
// };

// CustomInput.Search = ({ style, error, ...props }) => {
//   const inputStyle = getInputStyle(error, props.isFocused, style);
//   return <Input.Search {...props} style={inputStyle} />;
// };

// CustomInput.Group = ({ style, error, ...props }) => {
//   const inputStyle = getInputStyle(error, props.isFocused, style);
//   return <Input.Group {...props} style={inputStyle} />;
// };

// // OTP input handling (Ant Design v5, if applicable)
// CustomInput.OTP = ({ style, error, ...props }) => {
//   const inputStyle = getInputStyle(error, props.isFocused, style);
//   return <Input.OTP {...props} style={inputStyle} />;
// };

// CustomInput.propTypes = {
//   type: PropTypes.string,
//   placeholder: PropTypes.string,
//   value: PropTypes.string,
//   onChange: PropTypes.func,
//   error: PropTypes.bool,
//   className: PropTypes.string,
//   style: PropTypes.object,
// };

// CustomInput.defaultProps = {
//   type: "text",
//   error: false,
//   className: "",
//   style: {},
// };

// export default CustomInput;

// // Example Usage

// {
//   /* <Form.Item
//   name="email"
//   rules={[
//     { required: true, message: "Enter your email" },
//     { type: "email", message: "Enter a valid email" },
//   ]}
//   validateStatus={isEmailError ? "error" : ""}
//   help={isEmailError ? "This email already exists" : ""}
// >
//   <CustomInput
//     placeholder="Email"
//     value={email}
//     onChange={(e) => setEmail(e.target.value)}
//     error={isEmailError}
//   />
// </Form.Item> */
// }
