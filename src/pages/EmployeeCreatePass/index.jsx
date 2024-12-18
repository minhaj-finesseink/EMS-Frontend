/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userPassword } from "../../redux/User/user.action";
import "./style.css";

const { Title } = Typography;

const SetNewPasswordPage = (props) => {
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Extract token from the URL
  const { token } = useParams();
  // console.log("token", token);

  const validatePassword = (value) => {
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (
      !(
        passwordStrength.hasMinLength &&
        passwordStrength.hasUppercase &&
        passwordStrength.hasNumber &&
        passwordStrength.hasSymbol
      )
    ) {
      setMessage("Password does not meet all requirements!");
      return;
    }

    props.userPassword({
      token: token,
      newPassword: newPassword,
    });

    setMessage("Password updated successfully!");
    setTimeout(() => {
      navigate("/sign-in"); // Redirect to login page
    }, 1500);
  };

  // useEffect(()=>{
  //   if(props){
  //     console.log("test new pass",props);

  //   }
  // },[props])

  return (
    <div className="login-container">
      <div className="login-box">
        <Title className="login-title">Set New Password</Title>
        {message && <div className="error-message">{message}</div>}
        <Form
          name="setNewPassword"
          layout="vertical"
          onFinish={handleSubmit}
          className="password-form"
        >
          {/* New Password */}
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: "Please enter your new password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              className="login-input"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
          </Form.Item>

          {/* Password Strength */}
          <div className="password-requirements">
            <span
              className={
                passwordStrength.hasMinLength
                  ? "requirement met"
                  : "requirement"
              }
            >
              8 Characters
            </span>
            <span
              className={
                passwordStrength.hasUppercase
                  ? "requirement met"
                  : "requirement"
              }
            >
              1 Uppercase
            </span>
            <span
              className={
                passwordStrength.hasNumber ? "requirement met" : "requirement"
              }
            >
              1 Numeric
            </span>
            <span
              className={
                passwordStrength.hasSymbol ? "requirement met" : "requirement"
              }
            >
              1 Symbol
            </span>
          </div>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Re-enter new password"
              className="login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  userPassword: (values) => dispatch(userPassword(values)),
});

SetNewPasswordPage.propTypes = {
  userPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetNewPasswordPage);
