/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotPassword } from "../../redux/Login/login.action";
import "./style.css";

const ForgotPassword = (props) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = () => {
    props.forgotPassword({
      email: email,
    });
  };

  useEffect(() => {
    if (props.forgotPasswordData) {
      let data = props.forgotPasswordData;
      if (data.responseCode === "SUCCESS") {
        setMessage(data.message);
        setIsError(false);
      } else {
        setIsError(true);
        setMessage("Something went wrong! Please try again.");
      }
    }
  }, [props.forgotPasswordData]);

  return (
    <div className="forgot-password-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Forgot Password
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="forgot-password-form"
      >
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email address!",
            },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Request Reset Link
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
    </div>
  );
};

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
