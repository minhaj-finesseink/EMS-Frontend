/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import LoginImage from "../../assets/sign-in-image.jpeg";
import usitiveLogo from "../../assets/usitive-logo-with-text.png";
import { Alert, Button, Form, Input } from "antd";
import leftArrow from "../../assets/left-arrow.svg";
import { forgotPassword } from "../../redux/Login/login.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";

function ForgotPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    props.forgotPassword({
      email: email,
    });
  };

  useEffect(() => {
    if (props.forgotPasswordData) {
      let data = props.forgotPasswordData;
      if (data.responseCode === "SUCCESS") {
        setMessage(
          "Check your inbox for the instruction. Didnt receive any mail yet? Resend in 10 seconds"
        );
        setIsError(false);
        setLoading(false);
      } else {
        setIsError(true);
        setMessage("Something went wrong! Please try again.");
      }
    }
  }, [props.forgotPasswordData]);

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
          <div>
            <div
              style={{
                fontSize: "32px",
                color: "#949090",
                marginBottom: "40px",
              }}
            >
              NEED HELP ?
            </div>
            <div className="login-desc">
              Forgot your password or username? No worries! Enter your email to
              receive instructions on how to reset your account.
            </div>
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
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input
                    className="login-input"
                    //   prefix={<MailOutlined />}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

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
                    {loading ? "Submit..." : "Submit"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            {message && (
              <div>
                <Alert
                  message={message}
                  type={isError ? "error" : "success"}
                  showIcon
                />
              </div>
            )}

            <div
              className="login-end-text"
              onClick={() => navigate("/sign-in")}
            >
              <img
                style={{ marginRight: "10px" }}
                src={leftArrow}
                alt="left arrow"
              />
              BACK TO LOGIN
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  forgotPasswordData: state.login.forgotPassword,
});

const mapDispatchToProps = (dispatch) => ({
  forgotPassword: (values) => dispatch(forgotPassword(values)),
});

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
