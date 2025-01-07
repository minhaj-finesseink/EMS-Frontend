/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userUpdate } from "../../redux/User/user.action";
import "./style.css";

const { Option } = Select;

function ContactDetails(props) {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState({
    phone: "",
    extensionNumber: "",
    mobilePhone: "",
    homePhone: "",
    workEmail: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

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
      let data = props.userData.getUserByIdResponse.user;
      const updatedFormValue = {
        phone: data.phone || "",
        extensionNumber: data.extensionNumber,
        mobilePhone: data.phoneNumber || "",
        homePhone: data.homePhone || "",
        workEmail: data.email || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactPhone: data.emergencyContactPhone || "",
        emergencyContactRelation: data.emergencyContactRelation || null,
      };
      setFormValue(updatedFormValue);
      // Set form values
      form.setFieldsValue(updatedFormValue); // Use setFieldsValue instead of setFieldValue
    }
  }, [props.userData.getUserByIdResponse, form]); // Ensure form is included in the dependencies

  const handleSubmit = () => {
    props.userUpdate({
      userId: userInfo._id,
      phone: formValue.phone ? formValue.phone : "",
      extensionNumber: formValue.extensionNumber
        ? formValue.extensionNumber
        : "",
      mobilePhone: formValue.mobilePhone ? formValue.mobilePhone : "",
      homePhone: formValue.homePhone ? formValue.homePhone : "",
      workEmail: formValue.workEmail ? formValue.workEmail : "",
      emergencyContactName: formValue.emergencyContactName
        ? formValue.emergencyContactName
        : "",
      emergencyContactPhone: formValue.emergencyContactPhone
        ? formValue.emergencyContactPhone
        : "",
      emergencyContactRelation: formValue.emergencyContactRelation
        ? formValue.emergencyContactRelation
        : "",
    });
  };

  return (
    <div className="contact_details_container">
      <div style={{ margin: "30px 0" }}>
        <div className="contact_details_title">Enter your Contact details</div>
        <div className="contact_details_desc">
          Complete the form with your correct contact information
        </div>
      </div>
      <div className="contact_details_form">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="contact_details_form_container">
            {/* Work Phone */}
            <Form.Item
              name="phone"
              label={
                <span className="contact_details_input_label">Work Phone</span>
              }
              rules={[{ required: true, message: "Enter your phone number" }]}
            >
              <Input
                className="contact_details_input"
                name="phone"
                value={formValue.phone}
                onChange={handleChange}
                placeholder="Enter phone"
              />
            </Form.Item>

            {/* Extension Number */}
            <Form.Item
              name="extensionNumber"
              label={
                <span className="contact_details_input_label">
                  Extension Number
                </span>
              }
              // rules={[{ required: true, message: "Enter Extension Number" }]}
            >
              <Input
                className="contact_details_input"
                name="extensionNumber"
                value={formValue.extensionNumber}
                onChange={handleChange}
                placeholder="Enter extension number"
              />
            </Form.Item>

            {/* Mobile Phone */}
            <Form.Item
              name="mobilePhone"
              label={
                <span className="contact_details_input_label">
                  Mobile Phone
                </span>
              }
              // rules={[
              //   { required: true, message: "Enter mobile phone" },
              // ]}
            >
              <Input
                className="contact_details_input"
                name="mobilePhone"
                value={formValue.mobilePhone}
                onChange={handleChange}
                placeholder="Enter mobile phone"
              />
            </Form.Item>

            {/* Home number */}
            <Form.Item
              name="homePhone"
              label={
                <span className="contact_details_input_label">Home number</span>
              }
            >
              <Input
                className="contact_details_input"
                name="homePhone"
                value={formValue.homePhone}
                onChange={handleChange}
                placeholder="Enter home number"
              />
            </Form.Item>

            {/* Work Email */}
            <Form.Item
              name="workEmail"
              label={
                <span className="contact_details_input_label">
                  {" "}
                  Work Email Address
                </span>
              }
              rules={[{ required: true, message: "Enter work email" }]}
            >
              <Input
                className="contact_details_input"
                name="workEmail"
                value={formValue.workEmail}
                // onChange={handleChange}
                disabled={true}
                placeholder="Enter work email"
              />
            </Form.Item>
          </div>
          <div className="emergency_contact_container">
            <div style={{ margin: "30px 0" }}>
              <div className="contact_details_title">
                Emergency Contact Information
              </div>
              <div className="contact_details_desc">
                Add your immediate emergency contact
              </div>
            </div>
            <div className="contact_details_form_container">
              {/* Emergency contact Name */}
              <Form.Item
                name="emergencyContactName"
                label={
                  <span className="contact_details_input_label"> Name</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Enter Emergency contact name",
                  },
                ]}
              >
                <Input
                  className="contact_details_input"
                  name="emergencyContactName"
                  value={formValue.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Contact Name"
                />
              </Form.Item>{" "}
              {/* Emergency contact Number */}
              <Form.Item
                name="emergencyContactPhone"
                label={
                  <span className="contact_details_input_label">
                    {" "}
                    Phone Number
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Enter Emergency contact number",
                  },
                ]}
              >
                <Input
                  className="contact_details_input"
                  name="emergencyContactPhone"
                  value={formValue.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Contact Number"
                />
              </Form.Item>{" "}
              {/* Emergency contact Relation */}
              <Form.Item
                name="emergencyContactRelation"
                label={
                  <span className="contact_details_input_label">
                    Relation with the contact
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Select Emergency contact relation",
                  },
                ]}
              >
                <Select
                  className="contact_details_input"
                  name="emergencyContactRelation"
                  value={formValue.emergencyContactRelation}
                  onChange={(value) =>
                    handleChange({
                      target: { name: "emergencyContactRelation", value },
                    })
                  }
                  placeholder="Select Relation"
                >
                  {/* Common relations */}
                  <Select.Option value="parent">Parent</Select.Option>
                  <Select.Option value="sibling">Sibling</Select.Option>
                  <Select.Option value="spouse">Spouse</Select.Option>
                  <Select.Option value="child">Child</Select.Option>
                  <Select.Option value="friend">Friend</Select.Option>
                  <Select.Option value="relative">Relative</Select.Option>
                  <Select.Option value="colleague">Colleague</Select.Option>
                  <Select.Option value="guardian">Guardian</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "40px",
              gap: "20px",
            }}
          >
            <Button
              type="primary"
              style={{
                width: "200px",
                backgroundColor: "#E0E5EB",
                color: "#FFFFFF",
                height: "50px",
                borderRadius: "18px",
              }}
              onClick={() => props.handleTabChange("1")}
            >
              Cancel
            </Button>{" "}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "200px",
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

ContactDetails.propTypes = {
  userData: PropTypes.object,
  userUpdate: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
