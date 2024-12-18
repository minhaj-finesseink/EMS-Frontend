/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import LoginImage from "../../assets/login-image.jpeg";
import companyLogo from "../../assets/company-logo.png";
import { Button, Checkbox, Form, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../redux/Login/login.action";
import { useNavigate } from "react-router-dom";
import "./style.css";

function SignIn(props) {
  const navigate = useNavigate(); // Use useNavigate hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const validatePassword = (value) => {
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    props.login({
      email: email,
      password: password,
    });
  };

  useEffect(() => {
    if (props.loginData.loginResponse) {
      const data = props.loginData.loginResponse;

      // Check if there's an error message
      if (data.error) {
        setMessage(data.error); // Display the error message if available
        setLoading(false);
      } else {
        setMessage(data.message); // Display the success message if no error

        if (data.responseCode === "LOGIN_SUCCESS") {
          localStorage.setItem("token", data.token); // Store token in localStorage
          navigate("/admin-dashboard"); // Redirect to dashboard after successful login
          setLoading(true);
        }
      }
    }
  }, [props.loginData, navigate]);

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img className="login-image" src={LoginImage} alt="Login image" />
      </div>
      <div className="login-form-container">
        <div style={{ width: "100%" }}>
          <img
            className="login-company-logo"
            src={companyLogo}
            alt="company logo"
          />
        </div>
        <div>
          <div className="login-heading">SIGN IN</div>
          <div className="login-desc">
            Welcome back! Log in to access your account and manage your team
            with ease
          </div>
          <div className="login-form-items">
            <Form
              name="login"
              onFinish={handleSubmit}
              vlayout="vertical"
              initialValues={{ remember: true }}
            >
              {message ? <div className="error-message">{message}</div> : ""}
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
                  //   prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve(); // Skip validation if the field is empty
                      }
                      if (
                        passwordStrength.hasMinLength &&
                        passwordStrength.hasUppercase &&
                        passwordStrength.hasNumber &&
                        passwordStrength.hasSymbol
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Password must meet all requirements."
                      );
                    },
                  },
                ]}
              >
                <Input.Password
                  //   prefix={<KeyOutlined />}
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
                    passwordStrength.hasNumber
                      ? "requirement met"
                      : "requirement"
                  }
                >
                  1 Numeric
                </span>
                <span
                  className={
                    passwordStrength.hasSymbol
                      ? "requirement met"
                      : "requirement"
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
                  <Checkbox>
                    <span style={{ color: "rgba(164, 157, 157, 0.87)" }}>
                      Remember me
                    </span>
                  </Checkbox>
                  <div
                    style={{
                      color: "rgba(164, 157, 157, 0.87)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </div>
                </div>
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
                  {loading ? "SignIn..." : "Sign In"}
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Don't have an account? <a href="/sign-up">Sign up now</a>
            </div>
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
