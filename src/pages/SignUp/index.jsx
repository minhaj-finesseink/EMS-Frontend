/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Input } from "antd";
import signUpImage from "../../assets/Sign-up-image.jpeg";
import companyLogo from "../../assets/company-logo.png";
import googleIcon from "../../assets/google-icon.svg";
import linkdinIcon from "../../assets/linkdin-icon.png";
import { register } from "../../redux/Register/register.action";
import signUpAnimation from "../../assets/sign-up-animation.gif";
import "./style.css";

function SignUpPage(props) {
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
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

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
    setLoading(true);
    props.register({
      name: name,
      companyName: company,
      email: email,
      password: password,
    });
  };

  //   const handleGoogleSignIn = () => {
  //     console.log("Redirecting to Google Sign-In...");
  //     // Add your Google OAuth logic here
  //   };

  useEffect(() => {
    if (props.registerData.registerResponse) {
      let data = props.registerData.registerResponse;
      if (data.responseCode !== "REGISTER_SUCCESS") {
        setError(data.message);
        setLoading(false);
      } else {
        // navigate("/admin-dashboard");
        setLoading(true);
        setCreated(true);
      }
    }
  }, [props.registerData, navigate]);

  const handleClick = () => {
    navigate("/admin-dashboard");
    setCreated(false);
  };

  return (
    <div className="sign-up-container">
      <div className="image-container">
        <img className="sign-up-image" src={signUpImage} alt="Sign Up" />
      </div>
      <div className="form-container">
        <div style={{ width: "100%" }}>
          <img className="company-logo" src={companyLogo} alt="company logo" />
          {!created ? (
            <div>
              <div className="sign-up-desc">
                Welcome! Start your Usitive account today and take the first
                step toward seamless management and collaboration!
              </div>
              <div className="form-items">
                <Form
                  name="signup"
                  onFinish={handleSubmit}
                  layout="vertical"
                  initialValues={{ remember: true }}
                >
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
                      className="sign-up-input"
                      //   prefix={<IdcardOutlined />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Item>

                  {/* Company Name Field */}
                  <Form.Item
                    name="companyName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your company name!",
                      },
                      {
                        max: 100,
                        message: "Company name cannot exceed 100 characters!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your company name"
                      className="sign-up-input"
                      //   prefix={<BankOutlined />}
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
                      className="sign-up-input"
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
                      className="sign-up-input"
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

                  {/* Sign Up Button */}
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="sign-up-button"
                      block
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="sign-up-icon-container">
                <div className="or-sign-up-div">OR SIGN UP USING</div>
                <img
                  className="sign-up-icons"
                  src={googleIcon}
                  alt="google icon"
                />
                <img
                  className="sign-up-icons"
                  src={linkdinIcon}
                  alt="linkdin icon"
                />
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  className="sign-up-animation"
                  src={signUpAnimation}
                  alt="Account created"
                />
              </div>
              <div className="ac-created-success">
                Your account is <br /> successfully created
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="sign-up-button"
                block
                onClick={handleClick}
              >
                Continue
              </Button>
            </div>
          )}
        </div>{" "}
      </div>
    </div>
  );
}

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