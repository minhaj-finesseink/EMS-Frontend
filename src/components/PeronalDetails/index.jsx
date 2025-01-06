/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Modal,
  Upload,
  Row,
  Col,
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { getUserById, userUpdate } from "../../redux/User/user.action";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { addVisa, getVisa } from "../../redux/Visa/visa.action";
import "./style.css";

const { Option } = Select;

function PersonalDetails(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [formValue, setFormValue] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeStartDate: null,
    dob: null,
    sex: "",
    employeeId: "",
    ssn: "",
    phone: "",
    maritalStatus: "",
    taxNumber: "",
    nin: "",
    size: "",
    allergies: "",
    dietary: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const [visaForm, setVisaForm] = useState({
    visaType: "",
    issuingCountry: "",
    issueDate: null,
    expiryDate: null,
    visaStatus: "",
    notes: "",
  });

  const columns = [
    // { title: "Date", dataIndex: "date", key: "date" },
    { title: "Visa", dataIndex: "visaType", key: "visaType" },
    {
      title: "Issuing Country",
      dataIndex: "issuingCountry",
      key: "issuingCountry",
    },
    { title: "Issued", dataIndex: "issueDate", key: "issueDate" },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Status", dataIndex: "visaStatus", key: "visaStatus" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
  ];

  useEffect(() => {
    props.getUserById(userInfo._id);
    props.getVisa({ companyId: userInfo.companyId, userId: userInfo._id });
  }, []);

  useEffect(() => {
    if (props.userData.getUserByIdResponse) {
      let data = props.userData.getUserByIdResponse.user;
      const updatedFormValue = {
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        employeeStartDate: data.employmentStartDate
          ? moment(data.employmentStartDate)
          : null,
        dob: data.dob ? moment(data.dob) : null,
        sex: data.gender || null,
        employeeId: data.employeeIdNumber || "",
        phone: data.phoneNumber || "",
        ssn: data.ssn || "",
        maritalStatus: data.maritalStatus || null,
        taxNumber: data.taxNumber || "",
        nin: data.nin || "",
        size: data.size || "",
        allergies: data.allergies || "",
        dietary: data.dietary || "",
      };
      setFormValue(updatedFormValue);
      form.setFieldsValue(updatedFormValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.getUserByIdResponse]);

  const handleChange = (e, formType = "formValue") => {
    const { name, value } = e.target;
    // console.log("name", name, "value", value);

    if (formType === "visaForm") {
      setVisaForm({
        ...visaForm,
        [name]: value,
      });
    } else {
      setFormValue({
        ...formValue,
        [name]: value,
      });
    }
  };

  const handleDateChange = (
    date,
    dateString,
    fieldName,
    formType = "formValue"
  ) => {
    if (formType === "visaForm") {
      setVisaForm({
        ...visaForm,
        [fieldName]: dateString,
      });
    } else {
      setFormValue({
        ...formValue,
        [fieldName]: dateString,
      });
    }
  };

  const handleSelectChange = (value, fieldName, formType = "formValue") => {
    if (formType === "visaForm") {
      setVisaForm({
        ...visaForm,
        [fieldName]: value,
      });
    } else {
      setFormValue({
        ...formValue,
        [fieldName]: value,
      });
    }
  };

  const handleSubmit = () => {
    props.userUpdate({
      userId: userInfo._id,
      firstName: formValue.firstName ? formValue.firstName : "",
      middleName: formValue.middleName ? formValue.middleName : "",
      lastName: formValue.lastName ? formValue.lastName : "",
      employeeStartDate: formValue.employeeStartDate
        ? formValue.employeeStartDate
        : null,
      dob: formValue.dob ? formValue.dob : null,
      gender: formValue.sex ? formValue.sex : "",
      employeeId: formValue.employeeId ? formValue.employeeId : "",
      ssn: formValue.ssn ? formValue.ssn : "",
      phone: formValue.phone ? formValue.phone : "",
      maritalStatus: formValue.maritalStatus ? formValue.maritalStatus : "",
      taxNumber: formValue.taxNumber ? formValue.taxNumber : "",
      nin: formValue.nin ? formValue.nin : "",
      size: formValue.size ? formValue.size : "",
      allergies: formValue.allergies ? formValue.allergies : "",
      dietary: formValue.dietary ? formValue.dietary : "",
    });
    // props.handleTabChange("2");
  };

  // Setting all tab changes and success message in here.
  useEffect(() => {
    if (props.userData.userUpdateResponse) {
      let data = props.userData.userUpdateResponse;
      if (data.success) {
        if (props.tabKey === "1") {
          toast.success("Personal Details Updated Successfully");
          props.handleTabChange("2");
          props.enableNextTab("2");
        } else if (props.tabKey === "2") {
          toast.success("Contact Details Updated Successfully");
          props.handleTabChange("3");
          props.enableNextTab("3");
        } else if (props.tabKey === "3") {
          toast.success("Address Details Updated Successfully");
          props.handleTabChange("4");
          props.enableNextTab("4");
        } else if (props.tabKey === "4") {
          toast.success("Education Details Updated Successfully");
          // props.handleTabChange("5");
        }
        // else if (props.tabKey === "5") {
        //   toast.success("Visa Details Updated Successfully");
        //   // props.handleTabChange("5");
        // }
        props.userData.userUpdateResponse = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.userUpdateResponse]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleVisaSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Handle form submission
        props.addVisa({
          userId: userInfo._id,
          companyId: userInfo.companyId,
          visa: [
            {
              visaType: visaForm.visaType,
              issuingCountry: visaForm.issuingCountry,
              issueDate: visaForm.issueDate,
              expiryDate: visaForm.expiryDate,
              visaStatus: visaForm.visaStatus,
              notes: visaForm.notes,
            },
          ],
        });
      })
      .catch((errorInfo) => {
        // Handle validation errors
        console.log("Validation Failed:", errorInfo);
      });
  };

  useEffect(() => {
    if (props.visaData.addVisaResponse) {
      let data = props.visaData.addVisaResponse;
      // console.log("visa data - ", data);
      if (data.success) {
        toast.success(data.message);
        // Close the modal
        setTimeout(() => {
          setIsModalVisible(false);
          setVisaForm({
            visaType: "",
            issuingCountry: "",
            issueDate: null,
            expiryDate: null,
            visaStatus: "",
            notes: "",
          });
          form.setFieldsValue({
            visaType: "",
            issuingCountry: "",
            issueDate: null,
            expiryDate: null,
            visaStatus: "",
            notes: "",
          });
        }, 2000);
        props.getVisa({ companyId: userInfo.companyId, userId: userInfo._id });
      }
      props.visaData.addVisaResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visaData.addVisaResponse]);

  useEffect(() => {
    if (props.visaData.getVisaResponse) {
      let data = props.visaData.getVisaResponse;
      // console.log("visa data -", data);
      if (data.success) {
        let visa = data.visa;
        const formattedData = visa.map((visa, index) => ({
          key: visa._id, // Using _id as the unique key for each row
          // date: `${visa.issueDate} - ${visa.expiryDate}`, // Format the date column as a range
          visaType: visa.visaType,
          issuingCountry: visa.issuingCountry,
          issueDate: visa.issueDate,
          expiryDate: visa.expiryDate,
          visaStatus: visa.visaStatus,
          notes: visa.notes,
        }));
        setData(formattedData);
      }
    }
  }, [props.visaData.getVisaResponse]);

  return (
    <div className="personal_details_container">
      <div style={{ margin: "30px 0" }}>
        <div className="personal_details_title">
          Enter your personal details
        </div>
        <div className="personal_details_desc">
          Complete the form with your correct information
        </div>
      </div>
      <div className="personal_details_form">
        {" "}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="personal_details_form_field">
            <Form.Item
              name="firstName"
              label={
                <span className="patient_details_input_label">First Name</span>
              }
              rules={[{ required: true, message: "Enter first name" }]}
            >
              <Input
                className="patient_details_input"
                name="firstName"
                value={formValue.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </Form.Item>

            <Form.Item
              name="middleName"
              label={
                <span className="patient_details_input_label">Middle Name</span>
              }
            >
              <Input
                className="patient_details_input"
                name="middleName"
                value={formValue.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={
                <span className="patient_details_input_label">Last Name</span>
              }
              rules={[{ required: true, message: "Enter last name" }]}
            >
              <Input
                className="patient_details_input"
                name="lastName"
                value={formValue.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </Form.Item>

            <Form.Item
              name="employeeStartDate"
              label={
                <span className="patient_details_input_label">
                  Employment Start Date
                </span>
              }
              rules={[{ required: true, message: "Select start date" }]}
            >
              <DatePicker
                className="patient_details_input"
                name="employeeStartDate"
                value={formValue.employeeStartDate}
                // onChange={(date) => handleDateChange(date, "employeeStartDate")}
                style={{ width: "100%" }}
                placeholder="Select start date"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="dob"
              label={
                <span className="patient_details_input_label">
                  DOB (Optional)
                </span>
              }
            >
              <DatePicker
                className="patient_details_input"
                name="dob"
                value={formValue.dob}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "dob")
                }
                style={{ width: "100%" }}
                placeholder="Select date of birth"
              />
            </Form.Item>

            <Form.Item
              name="sex"
              label={
                <span className="patient_details_input_label">Gender</span>
              }
              rules={[{ required: true, message: "Select gender" }]}
            >
              <Select
                className="patient_details_input"
                value={formValue.sex}
                onChange={(value) => handleSelectChange(value, "sex")}
                placeholder="Select Gender"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              className="patient_details_input"
              name="employeeId"
              label={
                <span className="patient_details_input_label">
                  Employee ID Number
                </span>
              }
              rules={[{ required: true, message: "Enter employee ID" }]}
            >
              <Input
                className="patient_details_input"
                name="employeeId"
                value={formValue.employeeId}
                // onChange={handleChange}
                placeholder="Enter employee ID"
                disabled
              />
            </Form.Item>

            {/* <Form.Item
              name="phone"
              label={
                <span className="patient_details_input_label">
                  Phone (Optional)
                </span>
              }
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <Input
                className="patient_details_input"
                name="phone"
                value={formValue.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Item> */}

            <Form.Item
              name="maritalStatus"
              label={
                <span className="patient_details_input_label">
                  Marital Status
                </span>
              }
              rules={[{ required: true, message: "Enter marital status" }]}
            >
              <Select
                className="patient_details_input"
                value={formValue.maritalStatus}
                onChange={(value) =>
                  handleChange({ target: { name: "maritalStatus", value } })
                }
                placeholder="Select marital status"
              >
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
                {/* <Option value="widowed">Widowed</Option> */}
              </Select>
            </Form.Item>
          </div>
          <div className="visa_details">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "30px 0",
              }}
            >
              <div>
                <div className="personal_details_title">Visa Details</div>
                <div className="personal_details_desc">
                  Kindly provide your visa particulars if any
                </div>
              </div>

              <div className="visa_deatils_header">
                <Input
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                  style={{
                    width: "200px",
                    height: "34px",
                    borderRadius: "28px",
                  }}
                />
                <Button className="add_policy_button" onClick={showModal}>
                  Add Entry
                </Button>
              </div>
            </div>
            <div className="visa_details_table">
              <Table
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 5 }}
                style={{
                  border: "1px solid #e5e9ee", // Outer border color
                  borderRadius: "14px", // Rounded corners
                  overflow: "hidden",
                }}
                bordered={false} // Avoid double borders from Ant Design default styles
                scroll={{ x: "max-content" }}
              />
            </div>
            {/* Modal for adding visa details */}
            <Modal
              title="Add Visa Details"
              visible={isModalVisible}
              // onOk={handleModalSubmit}
              footer={null}
              onCancel={handleCancel}
              okText="Submit"
              cancelText="Cancel"
              className="add_visa_modal"
              width={600}
            >
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="visaType"
                      label="Visa Type"
                      rules={[
                        { required: true, message: "Please select visa type" },
                      ]}
                    >
                      <Select
                        placeholder="Select visa"
                        className="add_visa_modal_input"
                        value={visaForm.visaType}
                        onChange={(value) =>
                          handleSelectChange(value, "visaType", "visaForm")
                        }
                      >
                        <Option value="tourist">Tourist</Option>
                        <Option value="work">Work</Option>
                        <Option value="student">Student</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="issuingCountry"
                      label="Issuing Country"
                      rules={[
                        {
                          required: true,
                          message: "Please select issuing country",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select country"
                        className="add_visa_modal_input"
                        value={visaForm.issuingCountry}
                        onChange={(value) =>
                          handleSelectChange(
                            value,
                            "issuingCountry",
                            "visaForm"
                          )
                        }
                      >
                        <Option value="usa">USA</Option>
                        <Option value="uk">UK</Option>
                        <Option value="canada">Canada</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="issueDate"
                      label="Visa Issue Date"
                      rules={[
                        { required: true, message: "Please select issue date" },
                      ]}
                    >
                      <DatePicker
                        className="add_visa_modal_input"
                        style={{ width: "100%", borderRadius: "18px" }}
                        value={visaForm.issueDate}
                        onChange={(date, dateString) =>
                          handleDateChange(
                            date,
                            dateString,
                            "issueDate",
                            "visaForm"
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="expiryDate"
                      label="Visa Expiry Date"
                      rules={[
                        {
                          required: true,
                          message: "Please select expiry date",
                        },
                      ]}
                    >
                      <DatePicker
                        className="add_visa_modal_input"
                        style={{ width: "100%", borderRadius: "18px" }}
                        value={visaForm.expiryDate}
                        onChange={(date, dateString) =>
                          handleDateChange(
                            date,
                            dateString,
                            "expiryDate",
                            "visaForm"
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="visaStatus"
                      label="Visa Status"
                      rules={[
                        {
                          required: true,
                          message: "Please select visa status",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select status"
                        className="add_visa_modal_input"
                        value={visaForm.visaStatus}
                        onChange={(value) =>
                          handleSelectChange(value, "visaStatus", "visaForm")
                        }
                      >
                        <Option value="active">Active</Option>
                        <Option value="expired">Expired</Option>
                        <Option value="pending">Pending</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="notes"
                      label="Notes"
                      rules={[{ required: false }]}
                    >
                      <Input.TextArea
                        name="notes"
                        style={{ borderRadius: "18px" }}
                        placeholder="Enter notes"
                        value={visaForm.notes}
                        onChange={(e) => handleChange(e, "visaForm")}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="documents"
                      label="Add Visa Documents"
                      className="add_visa_modal_input"
                    >
                      <Upload>
                        <Button
                          className="add_visa_file_upload_button"
                          icon={<UploadOutlined />}
                        >
                          Upload Documents
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={24}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "40px",
                    }}
                  >
                    <Button
                      type="primary"
                      className="add_visa_button"
                      onClick={handleVisaSubmit}
                    >
                      Done
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Modal>
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
  userUpdateData: state.addEmployee,
  visaData: state.visa,
});

const mapDispatchToProps = (dispatch) => ({
  getUserById: (values) => dispatch(getUserById(values)),
  userUpdate: (values) => dispatch(userUpdate(values)),
  addVisa: (values) => dispatch(addVisa(values)),
  getVisa: (values) => dispatch(getVisa(values)),
});

PersonalDetails.propTypes = {
  getUserById: PropTypes.func,
  userUpdate: PropTypes.func,
  addVisa: PropTypes.func,
  getVisa: PropTypes.func,
  userData: PropTypes.object,
  userUpdateData: PropTypes.object,
  visaData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails);
