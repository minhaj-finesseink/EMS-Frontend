/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form, Select, Row, Col } from "antd";
import { industryTypes } from "../../utils/industryType";
import { addcompany } from "../../redux/Add-company/company.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDepartment } from "../../redux/Add-department/department.action";
import Image from "../../assets/company-details-image.jpeg";
import countryStateMapping from "../../utils/countryStateMapping";
import toast from "react-hot-toast";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "./style.css";

const { Option } = Select;

const AccountSetup = (props) => {
  const [form] = Form.useForm();
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

  const [states, setStates] = useState([]);
  const [phonePrefix, setPhonePrefix] = useState("");

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Append the prefix to the phone number
      setFormValues((prev) => ({
        ...prev,
        [name]: phonePrefix + value,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value, field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "industryType") {
      setIsOtherIndustry(value === "other");
    }
    if (field === "country") {
      const countryInfo = countryStateMapping[value];
      // console.log("countryInfo", countryInfo);
      setStates(countryInfo ? countryInfo.states : []);
      setPhonePrefix(countryInfo ? countryInfo.phoneCode : "");
    }
  };

  const handleAccountSubmit = () => {
    const payload = {
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
    };
    // console.log("payload", payload);
    props.addCompany(payload);
  };

  useEffect(() => {
    if (props.companyData.addCompanyResponse) {
      let data = props.companyData.addCompanyResponse;
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          handleCancel();
        }, 2000);
      }
      props.companyData.addCompanyResponse = null;
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

  // Handler for the place selection
  const handlePlaceSelect = async (place) => {
    console.log('place', place);
    
    // Extract the place_id
    const placeId = place.value.place_id;

    // Use the Google Places API to fetch more details about the place
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId: placeId }, (details, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        details
      ) {
        console.log("Place Details:", details);
        extractAddressComponents(details);
      } else {
        console.error("Error fetching place details:", status);
      }
    });
  };

  // Function to extract address components
  const extractAddressComponents = (details) => {
    let intersection = "";
    let sublocality = "";
    let locality = "";
    let streetNumber = "";
    let route = "";
    let address1 = "";
    let address2 = "";
    let city = "";
    let state = "";
    let country = "";
    let zip = "";

    details.address_components.forEach((component) => {
      const types = component.types;

      // address 1
      if (types.includes("street_number")) {
        streetNumber = component.long_name;
      }
      if (types.includes("route")) {
        route = component.long_name;
      }
      if (types.includes("intersection")) {
        intersection = component.long_name;
      }
      if (types.includes("sublocality")) {
        sublocality = component.long_name;
      }
      if (types.includes("locality")) {
        locality = component.long_name;
      }
      address1 =
        streetNumber +
        ", " +
        route +
        ", " +
        intersection +
        ", " +
        sublocality +
        ", " +
        locality;

      // address 2
      // if (types.includes("sublocality_level_1")) {
      //   address2 = component.long_name;
      // }

      // City
      if (types.includes("administrative_area_level_3")) {
        city = component.long_name;
      }

      // State
      if (types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }

      // Country
      if (types.includes("country")) {
        country = component.long_name;
      }

      // Zip
      if (types.includes("postal_code")) {
        zip = component.long_name;
      }
    });

    // Update the formValues state
    const updatedValues = {
      ...formValues,
      address1,
      address2,
      city,
      state,
      country,
      zipcode: zip,
    };

    setFormValues(updatedValues); // Updates local state

    // **Ensure Ant Design Form updates with new values**
    form.setFieldsValue(updatedValues);
  };

  return (
    <div className="company-setup-main-container">
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false} // Prevents modal dismissal on outside click
        closable={false} // Removes the close button
        className="company-setup-modal"
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
            form={form}
            layout="vertical"
            onFinish={handleAccountSubmit}
            className="company-setup-form-container"
          >
            {/* Company Name */}
            <Form.Item
              name="companyName"
              rules={[{ required: true, message: "Enter your company name" }]}
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
                  message: "Select your industry type",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Industry Type"
                value={formValues.industryType || ""}
                onChange={(value) => handleSelectChange(value, "industryType")}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
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
                    message: "Specify your industry",
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
                  message: "Enter your company address",
                },
              ]}
            >
              {/* <Input
                placeholder="Company Address"
                className="company-setup-input"
                name="address1"
                value={formValues.address1}
                onChange={handleInputChange}
              /> */}
              <GooglePlacesAutocomplete
                apiKey="AIzaSyDGHuVOTCL0gv5XUaaQxzm10BCN2SoeOMw"
                selectProps={{
                  placeholder: "Search Company Address",
                  value: formValues.address1
                    ? { label: formValues.address1, value: formValues.address1 }
                    : null,
                  onChange: handlePlaceSelect,
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      borderRadius: "8px",
                      borderColor: "#ccc",
                      height: "48px",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "8px",
                      overflow: "hidden",
                      color: "#65686A",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      borderRadius: "8px",
                      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                      fontSize: "16px",
                      fontFamily: "Inter",
                      color: "#65686A",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      fontSize: "16px",
                      fontFamily: "Inter",
                      color: "#65686A",
                    }),
                    input: (provided) => ({
                      ...provided,
                      fontSize: "16px",
                      fontFamily: "Inter",
                      color: "#65686A",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      fontSize: "16px",
                      fontFamily: "Inter",
                      color: "#65686A",
                    }),
                  },
                }}
                debounce={300} // Optional to debounce the API requests
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
                  rules={[{ required: true, message: "Enter your city" }]}
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
                  rules={[{ required: true, message: "Select a country" }]}
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
                  rules={[{ required: true, message: "Select a state" }]}
                >
                  <Select
                    className="company-setup-input"
                    placeholder="State"
                    value={formValues.state}
                    onChange={(value) => handleSelectChange(value, "state")}
                    disabled={!formValues.country} // Disable if no country selected
                  >
                    {/* {(countryStateMapping[formValues.country] || []).map(
                      (state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      )
                    )} */}
                    {states.map((state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Zipcode */}
              <Col span={12}>
                <Form.Item
                  name="zipcode"
                  rules={[
                    {
                      required: true,
                      message: "Enter your Zip Code",
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
                              `Enter a valid Zip Code for ${selectedCountry}`
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
                { required: true, message: "Enter the Phone Number" },
                {
                  pattern: /^[0-9]{8,15}$/, // Allows only digits with a length of 10 to 15
                  message: "Enter a valid phone number (10-15 digits)",
                },
              ]}
            >
              <Input
                placeholder="Phone Number"
                className="company-setup-input"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
                addonBefore={phonePrefix}
              />
            </Form.Item>

            {/* Company Registration Number/EIN */}
            <Form.Item name="ein">
              <Input
                placeholder="Company Registration Number/EIN (Optional)"
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
                  message: "Select your business size",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Business Size"
                value={formValues.businessSize || ""}
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
