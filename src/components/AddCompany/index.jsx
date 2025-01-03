/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { industryTypes } from "../../utils/industryType";
import { addcompany } from "../../redux/Add-company/company.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";

const { Option } = Select;

function AddCompany(props) {
  const [formValues, setFormValues] = useState({
    companyName: "",
    industryType: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
    ein: "",
    businessSize: "",
  });
  const [accountId, setAccountId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (value, name) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // useEffect(() => {
  //   if (props.loginData.loginResponse) {
  //     let data = props.loginData.loginResponse;
  //     // console.log("add company login data", data.user.accountId);
  //     setAccountId(data.user.accountId);
  //   }
  // }, [props.loginData]);
  
  useEffect(() => {
    if (props.loginData?.loginResponse) {
      const loginData = props.loginData.loginResponse;
      setAccountId(loginData.user.accountId); // Set accountId from loginData
    }

    if (props.registerData?.registerResponse) {
      const registerData = props.registerData.registerResponse;
      setAccountId(registerData.user.accountId); // Set accountId from registerData
    }
  }, [props.loginData, props.registerData]);

  const handleSubmit = () => {
    props.addCompany({
      accountId: accountId,
      companyName: formValues.companyName,
      industryType: formValues.industryType,
      companyAddress1: formValues.address1,
      companyAddress2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      zipcode: formValues.zipcode,
      phoneNumber: formValues.phoneNumber,
      companyRegistrationNumber: formValues.ein,
      businessSize: formValues.businessSize,
    });
  };

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: "600px", margin: "auto", padding: "10px 20px 0 0" }}
      >
        {/* Company Name */}
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[
            { required: true, message: "Enter your company name" },
          ]}
        >
          <Input
            name="companyName"
            value={formValues.companyName}
            onChange={handleChange}
          />
        </Form.Item>

        {/* Industry Type */}
        <Form.Item
          label="Industry Type"
          name="industryType"
          rules={[
            { required: true, message: "Select your industry type" },
          ]}
        >
          <Select
            placeholder="Select Industry Type"
            value={formValues.industryType}
            onChange={(value) => handleSelectChange(value, "industryType")}
          >
            {industryTypes.map((industry) => (
              <Option key={industry.value} value={industry.value}>
                {industry.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Company Address */}
        <Form.Item
          label="Company Address 1"
          name="address1"
          rules={[
            { required: true, message: "Enter your company address" },
          ]}
        >
          <Input
            name="address1"
            value={formValues.address1}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item label="Company Address 2" name="address2">
          <Input
            name="address2"
            value={formValues.address2}
            onChange={handleChange}
          />
        </Form.Item>

        {/* City, State, Zipcode */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Enter your city" }]}
            >
              <Input
                name="city"
                value={formValues.city}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "Enter your state" }]}
            >
              <Input
                name="state"
                value={formValues.state}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Zipcode"
              name="zipcode"
              rules={[
                { required: true, message: "Enter your zipcode" },
              ]}
            >
              <Input
                name="zipcode"
                value={formValues.zipcode}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Phone Number */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Enter your phone number" },
          ]}
        >
          <Input
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
          />
        </Form.Item>

        {/* Company Registration Number/EIN (Optional) */}
        <Form.Item
          label="Company Registration Number/EIN Number (Optional)"
          name="ein"
        >
          <Input name="ein" value={formValues.ein} onChange={handleChange} />
        </Form.Item>

        {/* Business Size */}
        <Form.Item
          label="Business Size"
          name="businessSize"
          rules={[
            { required: true, message: "Select your business size" },
          ]}
        >
          <Select
            placeholder="Select Business Size"
            value={formValues.businessSize}
            onChange={(value) => handleSelectChange(value, "businessSize")}
          >
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Select>
        </Form.Item>

        {/* Register Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  companyData: state.AddCompany,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addCompany: (values) => dispatch(addcompany(values)),
});

AddCompany.propTypes = {
  login: PropTypes.func,
  addCompany: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCompany);
