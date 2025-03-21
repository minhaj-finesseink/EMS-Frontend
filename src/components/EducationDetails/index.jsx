/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addEducation,
  getEducation,
} from "../../redux/Education/education.action";
import toast from "react-hot-toast";
import "./style.css";

const { Option } = Select;

function EducationDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [educationFields, setEducationFields] = useState([
    // {
    //   id: Date.now(),
    //   college: "",
    //   degree: "",
    //   specialization: "",
    //   gpa: "",
    //   startDate: null,
    //   endDate: null,
    // },
  ]);

  const degrees = [
    "High School Diploma",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Other",
  ];

  // Function to add new education section
  const addEducationField = () => {
    setEducationFields([
      ...educationFields,
      {
        id: Date.now(),
        college: "",
        degree: "",
        specialization: "",
        gpa: "",
        startDate: null,
        endDate: null,
      },
    ]);
  };

  // Function to remove an education section
  const removeEducationField = (id) => {
    setEducationFields(educationFields.filter((field) => field.id !== id));
  };

  // Function to handle input changes
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const updatedFields = educationFields.map((field) =>
      field.id === id ? { ...field, [name]: value } : field
    );
    setEducationFields(updatedFields);
  };

  // Function to handle select changes
  const handleSelectChange = (value, fieldName, id) => {
    const updatedFields = educationFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: value } : field
    );
    setEducationFields(updatedFields);
  };

  // Function to handle date changes
  const handleDateChange = (date, fieldName, id) => {
    const momentDate = moment(date);
    const updatedFields = educationFields.map((field) =>
      field.id === id
        ? { ...field, [fieldName]: momentDate.isValid() ? momentDate : null }
        : field
    );
    setEducationFields(updatedFields);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (educationFields.length === 0) {
      // toast.error("Close");
      setTimeout(() => {
        props.profileComplete(false);
      }, 1000);
    } else {
      const payload = {
        companyId: userInfo.companyId,
        userId: userInfo._id,
        education: educationFields.map((field) => ({
          college: field.college,
          degree: field.degree,
          specialization: field.specialization,
          gpa: field.gpa,
          startDate: field.startDate ? field.startDate.toISOString() : "",
          endDate: field.endDate ? field.endDate.toISOString() : "",
        })),
      };
      // Call the action to add education
      props.addEducation(payload);
    }
  };

  useEffect(() => {
    props.getEducation({
      companyId: userInfo.companyId,
      userId: userInfo._id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.educationData.getEducationResponse) {
      const data = props.educationData.getEducationResponse;
      if (data.success) {
        // Map through the data and set it into educationFields
        const educationData = data.education.map((item) => ({
          id: item._id, // use unique id from the response
          college: item.college,
          degree: item.degree,
          specialization: item.specialization,
          gpa: item.gpa,
          startDate: moment(item.startDate),
          endDate: moment(item.endDate),
        }));

        setEducationFields(educationData);

        // Set the form fields values dynamically
        const formValues = educationData.reduce((values, field) => {
          values[`college_${field.id}`] = field.college;
          values[`degree_${field.id}`] = field.degree;
          values[`major_${field.id}`] = field.specialization;
          values[`gpa_${field.id}`] = field.gpa;
          values[`startDate_${field.id}`] = field.startDate;
          values[`endDate_${field.id}`] = field.endDate;
          return values;
        }, {});
        // Set form values
        form.setFieldsValue(formValues);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.educationData.getEducationResponse]);

  useEffect(() => {
    if (props.educationData.addEducationResponse) {
      let data = props.educationData.addEducationResponse;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          props.profileComplete(false);
        }, 1000);
      }
      if (userInfo) {
        userInfo.isProfileComplete = true; // Update the field
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      props.educationData.addEducationResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.educationData.addEducationResponse]);

  return (
    <div className="address_details_container">
      <div style={{ margin: "30px 0" }}>
        <div className="address_details_title">
          Enter your Education details
        </div>
        <div className="address_details_desc">
          Complete the form with your Education Details
        </div>
      </div>
      <div className="address_details_form">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {educationFields.map((field) => (
            <div key={field.id}>
              <div className="address_details_form_field">
                <Form.Item
                  name={`college_${field.id}`}
                  label={
                    <span className="address_details_input_label">
                      College/Institute
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Enter the college/institute",
                    },
                  ]}
                >
                  <Input
                    className="address_details_input"
                    name="college"
                    value={field.college}
                    onChange={(e) => handleInputChange(e, field.id)}
                    placeholder="Enter college/institute name"
                  />
                </Form.Item>

                <Form.Item
                  name={`degree_${field.id}`}
                  label={
                    <span className="address_details_input_label">Degree</span>
                  }
                  rules={[{ required: true, message: "Select a degree" }]}
                >
                  <Select
                    className="address_details_input"
                    value={field.degree}
                    onChange={(value) =>
                      handleSelectChange(value, "degree", field.id)
                    }
                    placeholder="Select a degree"
                  >
                    {degrees.map((degree, index) => (
                      <Option key={index} value={degree}>
                        {degree}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name={`major_${field.id}`}
                  label={
                    <span className="address_details_input_label">
                      Major/Specialization
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Enter your major or specialization",
                    },
                  ]}
                >
                  <Input
                    className="address_details_input"
                    name="specialization"
                    value={field.specialization}
                    onChange={(e) => handleInputChange(e, field.id)}
                    placeholder="Enter major/specialization"
                  />
                </Form.Item>

                <Form.Item
                  name={`gpa_${field.id}`}
                  label={
                    <span className="address_details_input_label">GPA</span>
                  }
                  rules={[{ required: true, message: "Enter your GPA" }]}
                >
                  <Input
                    className="address_details_input"
                    name="gpa"
                    value={field.gpa}
                    onChange={(e) => handleInputChange(e, field.id)}
                    placeholder="Enter GPA"
                  />
                </Form.Item>

                <Form.Item
                  name={`startDate_${field.id}`}
                  label={
                    <span className="address_details_input_label">
                      Start Date
                    </span>
                  }
                  rules={[{ required: true, message: "Select a start date" }]}
                >
                  <DatePicker
                    className="address_details_input"
                    value={field.startDate}
                    onChange={(date) =>
                      handleDateChange(date, "startDate", field.id)
                    }
                    style={{ width: "100%" }}
                    placeholder="Select start date"
                  />
                </Form.Item>

                <Form.Item
                  name={`endDate_${field.id}`}
                  label={
                    <span className="address_details_input_label">
                      End Date
                    </span>
                  }
                  rules={[{ required: true, message: "Select an end date" }]}
                >
                  <DatePicker
                    className="address_details_input"
                    value={field.endDate}
                    onChange={(date) =>
                      handleDateChange(date, "endDate", field.id)
                    }
                    style={{ width: "100%" }}
                    placeholder="Select end date"
                  />
                </Form.Item>
              </div>

              {/* {educationFields.length > 1 && ( */}
              <div>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeEducationField(field.id)}
                  style={{
                    marginBottom: "50px",
                    width: "150px",
                    height: "36px",
                  }}
                >
                  Delete
                </Button>
              </div>
              {/* )} */}
            </div>
          ))}
          <Button
            className="address_details_input_label"
            type="dashed"
            onClick={addEducationField}
            block
            icon={<PlusOutlined />}
          >
            Add Education
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "80px",
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
              onClick={() => props.handleTabChange("3")}
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
              Finish
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  educationData: state.education,
});

const mapDispatchToProps = (dispatch) => ({
  addEducation: (values) => dispatch(addEducation(values)),
  getEducation: (values) => dispatch(getEducation(values)),
});

EducationDetails.propTypes = {
  addEducation: PropTypes.func,
  getEducation: PropTypes.func,
  educationData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(EducationDetails);
