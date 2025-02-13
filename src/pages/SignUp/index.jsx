/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Input, Row, Col, Select } from "antd";
import signUpImage from "../../assets/signup-image.jpeg";
import usitiveLogo from "../../assets/usitive-logo-with-text.png";
import googleIcon from "../../assets/google-icon.svg";
import linkdinIcon from "../../assets/linkdin-icon.png";
import microsoftIcon from "../../assets/microsoft-icon.png";
import { addUser } from "../../redux/User/user.action";
import CustomButton from "../../components/CustomButton";
import "./style.css";

function SignUpPage(props) {
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [created, setCreated] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

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
    props.addUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      companyName: company,
      role: "admin",
      referralSource: referralSource,
      isHrActive: true,
    });
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        setIsEmailError(true);
      } else {
        navigate("/admin-dashboard");
        setLoading(true);
        // setCreated(true);
        setIsEmailError(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.addUserResponse]);

  return (
    <div className="sign-up-container">
      <div className="image-container">
        <img className="sign-up-image" src={signUpImage} alt="Sign Up" />
      </div>
      <div className="form-container">
        <div style={{ width: "100%" }}>
          <div className="sign_up_image_container">
            <img
              className="company-logo"
              src={usitiveLogo}
              alt="company logo"
            />
          </div>
          <div>
            <div className="sign-up-desc">
              Welcome! Start your Usitive account today and take the first step
              toward seamless management and collaboration!
            </div>
            <div className="form-items">
              <Form
                name="signup"
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{ remember: true }}
              >
                {/* {error ? <div className="error-message">{error}</div> : ""} */}
                {/* First Name and Last Name in a Single Row */}
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
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  {/* Last Name */}
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
                        placeholder="Last Name"
                        // className="sign-up-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

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
                    // className="sign-up-input"
                    //   prefix={<BankOutlined />}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </Form.Item>

                {/* Dropdown for "How did you hear about us?" */}
                <Form.Item
                  name="referral"
                  rules={[{ required: true, message: "Select an option" }]}
                >
                  <Select
                    placeholder="How did you hear about us?"
                    className="sign-up-input"
                    onChange={(value) => setReferralSource(value)} // Update state or handle change
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

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Enter your email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                  validateStatus={isEmailError ? "error" : ""}
                  help={isEmailError ? "This email already exists" : ""}
                >
                  <Input
                    // className="sign-up-input"
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
                    placeholder="Password"
                    // className="sign-up-input"
                    value={password}
                    onChange={(e) => {
                      validatePassword(e.target.value);
                      setPassword(e.target.value);
                    }}
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
                  {/* <Button
                    type="primary"
                    htmlType="submit"
                    className="sign-up-button"
                    // block
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button> */}
                  <CustomButton
                    htmlType="submit"
                    color={"blue"}
                    block
                    loading={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </CustomButton>
                </Form.Item>
              </Form>
            </div>

            <div
              className="sign-up-icon-main"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
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
                <img
                  className="sign-up-icons"
                  src={microsoftIcon}
                  alt="linkdin icon"
                />
              </div>
              <div style={{ borderLeft: "1px solid #949090" }}></div>
              <div className="sign_up_login_link">
                <span style={{ fontSize: "14px", color: "#949090" }}>
                  Already have an Account?
                </span>{" "}
                <br />
                <a
                  style={{
                    fontSize: "16px",
                    color: "#007DC5",
                    textDecoration: "none",
                  }}
                  href="/sign-in"
                >
                  Sign In Here
                </a>
              </div>
            </div>
            <div className="end-text">
              By clicking “Sign Up”, you agree to Usitive Terms of Use and
              Privacy Policy. Need help? Visit our Help Center.
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
});

SignUpPage.propTypes = {
  addUser: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
