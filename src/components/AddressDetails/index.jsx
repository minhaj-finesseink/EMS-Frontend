/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userUpdate } from "../../redux/User/user.action";
import countryStateMapping from "../../utils/countryStateMapping";

const { Option } = Select;

function AddressDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [formValue, setFormValue] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  // const handleSelectChange = (value, fieldName) => {
  //   setFormValue({
  //     ...formValue,
  //     [fieldName]: value,
  //   });
  // };

  useEffect(() => {
    if (props.userData.getUserByIdResponse) {
      let data = props.userData.getUserByIdResponse.user.address;
      const updatedFormValue = {
        address: data.address || "",
        street: data.street || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        country: data.country || "",
      };
      setFormValue(updatedFormValue);
      // Set form values
      form.setFieldsValue(updatedFormValue); // Use setFieldsValue instead of setFieldValue
    }
  }, [props.userData.getUserByIdResponse, form]); // Ensure form is included in the dependencies

  const handleSelectChange = (value, field) => {
    setFormValue((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    props.userUpdate({
      userId: userInfo._id,
      address: {
        address: formValue.address ? formValue.address : "",
        street: formValue.street ? formValue.street : "",
        city: formValue.city ? formValue.city : "",
        state: formValue.state ? formValue.state : "",
        zip: formValue.zip ? formValue.zip : "",
        country: formValue.country ? formValue.country : "",
      },
    });
  };

  return (
    <div className="address_details_container">
      <div style={{ margin: "30px 0" }}>
        <div className="address_details_title">Enter your Address details</div>
        <div className="address_details_desc">
          Complete the form with your correct address information
        </div>
      </div>
      <div className="address_details_form">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="address_details_form_field">
            {/* Address 1 */}
            <Form.Item
              name="address1"
              label={
                <span className="address_details_input_label">Address 1</span>
              }
            >
              <Input
                className="address_details_input"
                name="address1"
                value={formValue.address1}
                onChange={handleChange}
                placeholder="Enter Address 1"
              />
            </Form.Item>
            {/* Address 2 */}
            <Form.Item
              name="address2"
              label={
                <span className="address_details_input_label">Address 2</span>
              }
            >
              <Input
                className="address_details_input"
                name="address2"
                value={formValue.address2}
                onChange={handleChange}
                placeholder="Enter Address 2"
              />
            </Form.Item>

            {/* Country */}
            <Form.Item
              name="country"
              label={
                <span className="address_details_input_label">Country</span>
              }
              rules={[{ required: true, message: "Please select a country!" }]}
            >
              <Select
                className="address_details_input"
                placeholder="Country"
                value={formValue.country}
                onChange={(value) => handleSelectChange(value, "country")}
              >
                {Object.keys(countryStateMapping).map((country) => (
                  <Option key={country} value={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* State */}
            <Form.Item
              name="state"
              label={<span className="address_details_input_label">State</span>}
              rules={[{ required: true, message: "Please select a state!" }]}
            >
              <Select
                className="address_details_input"
                placeholder="State"
                value={formValue.state}
                onChange={(value) => handleSelectChange(value, "state")}
                disabled={!formValue.country} // Disable if no country selected
              >
                {(countryStateMapping[formValue.country] || []).map((state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* City */}
            <Form.Item
              name="city"
              label={<span className="address_details_input_label">City</span>}
            >
              <Input
                className="address_details_input"
                name="city"
                value={formValue.city}
                onChange={handleChange}
                placeholder="Enter City"
              />
            </Form.Item>
            {/* Zip */}
            <Form.Item
              name="zip"
              label={<span className="address_details_input_label">Zip</span>}
            >
              <Input
                className="address_details_input"
                name="zip"
                value={formValue.zip}
                onChange={handleChange}
                placeholder="Enter ZIP Code"
              />
            </Form.Item>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "100px",
              gap: "20px",
            }}
          >
            <Button
              type="primary"
              style={{
                width: "292px",
                backgroundColor: "#E0E5EB",
                color: "#FFFFFF",
                height: "50px",
                borderRadius: "18px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "292px",
                backgroundColor: "#007DC5",
                color: "#FFFFFF",
                height: "50px",
                borderRadius: "18px",
              }}
            >
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  userUpdate: (values) => dispatch(userUpdate(values)),
});

AddressDetails.propTypes = {
  userData: PropTypes.object,
  userUpdate: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressDetails);
