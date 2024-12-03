/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import {
  GoogleOutlined,
  IdcardOutlined,
  BankOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/Register/register.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";

const SignUpPage = (props) => {
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    props.register({
      name: name,
      companyName: company,
      email: email,
      password: password,
    });
  };

  const handleGoogleSignIn = () => {
    console.log("Redirecting to Google Sign-In...");
    // Add your Google OAuth logic here
  };

  useEffect(() => {
    if (props.registerData.registerResponse) {
      let data = props.registerData.registerResponse;
      if (data.responseCode !== "REGISTER_SUCCESS") {
        setError(data.message);
      } else {
        navigate("/admin-dashboard");
      }
    }
  }, [props.registerData, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Start With Your Account Today</h2>
        <Form
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          {/* Name Field */}
          {error ? <div className="error-message">{error}</div> : ""}
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter your name!" },
              { max: 50, message: "Name cannot exceed 50 characters!" },
            ]}
          >
            <Input
              placeholder="Enter your name"
              className="login-input"
              prefix={<IdcardOutlined />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          {/* Company Name Field */}
          <Form.Item
            name="companyName"
            rules={[
              { required: true, message: "Please enter your company name!" },
              {
                max: 100,
                message: "Company name cannot exceed 100 characters!",
              },
            ]}
          >
            <Input
              placeholder="Enter your company name"
              className="login-input"
              prefix={<BankOutlined />}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="login-input"
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              prefix={<KeyOutlined />}
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

          {/* Sign Up Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider>OR</Divider>

        {/* Google Sign-Up Button */}
        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignIn}
          className="google-button"
          block
        >
          Sign up with Google
        </Button>

        {/* Sign In Redirect */}
        <Button
          className="signUp-button"
          block
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/sign-in")}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  register: (values) => dispatch(register(values)),
});

SignUpPage.propTypes = {
  register: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
