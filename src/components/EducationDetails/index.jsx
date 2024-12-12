/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./style.css";
import { Form, Input, DatePicker, Select, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addEducation,
  getEducation,
} from "../../redux/Education/education.action";

const { Option } = Select;

function EducationDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [educationFields, setEducationFields] = useState([
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
    const payload = {
      accountId: userInfo.accountId,
      userId: userInfo._id,
      education: educationFields.map((field) => ({
        accountId: userInfo.accountId,
        userId: userInfo._id,
        college: field.college,
        degree: field.degree,
        specialization: field.specialization,
        gpa: field.gpa,
        startDate: field.startDate ? field.startDate.toISOString() : "",
        endDate: field.endDate ? field.endDate.toISOString() : "",
      })),
    };
    props.addEducation(payload);
  };

  useEffect(() => {
    props.getEducation({
      accountId: userInfo.accountId,
      userId: userInfo._id,
    });
  }, []);

  useEffect(() => {
    if (props.educationData.getEducationResponse) {
      const data = props.educationData.getEducationResponse.education;

      // Map through the data and set it into educationFields
      const educationData = data.map((item) => ({
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
  }, [props.educationData.getEducationResponse]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {educationFields.map((field) => (
        <div
          key={field.id}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <Form.Item
              name={`college_${field.id}`}
              label="College/Institute"
              rules={[
                {
                  required: true,
                  message: "Please enter the college/institute!",
                },
              ]}
            >
              <Input
                name="college"
                value={field.college}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Enter college/institute name"
              />
            </Form.Item>

            <Form.Item
              name={`degree_${field.id}`}
              label="Degree"
              rules={[{ required: true, message: "Please select a degree!" }]}
            >
              <Select
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
              label="Major/Specialization"
              rules={[
                {
                  required: true,
                  message: "Please enter your major or specialization!",
                },
              ]}
            >
              <Input
                name="specialization"
                value={field.specialization}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Enter major/specialization"
              />
            </Form.Item>

            <Form.Item
              name={`gpa_${field.id}`}
              label="GPA"
              rules={[{ required: true, message: "Please enter your GPA!" }]}
            >
              <Input
                name="gpa"
                value={field.gpa}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Enter GPA"
              />
            </Form.Item>

            <Form.Item
              name={`startDate_${field.id}`}
              label="Start Date"
              rules={[
                { required: true, message: "Please select a start date!" },
              ]}
            >
              <DatePicker
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
              label="End Date"
              rules={[
                { required: true, message: "Please select an end date!" },
              ]}
            >
              <DatePicker
                value={field.endDate}
                onChange={(date) => handleDateChange(date, "endDate", field.id)}
                style={{ width: "100%" }}
                placeholder="Select end date"
              />
            </Form.Item>
          </div>

          {educationFields.length > 1 && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeEducationField(field.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
      <Button
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
