/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userPassword } from "../../redux/User/user.action";
import NewUserImage from "../../assets/new_user_image.jpeg";
import UsitiveLogo from "../../assets/usitive-logo-with-text.png";
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
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  // Extract token from the URL
  const { token } = useParams();
  // console.log("token", token);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const email = queryParams.get("email");
  // console.log("name", name, "email", email);

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
      setIsError(true);
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

    // setMessage("Password updated successfully!");
    // setTimeout(() => {
    //   navigate("/sign-in"); // Redirect to login page
    // }, 1500);
  };

  useEffect(() => {
    if (props.userData.userPasswordResponse) {
      let data = props.userData.userPasswordResponse;
      if (data.success) {
        setMessage(data.message);
        setIsError(false);
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.userPasswordResponse]);

  return (
    <div className="new_user_container">
      <div className="new_user_image_container">
        <img
          className="new_user_image"
          src={NewUserImage}
          alt="new user image"
        />
      </div>
      <div className="new_user_input_container">
        <div className="new_user_input_items">
          <div className="new_user_input">
            <img
              src={UsitiveLogo}
              alt="new user logo"
              className="new_user_logo"
            />

            <div className="new_user_title">
              Hi {name} <br />
              Welcome to Usitive
            </div>
            <div className="new_user_desc">
              Reset your password and login to usitive account
            </div>
          </div>
          {/* {message && <div className="error-message">{message}</div>} */}
          <Form
            name="setNewPassword"
            layout="vertical"
            onFinish={handleSubmit}
            className="password-form"
          >
            <div className="new_user_email_conatiner">
              <div className="new_user_label">Your email</div>
              <div className="new_user_email">{email}</div>
            </div>
            <Form.Item
              name="newPassword"
              label={<span className="new_user_label">New Password</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter your new password!",
                },
              ]}
            >
              <Input.Password
                // prefix={<LockOutlined />}
                placeholder="Enter new password"
                className="login-input"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="new_user_label">confirm Password</span>}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
              ]}
            >
              <Input.Password
                // prefix={<LockOutlined />}
                placeholder="Re-enter new password"
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>

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
                className="login-button"
                block
              >
                Sign In
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
