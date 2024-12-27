/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form, message, Select, Row, Col } from "antd";
import { industryTypes } from "../../utils/industryType";
import { addcompany } from "../../redux/Add-company/company.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDepartment } from "../../redux/Add-department/department.action";
import Image from "../../assets/company-details-image.jpeg";
import countryStateMapping from "../../utils/countryStateMapping";
import "./style.css";

const { Option } = Select;

const AccountSetup = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    companyName: "",
    industryType: "",
    customIndustry: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
    ein: "",
    businessSize: "",
    country: "",
  });
  const [isOtherIndustry, setIsOtherIndustry] = useState(false); // For 'Other' Industry Type
  const [departmentValues, setDepartmentValues] = useState([
    {
      id: Date.now(),
      departmentName: "",
      customDepartment: "",
      departmentCode: "",
      isOther: false,
    },
  ]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormValues({
      companyName: "",
      industryType: "",
      customIndustry: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      phoneNumber: "",
      ein: "",
      businessSize: "",
    });
    setDepartmentValues([
      ...departmentValues,
      {
        id: Date.now(),
        departmentName: "",
        customDepartment: "",
        departmentCode: "",
      },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "industryType") {
      setIsOtherIndustry(value === "other");
    }
  };

  const handleAccountSubmit = () => {
    props.addCompany({
      userId: userInfo._id,
      companyName: formValues.companyName,
      industryType:
        formValues.industryType === "other"
          ? formValues.customIndustry
          : formValues.industryType,
      address1: formValues.address1,
      address2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      zipcode: formValues.zipcode,
      phoneNumber: formValues.phoneNumber,
      ein: formValues.ein,
      businessSize: formValues.businessSize,
      country: formValues.country,
    });
  };

  useEffect(() => {
    if (props.companyData.addCompanyResponse) {
      let data = props.companyData.addCompanyResponse;
      if (data.success) {
        message.success("Account details added successfully!");
        handleCancel();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.companyData.addCompanyResponse]);

  useEffect(() => {
    let data = props.showModal;
    if (!data) {
      setIsModalVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="company-setup-main-container">
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false} // Prevents modal dismissal on outside click
        closable={false} // Removes the close button
        className="company-setup-modal"
        // width={"90%"}
        // style={{ top: "20px" }}
      >
        <div className="company-setup-container">
          <div className="company-setup-image-container">
            <img
              className="company-setup-image"
              src={Image}
              alt="Add Company Details Image"
            />
          </div>
          <Form
            layout="vertical"
            onFinish={handleAccountSubmit}
            className="company-setup-form-container"
          >
            {/* Company Name */}
            <Form.Item
              name="companyName"
              rules={[
                { required: true, message: "Please input your company name!" },
              ]}
            >
              <Input
                placeholder="Company Name"
                className="company-setup-input"
                name="companyName"
                value={formValues.companyName}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Industry Type */}
            <Form.Item
              name="industryType"
              rules={[
                {
                  required: true,
                  message: "Please select your industry type!",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Industry Type"
                value={formValues.industryType}
                onChange={(value) => handleSelectChange(value, "industryType")}
              >
                {industryTypes.map((industry) => (
                  <Option key={industry.value} value={industry.value}>
                    {industry.label}
                  </Option>
                ))}
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {/* Show input for 'Other' Industry */}
            {isOtherIndustry && (
              <Form.Item
                name="customIndustry"
                rules={[
                  {
                    required: true,
                    message: "Please specify your industry!",
                  },
                ]}
              >
                <Input
                  placeholder="Industry Type Name"
                  className="company-setup-input"
                  name="customIndustry"
                  value={formValues.customIndustry}
                  onChange={handleInputChange}
                />
              </Form.Item>
            )}

            {/* Company Address */}
            <Form.Item
              name="address1"
              rules={[
                {
                  required: true,
                  message: "Please input your company address!",
                },
              ]}
            >
              <Input
                placeholder="Company Address"
                className="company-setup-input"
                name="address1"
                value={formValues.address1}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item name="address2">
              <Input
                placeholder="Company Address 2"
                className="company-setup-input"
                name="address2"
                value={formValues.address2}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* City, Country, State, Zipcode */}
            <Row gutter={16}>
              {/* City */}
              <Col span={12}>
                <Form.Item
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input
                    placeholder="City"
                    className="company-setup-input"
                    name="city"
                    value={formValues.city}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>

              {/* Country */}
              <Col span={12}>
                <Form.Item
                  name="country"
                  rules={[
                    { required: true, message: "Please select a country!" },
                  ]}
                >
                  <Select
                    className="company-setup-input"
                    placeholder="Country"
                    value={formValues.country}
                    onChange={(value) => handleSelectChange(value, "country")}
                  >
                    {Object.keys(countryStateMapping).map((country) => (
                      <Option key={country} value={country}>
                        {country}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* State */}
              <Col span={12}>
                <Form.Item
                  name="state"
                  rules={[
                    { required: true, message: "Please select a state!" },
                  ]}
                >
                  <Select
                    className="company-setup-input"
                    placeholder="State"
                    value={formValues.state}
                    onChange={(value) => handleSelectChange(value, "state")}
                    disabled={!formValues.country} // Disable if no country selected
                  >
                    {(countryStateMapping[formValues.country] || []).map(
                      (state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>

              {/* Zipcode */}
              <Col span={12}>
                <Form.Item
                  name="zipcode"
                  // rules={[
                  //   { required: true, message: "Please input your zipcode!" },
                  //   {
                  //     pattern: /^\d{5}(-\d{4})?$/, // Regex for US ZIP codes (5 digits, optional 4 digits)
                  //     message: "Please enter a valid ZIP code!",
                  //   },
                  // ]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your ZIP/Postal Code!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve(); // Handled by the "required" rule.
                        }

                        // Define ZIP code patterns based on country
                        const countryZipPatterns = {
                          "United States": /^\d{5}(-\d{4})?$/, // 5 digits, optional 4 digits
                          "United Kingdom":
                            /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // UK postcode
                          "United Arab Emirates": /^(\d{3,6}|PO Box \d{3,6})$/, // UAE PO Box (variable digits)
                          Qatar: /^(\d{3,6}|PO Box \d{3,6})$/, // Qatar (no ZIP, uses PO Box)
                          "Saudi Arabia": /^\d{5}$/, // 5 digits
                          Bahrain: /^\d{3}$/, // 3 digits
                          Kuwait: /^\d{5}$/, // 5 digits
                        };

                        // Fetch the selected country (update this based on your form's country field)
                        const selectedCountry = formValues.country || ""; // Adjust as per your state logic

                        const pattern = countryZipPatterns[selectedCountry];
                        if (pattern && !pattern.test(value)) {
                          return Promise.reject(
                            new Error(
                              `Please enter a valid ZIP/Postal Code for ${selectedCountry}!`
                            )
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Zip"
                    className="company-setup-input"
                    name="zipcode"
                    value={formValues.zipcode}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Phone Number */}
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  pattern: /^[0-9]{8,15}$/, // Allows only digits with a length of 10 to 15
                  message: "Please enter a valid phone number (10-15 digits)!",
                },
              ]}
            >
              <Input
                placeholder="Phone Number"
                className="company-setup-input"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Company Registration Number/EIN */}
            <Form.Item name="ein">
              <Input
                placeholder="Company Registration Number/EIN"
                className="company-setup-input"
                name="ein"
                value={formValues.ein}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Business size */}
            <Form.Item
              name="businessSize"
              rules={[
                {
                  required: true,
                  message: "Please select your business size!",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Business Size"
                value={formValues.businessSize}
                onChange={(value) => handleSelectChange(value, "businessSize")}
              >
                <Option value="small">Up to 10 Employees</Option>
                <Option value="medium">10 - 49 Employees</Option>
                <Option value="large">50 - 249 Employees</Option>
                <Option value="extra-large">250 + Employees</Option>
              </Select>
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                className="company-setup-button"
              >
                Finish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companyData: state.company,
  departmentData: state.department,
});

const mapDispatchToProps = (dispatch) => ({
  addCompany: (values) => dispatch(addcompany(values)),
  addDepartment: (values) => dispatch(addDepartment(values)),
});

AccountSetup.propTypes = {
  addCompany: PropTypes.func,
  addDepartment: PropTypes.func,
  companyData: PropTypes.object,
  departmentData: PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountSetup);
