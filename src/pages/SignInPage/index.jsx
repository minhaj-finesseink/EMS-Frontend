/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { login } from "../../redux/Login/login.action";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { useAuth } from "../../context/authContext";
import "./style.css";

const LoginPage = (props) => {
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook
  // const { login } = useAuth();

  const validatePassword = (value) => {
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleGoogleSignIn = () => {
    console.log("Redirecting to Google Sign-In...");
    // Add your Google OAuth logic here
  };

  const handleSubmit = () => {
    props.login({
      email: email,
      password: password,
    });
  };

  // useEffect(() => {
  //   if (props.loginData.loginResponse) {
  //     let data = props.loginData.loginResponse;
  //     console.log('msg', data);
  //     setMessage(data.message);
  //     if (data.responseCode === "LOGIN_SUCCESS") {
  //       login(data.user);
  //       localStorage.setItem("token", data.token);
  //       navigate("/admin-dashboard");
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.loginData, navigate]);

  useEffect(() => {
    if (props.loginData.loginResponse) {
      const data = props.loginData.loginResponse;
  
      // Check if there's an error message
      if (data.error) {
        setMessage(data.error); // Display the error message if available
      } else {
        setMessage(data.message); // Display the success message if no error
  
        if (data.responseCode === "LOGIN_SUCCESS") {
          localStorage.setItem("token", data.token);  // Store token in localStorage
          navigate("/admin-dashboard");  // Redirect to dashboard after successful login
        }
      }
    }
  }, [props.loginData, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <Form
          name="login"
          onFinish={handleSubmit} // Use onFinish to handle form submission
          layout="vertical"
          initialValues={{ remember: true }}
        >
          {/* Email Field */}
          {message ? <div className="error-message">{message}</div> : ""}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="login-input"
              prefix={<UserOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
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
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => {
                validatePassword(e.target.value);
                setPassword(e.target.value);
              }}
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

          {/* Remember Me and Login Button */}
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox>Remember me</Checkbox>
              <a href="/forgot-password" style={{ marginLeft: "auto" }}>
                Forgot Password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider>OR</Divider>

        {/* Google Sign-In Button */}
        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignIn}
          className="google-button"
          block
        >
          Sign in with Google
        </Button>
        <Button
          // type="primary"
          htmlType="submit"
          className="signUp-button"
          block
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/sign-up")}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loginData: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  login: (values) => dispatch(login(values)),
});

LoginPage.propTypes = {
  login: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
