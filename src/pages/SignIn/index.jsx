/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import LoginImage from "../../assets/sign-in-image.jpeg";
import usitiveLogo from "../../assets/usitive-logo-with-text.png";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../redux/Auth/auth.action";
import { useNavigate } from "react-router-dom";
import googleIcon from "../../assets/google-icon.svg";
import linkdinIcon from "../../assets/linkdin-icon.png";
import microsoftIcon from "../../assets/microsoft-icon.png";
import "./style.css";

function SignIn(props) {
  const navigate = useNavigate();
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
      module: "HR",
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
        // setMessage(data.message); // Display the success message if no error
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
    <div className="login-container">
      <div className="login-image-container">
        <img className="login-image" src={LoginImage} alt="Sign Up" />
      </div>
      <div className="login-form-container">
        <div style={{ width: "100%" }}>
          <img
            className="login-company-logo"
            src={usitiveLogo}
            alt="company logo"
          />
          {/* {!created ? ( */}
          <div>
            <div
              style={{
                fontSize: "32px",
                color: "#949090",
                marginBottom: "10px",
              }}
              className="sign_in_heading"
            >
              SIGN IN
            </div>
            <div className="login-desc">Login to your Account</div>
            {moduleError && (
              <Alert
                message={moduleError}
                type="error"
                showIcon
                style={{ marginBottom: "20px" }}
              />
            )}

            <div className="login-form-items">
              <Form
                name="signup"
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{ remember: true }}
              >
                {/* {message ? <div className="error-message">{message}</div> : ""} */}
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
                    //   prefix={<MailOutlined />}
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
                    //   prefix={<KeyOutlined />}
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
                    Forgot password
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

            {/* Display Message */}
            {/* {message && (
              <div style={{ marginBottom: "20px" }}>
                <Alert
                  message={message}
                  type={isError ? "error" : "success"}
                  showIcon
                />
              </div>
            )} */}

            <div
              className="style-for-mobile"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <div className="login-icon-container">
                <div className="or-login-div">OR SIGN IN USING</div>
                <img
                  className="login-icons"
                  src={googleIcon}
                  alt="google icon"
                />
                <img
                  className="login-icons"
                  src={linkdinIcon}
                  alt="linkdin icon"
                />
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
                  href="/sign-up"
                >
                  Sign Up Here
                </a>
              </div>
            </div>
            <div className="login-end-text">
              Having Trouble Loging in ? Usitive Help Centre
            </div>
          </div>
        </div>{" "}
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

SignIn.propTypes = {
  login: PropTypes.func,
  loginData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
