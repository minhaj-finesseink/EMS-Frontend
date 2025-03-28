/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import SignInImage from "../../../assets/shift-sign-in-image.jpeg";
import ShiftLogo from "../../../assets/usitive-shift-logo.png";
import googleIcon from "../../../assets/google-icon.svg";
import linkdinIcon from "../../../assets/linkdin-icon.png";
import microsoftIcon from "../../../assets/microsoft-icon.png";
import { login } from "../../../redux/Auth/auth.action";
import "./style.css";

function ShiftSignIn(props) {
  const navigate = useNavigate(); // Use useNavigate hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [moduleError, setModuleError] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    props.login({
      email: email,
      password: password,
      module: "Shift",
    });
  };

  useEffect(() => {
    if (props.loginData.loginResponse) {
      const data = props.loginData.loginResponse;

      // Check if there's an error message
      if (data.error) {
        setLoading(false);
        if (data.error.includes("Incorrect password")) {
          setPasswordError(true);
          setEmailError(false);
        } else if (data.error.includes("User not found")) {
          setEmailError(true);
          setPasswordError(false);
        } else if (data.error.includes("Access denied")) {
          setModuleError(data.error);
        }
      } else {
        if (data.responseCode === "LOGIN_SUCCESS") {
          localStorage.setItem("token", data.token); // Store token in localStorage
          localStorage.setItem("userInfo", JSON.stringify(data.user));
          navigate("/admin-dashboard"); // Redirect to dashboard after successful login
          setLoading(true);
          setModuleError("");
        }
      }
    }
  }, [props.loginData, navigate]);
  return (
    <div className="shift-sign-in-container">
      <div className="shift-sign-in-image-section">
        <div className="shift-sign-in-image-section-conatiner">
          <div className="shift-sign-in-logo-with-title">
            <div className="shift-sign-in-logo">
              <img
                src={ShiftLogo}
                alt="shift logo"
                style={{ width: "47px", height: "47px" }}
              />
            </div>
            <div className="shift-sign-in-title">Usitive Shifts</div>
          </div>
          <div className="shift-sign-in-image-container">
            <img
              className="shift-sign-in-image"
              src={SignInImage}
              alt="sign-in-image"
            />
          </div>
        </div>
      </div>
      <div className="shift-sign-in-form-section">
        <div className="shift-sign-in-form-title-desc">
          <div className="shift-sign-in-form-title">Welcome Back!</div>
          <div className="shift-sign-in-form-desc">
            You need to be signed in to access the project dashboard.
          </div>
        </div>
        <div className="shift-sign-in-form">
          <Form
            name="signup"
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            {moduleError && (
              <Alert
                message={moduleError}
                type="error"
                showIcon
                style={{ marginBottom: "20px" }}
              />
            )}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
              // Trigger the error message
              validateStatus={emailError ? "error" : ""}
              help={emailError ? "User not found" : ""}
            >
              <Input
                className="login-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Enter your password",
                },
              ]}
              // Trigger the error message
              validateStatus={passwordError ? "error" : ""}
              help={passwordError ? "Incorrect password" : ""}
            >
              <Input.Password
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => {
                  // validatePassword(e.target.value);
                  setPassword(e.target.value);
                }}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
              // className="style-for-mobile"
            >
              <div className="remember">
                <Checkbox /> <span>Remember me</span>
              </div>
              <div
                className="forgot-pass"
                onClick={() => navigate("/forgot-password")}
              >
                {" "}
                Forgot password/ username ?
              </div>
            </div>

            {/* Sign Up Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                block
                loading={loading}
                disabled={loading}
              >
                {loading ? "Signing..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          className="style-for-mobile"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <div className="login-icon-container">
            <div className="or-login-div">OR SIGN IN USING</div>
            <img className="login-icons" src={googleIcon} alt="google icon" />
            <img className="login-icons" src={linkdinIcon} alt="linkdin icon" />
            <img
              className="login-icons"
              src={microsoftIcon}
              alt="linkdin icon"
            />
          </div>
          <div style={{ borderLeft: "1px solid #949090" }}></div>
          <div style={{}}>
            <span style={{ fontSize: "14px", color: "#949090" }}>
              {" Don't have an Account?"}
            </span>{" "}
            <br />
            <a
              style={{
                fontSize: "16px",
                color: "#134590",
                textDecoration: "none",
              }}
              href="/shift-sign-up"
            >
              Sign Up Here
            </a>
          </div>
        </div>
        <div className="login-end-text">
          Having Trouble Loging in ? Usitive Help Centre
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loginData: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  login: (values) => dispatch(login(values)),
});

ShiftSignIn.propTypes = {
  login: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShiftSignIn);
