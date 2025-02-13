/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../assets/usitive-logo.svg";
import SignUpImage from "../../../assets/video-meet-sign-up.png";
import {
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import CustomButton from "../../../components/CustomButton";
import GoogleIcon from "../../../assets/google-icon.svg";
import MicrosoftIcon from "../../../assets/microsoft-icon.png";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  createVerificationCode,
  verifyCode,
} from "../../../redux/Auth/auth.action";
import { addUser } from "../../../redux/User/user.action";
import "./style.css";

function VideoSignUp(props) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    referralSource: "",
  });
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [currentStep, setCurrentStep] = useState("form"); // 'form', 'verify', or 'password'
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (value) => {
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  // Refs for input boxes
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, ""); // Ensure only numeric input
    if (cleanValue.length > 0) {
      const newCode = [...verificationCode]; // Create a new array
      newCode[index] = cleanValue; // Update the specific index
      setVerificationCode(newCode);

      // Move to the next input field if a digit is entered
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newCode = [...verificationCode]; // Create a new array
      if (!verificationCode[index] && index > 0) {
        // Move focus to the previous input if current input is empty
        inputRefs.current[index - 1].focus();
        newCode[index - 1] = ""; // Clear the previous input
      }
      newCode[index] = ""; // Clear the current input
      setVerificationCode(newCode);
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    setFormValues(allValues); // Update state with all form values
  };

  const handleNext = () => {
    props.createVerificationCode({
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
    });
    setLoading(true);
  };

  useEffect(() => {
    if (props.loginData.createVerificationCodeResponse) {
      let data = props.loginData.createVerificationCodeResponse;
      if (data.success) {
        setCurrentStep("verify");
        message.success(data.message);
      } else if (data.error) {
        message.error(data.error);
      }
      setLoading(false);
      props.loginData.createVerificationCodeResponse = null;
    }
  }, [props.loginData.createVerificationCodeResponse]);

  const handleNextToPass = () => {
    props.verifyCode({
      email: formValues.email,
      verificationCode: verificationCode.join(""),
    });
    setLoading(true);
  };

  useEffect(() => {
    if (props.loginData.verifyCodeResponse) {
      let data = props.loginData.verifyCodeResponse;
      if (data.success) {
        setCurrentStep("password");
        message.success("Your code verified");
      } else if (data.error) {
        message.error(data.error);
      }
      setLoading(false);
      props.loginData.verifyCodeResponse = null;
    }
  }, [props.loginData.verifyCodeResponse]);

  const handleSubmit = () => {
    props.addUser({
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      companyName: formValues.companyName,
      email: formValues.email,
      password: password,
      referralSource: formValues.referralSource,
      isVideoConferencingActive: true,
      role: "admin",
    });
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.success) {
        message.success(data.message);
        setTimeout(() => {
          navigate("/video-dashboard");
        }, 500);
      }
    }
  }, [props.userData.addUserResponse]);

  return (
    <div className="usitive-meet-container">
      <div className="usitive-meet-left-section">
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
          <div>
            <img
              style={{ width: "100%" }}
              src={SignUpImage}
              alt="sign up image"
            />
          </div>
        </div>
      </div>
      <div className="usitive-meet-right-section">
        <div className="usitive-meet-right-items">
          {currentStep === "form" ? (
            <>
              <div className="usitive-meet-title">Create an Account</div>
              <div className="usitive-meet-desc">
                Quick and Easy Setup—Your First Meeting Awaits!
              </div>
              <div className="usitive-meet-form">
                <Form
                  name="signUpForm"
                  onValuesChange={handleFormChange}
                  onFinish={handleNext}
                  layout="vertical"
                >
                  <Row gutter={16}>
                    {/* First Name */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Enter your first name",
                          },
                          {
                            max: 50,
                            message: "Name cannot exceed 50 characters",
                          },
                        ]}
                      >
                        <Input
                          // style={{ height: "48px" }}
                          placeholder="First Name"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Enter your last name",
                          },
                          {
                            max: 50,
                            message: "Name cannot exceed 50 characters",
                          },
                        ]}
                      >
                        <Input
                          // style={{ height: "48px" }}
                          placeholder="Last Name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Enter your email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input 
                    // style={{ height: "48px" }}
                     placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    name="companyName"
                    rules={[
                      {
                        required: true,
                        message: "Enter your company name",
                      },
                      {
                        max: 100,
                        message: "Company name cannot exceed 100 characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Name of the company"
                      // style={{ height: "48px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="referral"
                    rules={[{ required: true, message: "Select an option" }]}
                  >
                    <Select
                      // style={{ height: "48px" }}
                      placeholder="How did you hear about us?"
                    >
                      <Select.Option value="google">Google</Select.Option>
                      <Select.Option value="socialMedia">
                        Social Media
                      </Select.Option>
                      <Select.Option value="friend">Friend</Select.Option>
                      <Select.Option value="advertisement">
                        Advertisement
                      </Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>

                  <CustomButton
                    color={"blue"}
                    style={{ width: "100%", borderRadius: "10px" }}
                    htmlType="submit"
                    loading={loading}
                  >
                    Next
                  </CustomButton>
                </Form>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
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
                  Already have an account?{" "}
                  <span
                    className="terms-link"
                    onClick={() => navigate("/video-sign-in")}
                  >
                    Sign In
                  </span>
                </p>
              </div>
            </>
          ) : currentStep === "verify" ? (
            <div>
              <div
                className="usitive-meet-title"
                style={{ textAlign: "start" }}
              >
                Verify your email{" "}
              </div>
              <div
                className="usitive-meet-desc"
                style={{ marginBottom: "50px", textAlign: "start" }}
              >
                A confirmation code was sent to {formValues.email}
              </div>
              {/* Six-Digit Code Input  */}
              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    gap: "30px",
                    justifyContent: "space-between",
                  }}
                >
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      ref={(el) => (inputRefs.current[index] = el)}
                      style={{
                        width: "56px",
                        height: "56px",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                    />
                  ))}
                </div>
              </Form.Item>
              <CustomButton
                color={"blue"}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  margin: "10px 0 30px",
                }}
                onClick={handleNextToPass}
                disabledCondition={verificationCode.some(
                  (digit) => digit === "" || digit == null
                )} // Button disabled if any digit is empty
              >
                Next{" "}
              </CustomButton>
              <div>
                <p
                  style={{
                    // fontWeight: 500,
                    margin: 0,
                    color: "#887D7D",
                    // textAlign: "center",
                  }}
                >
                  Didn’t receive an email?{" "}
                  <span style={{ fontWeight: 500 }}>Resend</span>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Form
                name="passwordForm"
                layout="vertical"
                onFinish={handleSubmit}
              >
                <div
                  className="usitive-meet-title"
                  style={{ textAlign: "start" }}
                >
                  Set your password{" "}
                </div>
                <div
                  className="usitive-meet-desc"
                  style={{ marginBottom: "50px", textAlign: "start" }}
                >
                  Your account login will be {formValues.email}
                </div>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Enter your password",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve();
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
                    name="password"
                    // style={{ height: "48px" }}
                    //   prefix={<KeyOutlined />}
                    placeholder="Password"
                    // className="sign-up-input"
                    value={password}
                    onChange={(e) => {
                      validatePassword(e.target.value);
                      setPassword(e.target.value);
                    }}
                  />
                </Form.Item>

                <div style={{ margin: "30px 0" }}>
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                    <li>Must be at least 6 characters long.</li>
                    <li>
                      Password must include an uppercase, a lowercase, a number
                      & a special character.
                    </li>
                  </ul>
                </div>

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
                <CustomButton
                  color={"blue"}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    margin: "10px 0 30px",
                  }}
                  htmlType="submit"
                >
                  Sign up{" "}
                </CustomButton>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loginData: state.login,
  userData: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  createVerificationCode: (values) => dispatch(createVerificationCode(values)),
  verifyCode: (values) => dispatch(verifyCode(values)),
  addUser: (values) => dispatch(addUser(values)),
});

VideoSignUp.propTypes = {
  loginData: PropTypes.object,
  // userData: PropTypes.object,
  addUser: PropTypes.func,
  createVerificationCode: PropTypes.func,
  verifyCode: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoSignUp);
