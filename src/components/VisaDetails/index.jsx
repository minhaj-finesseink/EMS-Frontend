/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { addVisa, getVisa } from "../../redux/Visa/visa.action";

const { Option } = Select;

const visaTypes = [
  "Tourist Visa",
  "Work Visa",
  "Student Visa",
  "Permanent Residency",
  "Business Visa",
  "Dependent Visa",
  "Diplomatic Visa",
  "Other",
];

function VisaDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [visaFields, setVisaFields] = useState([
    {
      id: Date.now(),
      date: null,
      visaType: "",
      issuingCountry: "",
      issuedDate: "",
      expiryDate: "",
      status: "Active",
      note: "",
    },
  ]);

  // Function to add new visa section
  const addVisaField = () => {
    setVisaFields([
      ...visaFields,
      {
        id: Date.now(),
        date: null,
        visaType: "",
        issuingCountry: "",
        issuedDate: "",
        expiryDate: "",
        status: "Active",
        note: "",
      },
    ]);
  };

  // Function to remove a visa section
  const removeVisaField = (id) => {
    setVisaFields(visaFields.filter((field) => field.id !== id));
  };

  // Function to handle input changes
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const updatedFields = visaFields.map((field) =>
      field.id === id ? { ...field, [name]: value } : field
    );
    setVisaFields(updatedFields);
  };

  // Function to handle select changes
  const handleSelectChange = (value, fieldName, id) => {
    const updatedFields = visaFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: value } : field
    );
    setVisaFields(updatedFields);
  };

  // Function to handle date changes
  const handleDateChange = (date, fieldName, id) => {
    const momentDate = moment(date);
    const updatedFields = visaFields.map((field) =>
      field.id === id
        ? { ...field, [fieldName]: momentDate.isValid() ? momentDate : null }
        : field
    );
    setVisaFields(updatedFields);
  };

  const handleSubmit = () => {
    const payload = {
      accountId: userInfo.accountId,
      userId: userInfo._id,
      visa: visaFields.map((field) => ({
        date: field.date ? field.date.toISOString() : "",
        visaType: field.visaType,
        issuingCountry: field.issuingCountry,
        issuedDate: field.issuedDate ? field.issuedDate.toISOString() : "",
        expiryDate: field.expiryDate ? field.expiryDate.toISOString() : "",
        status: field.status,
        note: field.note,
      })),
    };
    props.addVisa(payload);
  };

  useEffect(() => {
    props.getVisa({
      accountId: userInfo.accountId,
      userId: userInfo._id,
    });
  }, []);

  useEffect(() => {
    if (props.visaData.getVisaResponse) {
      const data = props.visaData.getVisaResponse.visa;

      // Map through the data and set it into educationFields
      const visaData = data.map((item) => ({
        id: item._id, // use unique id from the response
        date: moment(item.date),
        visaType: item.visaType,
        issuingCountry: item.issuingCountry,
        issuedDate: moment(item.issuedDate),
        expiryDate: moment(item.expiryDate),
        status: item.status,
        note: item.note,
      }));

      setVisaFields(visaData);

      // Set the form fields values dynamically
      const formValues = visaData.reduce((values, field) => {
        values[`date_${field.id}`] = field.date;
        values[`visaType_${field.id}`] = field.visaType;
        values[`issuingCountry_${field.id}`] = field.issuingCountry;
        values[`issuedDate_${field.id}`] = field.issuedDate;
        values[`expiryDate_${field.id}`] = field.expiryDate;
        values[`status_${field.id}`] = field.status;
        values[`note_${field.id}`] = field.note;
        return values;
      }, {});

      // Set form values
      form.setFieldsValue(formValues);
    }
  }, [props.visaData.getVisaResponse]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {visaFields.map((field) => (
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
              name={`date_${field.id}`}
              label="Date"
              rules={[
                {
                  required: true,
                  message: "Please select a date!",
                },
              ]}
            >
              <DatePicker
                value={field.date}
                onChange={(date) => handleDateChange(date, "date", field.id)}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name={`visaType_${field.id}`}
              label="Visa Type"
              rules={[
                {
                  required: true,
                  message: "Please select a visa type!",
                },
              ]}
            >
              <Select
                value={field.visaType}
                onChange={(value) =>
                  handleSelectChange(value, "visaType", field.id)
                }
                placeholder="Select Visa Type"
              >
                {visaTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name={`issuingCountry_${field.id}`}
              label="Issuing Country"
              rules={[
                {
                  required: true,
                  message: "Please enter issuing country!",
                },
              ]}
            >
              <Input
                name="issuingCountry"
                value={field.issuingCountry}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Enter Issuing Country"
              />
            </Form.Item>

            <Form.Item
              name={`issuedDate_${field.id}`}
              label="Issued Date"
              rules={[
                {
                  required: true,
                  message: "Please select issued date!",
                },
              ]}
            >
              <DatePicker
                value={field.issuedDate}
                onChange={(date) =>
                  handleDateChange(date, "issuedDate", field.id)
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name={`expiryDate_${field.id}`}
              label="Expiration Date"
              rules={[
                {
                  required: true,
                  message: "Please select expiration date!",
                },
              ]}
            >
              <DatePicker
                value={field.expiryDate}
                onChange={(date) =>
                  handleDateChange(date, "expiryDate", field.id)
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name={`note_${field.id}`}
              label="Note"
              rules={[
                {
                  required: true,
                  message: "Please enter a note!",
                },
              ]}
            >
              <Input.TextArea
                name="note"
                value={field.note}
                onChange={(e) => handleInputChange(e, field.id)}
                placeholder="Enter note"
                rows={3}
              />
            </Form.Item>
          </div>
          {visaFields.length > 1 && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeVisaField(field.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addVisaField}
        block
        icon={<PlusOutlined />}
      >
        Add Visa
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
  visaData: state.visa,
});

const mapDispatchToProps = (dispatch) => ({
  getVisa: (values) => dispatch(getVisa(values)),
  addVisa: (values) => dispatch(addVisa(values)),
});

VisaDetails.propTypes = {
  visaData: PropTypes.object,
  getVisa: PropTypes.func,
  addVisa: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(VisaDetails);
