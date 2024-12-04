/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPassword } from "../../redux/Login/login.action";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";

const ResetPassword = (props) => {
  const [form] = Form.useForm();
  // Extract token from the URL
  const { token } = useParams();
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (value) => {
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
    } else {
      props.resetPassword({
        token: token,
        newPassword: password,
      });
    }
  };

  useEffect(() => {
    if (props.resetPasswordData) {
      let data = props.resetPasswordData;
      if (data.responseCode === "SUCCESS") {
        setMessage(data.message);
        setIsError(false);
        // Add a 2-second delay before navigating
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetPasswordData]);

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Reset Password
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="reset-password-form"
        >
          {/* Password Field */}
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              {
                validator: (_, value) => {
                  if (
                    value &&
                    passwordStrength.hasMinLength &&
                    passwordStrength.hasUppercase &&
                    passwordStrength.hasNumber &&
                    passwordStrength.hasSymbol
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Password must meet all requirements.");
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                validatePassword(e.target.value);
                setPassword(e.target.value);
              }}
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          {/* Password Strength Indicators */}
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="reset-password-button"
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        {/* Display Message */}
        {message && (
          <div>
            <Alert
              message={message}
              type={isError ? "error" : "success"}
              showIcon
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  resetPasswordData: state.login.resetPassword,
});

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (values) => dispatch(resetPassword(values)),
});

ResetPassword.propTypes = {
  resetPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
