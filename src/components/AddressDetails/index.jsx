/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userUpdate } from "../../redux/Add-employee/employee.action";

function AddressDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [formValue, setFormValue] = useState({
    address: "",
    street: "",
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
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(2, 1fr)",
          border: "1px solid #d9d9d9",
          borderRadius: "5px",
          padding: "20px",
        }}
      >
        <Form.Item name="address" label="Address">
          <Input
            name="address"
            value={formValue.address}
            onChange={handleChange}
            placeholder="Enter Address"
          />
        </Form.Item>
        <Form.Item name="street" label="Street">
          <Input
            name="street"
            value={formValue.street}
            onChange={handleChange}
            placeholder="Enter Street"
          />
        </Form.Item>
        <Form.Item name="city" label="City">
          <Input
            name="city"
            value={formValue.city}
            onChange={handleChange}
            placeholder="Enter City"
          />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Input
            name="state"
            value={formValue.state}
            onChange={handleChange}
            placeholder="Enter State"
          />
        </Form.Item>
        <Form.Item name="zip" label="ZIP Code">
          <Input
            name="zip"
            value={formValue.zip}
            onChange={handleChange}
            placeholder="Enter ZIP Code"
          />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input
            name="country"
            value={formValue.country}
            onChange={handleChange}
            placeholder="Enter Country"
          />
        </Form.Item>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button type="primary" htmlType="submit" style={{ width: "100px" }}>
          Continue
        </Button>
      </div>
    </Form>
  );
}

const mapStateToProps = (state) => ({
  userData: state.addEmployee,
});

const mapDispatchToProps = (dispatch) => ({
  userUpdate: (values) => dispatch(userUpdate(values)),
});

AddressDetails.propTypes = {
  userData: PropTypes.object,
  userUpdate: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressDetails);
