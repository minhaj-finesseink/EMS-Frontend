/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserById,
  userUpdate,
} from "../../redux/Add-employee/employee.action";

const { Option } = Select;

function ContactDetails(props) {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState({
    workPhone: "",
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
      form.setFieldsValue(updatedFormValue);  // Use setFieldsValue instead of setFieldValue
    }
  }, [props.userData.getUserByIdResponse, form]);  // Ensure form is included in the dependencies
  

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
        {/* Work Phone */}
        <Form.Item
          name="workPhone"
          label="Work Phone"
          rules={[{ required: true, message: "Please enter work phone!" }]}
        >
          <Input
            name="workPhone"
            value={formValue.workPhone}
            onChange={handleChange}
            placeholder="Enter work phone"
          />
        </Form.Item>

        {/* Mobile Phone */}
        <Form.Item
          name="mobilePhone"
          label="Mobile Phone"
          rules={[{ required: true, message: "Please enter mobile phone!" }]}
        >
          <Input
            name="mobilePhone"
            value={formValue.mobilePhone}
            onChange={handleChange}
            placeholder="Enter mobile phone"
          />
        </Form.Item>

        {/* Home Phone */}
        <Form.Item name="homePhone" label="Home Phone">
          <Input
            name="homePhone"
            value={formValue.homePhone}
            onChange={handleChange}
            placeholder="Enter home phone"
          />
        </Form.Item>

        {/* Work Email */}
        <Form.Item
          name="workEmail"
          label="Work Email"
          rules={[{ required: true, message: "Please enter work email!" }]}
        >
          <Input
            name="workEmail"
            value={formValue.workEmail}
            // onChange={handleChange}
            disabled={true}  
            placeholder="Enter work email"
          />
        </Form.Item>

        {/* Home Email */}
        <Form.Item name="homeEmail" label="Home Email">
          <Input
            name="homeEmail"
            value={formValue.homeEmail}
            onChange={handleChange}
            placeholder="Enter home email"
          />
        </Form.Item>

        {/* Emergency Contact Name */}
        <Form.Item
          name="emergencyContactName"
          label="Emergency Contact Name"
          rules={[
            {
              required: true,
              message: "Please enter emergency contact Name!",
            },
          ]}
        >
          <Input
            name="emergencyContactName"
            value={formValue.emergencyContactName}
            onChange={handleChange}
            placeholder="Enter emergency contact name"
          />
        </Form.Item>

        {/* Emergency Contact Phone */}
        <Form.Item
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
          rules={[
            {
              required: true,
              message: "Please enter emergency contact Phone number!",
            },
          ]}
        >
          <Input
            name="emergencyContactPhone"
            value={formValue.emergencyContactPhone}
            onChange={handleChange}
            placeholder="Enter emergency contact phone"
          />
        </Form.Item>

        {/* Emergency Contact Relation */}
        <Form.Item
          name="emergencyContactRelation"
          label="Emergency Contact Relation"
          rules={[
            {
              required: true,
              message: "Please select emergency contact relation!",
            },
          ]}
        >
          <Select
            value={formValue.emergencyContactRelation}
            onChange={(value) =>
              handleSelectChange(value, "emergencyContactRelation")
            }
            placeholder="Select relation"
          >
            <Option value="parent">Parent</Option>
            <Option value="spouse">Spouse</Option>
            <Option value="sibling">Sibling</Option>
            <Option value="friend">Friend</Option>
            <Option value="other">Other</Option>
          </Select>
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

ContactDetails.propTypes = {
  userData: PropTypes.object,
  userUpdate: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
