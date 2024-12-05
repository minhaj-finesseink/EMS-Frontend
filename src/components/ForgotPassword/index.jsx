// /* eslint-disable react/prop-types */
// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Alert } from "antd";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { forgotPassword } from "../../redux/Login/login.action";
// import "./style.css";

// const ForgotPassword = (props) => {
//   const [form] = Form.useForm();
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);

//   const handleSubmit = () => {
//     props.forgotPassword({
//       email: email,
//     });
//   };

//   useEffect(() => {
//     if (props.forgotPasswordData) {
//       let data = props.forgotPasswordData;
//       if (data.responseCode === "SUCCESS") {
//         setMessage(data.message);
//         setIsError(false);
//       } else {
//         setIsError(true);
//         setMessage("Something went wrong! Please try again.");
//       }
//     }
//   }, [props.forgotPasswordData]);

//   return (
//     <div className="forgot-password-container">
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Forgot Password
//       </h2>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         className="forgot-password-form"
//       >
//         <Form.Item
//           label="Email Address"
//           name="email"
//           rules={[
//             {
//               required: true,
//               message: "Please enter your email address!",
//             },
//             {
//               type: "email",
//               message: "Please enter a valid email address!",
//             },
//           ]}
//         >
//           <Input
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Request Reset Link
//           </Button>
//         </Form.Item>
//       </Form>
//       {message && (
//         <div>
//           <Alert
//             message={message}
//             type={isError ? "error" : "success"}
//             showIcon
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   forgotPasswordData: state.login.forgotPassword,
// });

// const mapDispatchToProps = (dispatch) => ({
//   forgotPassword: (values) => dispatch(forgotPassword(values)),
// });

// ForgotPassword.propTypes = {
//   forgotPassword: PropTypes.func,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

// /* eslint-disable react/prop-types */
// // eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import LoginImage from "../../assets/login-image.jpeg";
import companyLogo from "../../assets/company-logo.png";
import { Alert, Button, Form, Input } from "antd";
import leftArrow from "../../assets/left-arrow.svg";
import { forgotPassword } from "../../redux/Login/login.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css"; //Main styles from sign in>style.css

function ForgotPassword(props) {
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

  const backToLogin = () => {};

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
          <div className="login-heading">NEED HELP?</div>
          <div className="login-desc">
            Forgot your password or username? No worries! Enter your email to
            receive instructions on how to reset your account.
          </div>
          <div className="login-form-items">
            <Form
              name="login"
              onFinish={handleSubmit}
              vlayout="vertical"
              initialValues={{ remember: true }}
            >
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
              {/* <Form.Item
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
              </Form.Item> */}

              {/* Password Strength Indicators */}
              {/* <div className="password-requirements">
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
              </div> */}

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
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <div className="back-login" onClick={backToLogin}>
                <img
                  style={{ marginRight: "10px" }}
                  src={leftArrow}
                  alt="left arrow"
                />
                <div>Back to login</div>
              </div>
            </div>
          </div>
        </div>
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
