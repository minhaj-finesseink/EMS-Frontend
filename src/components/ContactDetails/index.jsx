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
    workPhone: "",
    extensionNumber: "",
    mobilePhone: "",
    homePhone: "",
    workEmail: "",
    homeEmail: "",
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

  const handleSelectChange = (value, fieldName) => {
    setFormValue({
      ...formValue,
      [fieldName]: value,
    });
  };

  useEffect(() => {
    if (props.userData.getUserByIdResponse) {
      let data = props.userData.getUserByIdResponse.user;
      const updatedFormValue = {
        workPhone: data.workPhone || "",
        mobilePhone: data.phoneNumber || "",
        homePhone: data.homePhone || "",
        workEmail: data.email || "",
        homeEmail: data.homeEmail || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactPhone: data.emergencyContactPhone || "",
        emergencyContactRelation: data.emergencyContactRelation || "",
      };
      setFormValue(updatedFormValue);
      // Set form values
      form.setFieldsValue(updatedFormValue); // Use setFieldsValue instead of setFieldValue
    }
  }, [props.userData.getUserByIdResponse, form]); // Ensure form is included in the dependencies

  const handleSubmit = () => {
    props.userUpdate({
      userId: userInfo._id,
      workPhone: formValue.workPhone ? formValue.workPhone : "",
      mobilePhone: formValue.mobilePhone ? formValue.mobilePhone : "",
      homePhone: formValue.homePhone ? formValue.homePhone : "",
      workEmail: formValue.workEmail ? formValue.workEmail : "",
      homeEmail: formValue.homeEmail ? formValue.homeEmail : "",
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
              name="workPhone"
              label={
                <span className="contact_details_input_label">Work Phone</span>
              }
              rules={[{ required: true, message: "Please enter work phone!" }]}
            >
              <Input
                className="contact_details_input"
                name="workPhone"
                value={formValue.workPhone}
                onChange={handleChange}
                placeholder="Enter work phone"
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
              rules={[
                { required: true, message: "Please enter Extension Number!" },
              ]}
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
              rules={[
                { required: true, message: "Please enter mobile phone!" },
              ]}
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
              rules={[{ required: true, message: "Please enter work email!" }]}
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
                    message: "Please enter Emergency contact name!",
                  },
                ]}
              >
                <Input
                  className="contact_details_input"
                  name="emergencyContactName"
                  value={formValue.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Emergency Contact Name"
                />
              </Form.Item>{" "}
              {/* Emergency contact Number */}
              <Form.Item
                name="emergencyContactNumber"
                label={
                  <span className="contact_details_input_label">
                    {" "}
                    Phone Number
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter Emergency contact number!",
                  },
                ]}
              >
                <Input
                  className="contact_details_input"
                  name="emergencyContactNumber"
                  value={formValue.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Emergency Contact Number"
                />
              </Form.Item>{" "}
              {/* Emergency contact Relation */}
              <Form.Item
                name="emergencyContactRelation"
                label={
                  <span className="contact_details_input_label">
                    {" "}
                    Relation with the contact
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter Emergency contact relation!",
                  },
                ]}
              >
                <Input
                  className="contact_details_input"
                  name="emergencyContactRelation"
                  value={formValue.emergencyContactRelation}
                  onChange={handleChange}
                  placeholder="Emergency Contact Relation"
                />
              </Form.Item>{" "}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
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

ContactDetails.propTypes = {
  userData: PropTypes.object,
  userUpdate: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
