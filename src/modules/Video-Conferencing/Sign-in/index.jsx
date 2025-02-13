/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Checkbox, Divider, Form, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Logo from "../../../assets/usitive-logo.svg";
import SignUpImage from "../../../assets/video-meet-sign-in.png";
import CustomButton from "../../../components/CustomButton";
import GoogleIcon from "../../../assets/google-icon.svg";
import MicrosoftIcon from "../../../assets/microsoft-icon.png";
import "./style.css";
import { login } from "../../../redux/Auth/auth.action";

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
      module: "VideoConference",
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
          navigate("/video-dashboard"); // Redirect to dashboard after successful login
          setLoading(true);
          setModuleError("");
        }
      }
    }
  }, [props.loginData, navigate]);

  return (
    <div className="usitive-meet-container">
      <div className="usitive-meet-left-section">
        {/* <div
          style={{
            height: "200px",
            width: "200px",
            border: "1px solid red",
            borderRadius: "18px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div> */}

        <div className="usitive-meet-left-items">
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "36px",
            }}
          >
            <img src={Logo} alt="usitive logo" />
            usitive meet
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ width: "80%" }}
              src={SignUpImage}
              alt="sign up image"
            />
          </div>
        </div>
      </div>
      <div className="usitive-meet-right-section">
        <div className="usitive-meet-right-items">
          <div className="usitive-meet-title">Welcome Back!</div>
          <div className="usitive-meet-form">
            <Form name="signup" onFinish={handleSubmit} layout="vertical">
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
                  style={{ height: "48px" }}
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
                  style={{ height: "48px" }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Item>
              <CustomButton
                color={"blue"}
                style={{ width: "100%", borderRadius: "10px" }}
                htmlType="submit"
                loading={loading}
              >
                Log in
              </CustomButton>
            </Form>
          </div>
          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            {" "}
            <Checkbox />
            <p style={{ fontWeight: 500, margin: 0 }}>
              I agree to the{" "}
              <span className="terms-link">terms of service</span> and{" "}
              <span className="terms-link">privacy policy</span>.
            </p>
          </div>
          <Divider orientation="center">
            <span className="or-style">OR</span>
          </Divider>{" "}
          <div
            style={{
              display: "flex",
              gap: "30px",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div className="or-login-icon-div">
              <img src={GoogleIcon} alt="" style={{ width: "28px" }} />
            </div>
            <div className="or-login-icon-div">
              <img src={MicrosoftIcon} alt="" style={{ width: "28px" }} />
            </div>
          </div>
          <div>
            <p
              style={{
                fontWeight: 500,
                margin: 0,
                color: "#887D7D",
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <span
                className="terms-link"
                onClick={() => navigate("/video-sign-up")}
              >
                Sign up
              </span>
            </p>
          </div>
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

SignIn.propTypes = {
  login: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
