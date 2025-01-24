import React from "react";
import { DatePicker } from "antd";
import PropTypes from "prop-types";

const CustomDatePicker = ({ value, onChange, disabled, placeholder, name }) => {
  return (
    <DatePicker
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      format="MM-DD-YYYY" // US date format
      style={{
        backgroundColor: "#FFF",
        width: "100%",
        height: "46px", // Custom height
        borderRadius: "18px", // Custom border-radius
        color: "#89868D",
        fontFamily: "Inter",
      }}
    />
  );
};

CustomDatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};

export default CustomDatePicker;
