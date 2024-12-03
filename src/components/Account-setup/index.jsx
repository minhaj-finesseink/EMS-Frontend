/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Steps,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Row,
  Col,
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { industryTypes } from "../../utils/industryType";
import { addEmployee } from "../../redux/Account-setup/Add-employee/employee.action";
import { addDepartment } from "../../redux/Account-setup/Add-department/department.action";
import { addcompany } from "../../redux/Account-setup/Add-company/company.action";
import "./style.css";

const { Step } = Steps;
const { Option } = Select;

const App = (props) => {
  const [current, setCurrent] = useState(0); // Track the current step
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState(""); // Content to display in the modal
  const [completedSteps, setCompletedSteps] = useState([false, false, false]); // Track completion of steps (Step 1, 2, 3)

  const [accountId, setAccountId] = useState(null);
  const [formValues, setFormValues] = useState({
    companyName: "",
    industryType: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
    ein: "",
    businessSize: "",
  });

  const [isOtherSelected, setIsOtherSelected] = useState(false); // To track if 'Other' is selected
  const [departmentName, setDepartmentName] = useState(""); // Controlled state for department name
  const [departmentCode, setDepartmentCode] = useState(""); // Controlled state for department code

  const [empFormValues, setEmpFormValues] = useState({
    firstName: "",
    lastName: "",
    department: "",
    employeeType: "",
    email: "",
    phoneNumber: "",
  });

  const empHandleChange = (e) => {
    const { name, value } = e.target;
    setEmpFormValues({
      ...empFormValues,
      [name]: value,
    });
  };

  const empHandleSelectChange = (value, fieldName) => {
    setEmpFormValues({
      ...empFormValues,
      [fieldName]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (value, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: value,
    });
  };

  const handleDepartmentChange = (value) => {
    if (value === "other") {
      setIsOtherSelected(true); // Show custom department input if 'Other' is selected
      setDepartmentName(""); // Clear department name when switching to 'Other'
    } else {
      setIsOtherSelected(false); // Hide the input if it's not 'Other'
      setDepartmentName(value); // Update department name with selected value
    }
  };

  const handleCustomDepartmentChange = (e) => {
    setDepartmentName(e.target.value); // Update department name for custom input
  };

  const handleDepartmentCodeChange = (e) => {
    setDepartmentCode(e.target.value); // Update department code
  };

  useEffect(() => {
    if (props.loginData?.loginResponse) {
      const loginData = props.loginData.loginResponse;
      console.log("loginData", loginData);
      setAccountId(loginData.user.accountId); // Set accountId from loginData
    }

    if (props.registerData?.registerResponse) {
      const registerData = props.registerData.registerResponse;
      console.log("registerData", registerData);
      setAccountId(registerData.user.accountId); // Set accountId from registerData
    }
  }, [props.loginData, props.registerData]);

  // Handle opening the modal for each step
  const openModal = (step) => {
    if (step === 1 && (current === 0 || completedSteps[0])) {
      setModalContent("Setup your Account");
      setIsModalVisible(true);
    } else if (step === 2 && (current === 1 || completedSteps[1])) {
      setModalContent("Add Department");
      setIsModalVisible(true);
    } else if (step === 3 && (current === 2 || completedSteps[2])) {
      setModalContent("Add/Invite Employees");
      setIsModalVisible(true);
    }
  };

  // Handle Step 1 form submission
  const handleStep1Submit = () => {
    props.addCompany({
      accountId: accountId,
      companyName: formValues.companyName,
      industryType: formValues.industryType,
      companyAddress1: formValues.address1,
      companyAddress2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      zipcode: formValues.zipcode,
      phoneNumber: formValues.phoneNumber,
      companyRegistrationNumber: formValues.ein,
      businessSize: formValues.businessSize,
    });
  };

  useEffect(() => {
    if (props.companyData?.addCompanyResponse) {
      let data = props.companyData.addCompanyResponse;
      if (data.success) {
        // setStepData((prev) => ({ ...prev, step1: values.step1 }));
        setCompletedSteps([true, completedSteps[1], completedSteps[2]]); // Mark Step 1 as complete
        setIsModalVisible(false);
        setCurrent(1); // Move to Step 2
        message.success("Company details addedd successfully!"); // Show success message
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.companyData]);

  // Handle Step 2 form submission
  const handleStep2Submit = () => {
    props.addDepartment({
      accountId: accountId,
      departmentName: departmentName,
      departmentCode: departmentCode,
    });
  };

  console.log('isModalVisible', isModalVisible);
  

  useEffect(() => {
    if (props.departmentData?.addDepartmentResponse) {
      let data = props.departmentData.addDepartmentResponse;
      if (data.success) {
        // setStepData((prev) => ({ ...prev, step2: values.step2 }));
        setCompletedSteps([completedSteps[0], true, completedSteps[2]]); // Mark Step 2 as complete
        setIsModalVisible(false);
        setCurrent(2); // Move to Step 3
        message.success("Department details addedd successfully!"); // Show success message
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.departmentData]);

  // Handle Step 3 form submission
  const handleStep3Submit = () => {
    props.addEmployee({
      accountId: accountId,
      firstName: empFormValues.firstName,
      lastName: empFormValues.lastName,
      departmentName: empFormValues.department,
      employeeType: empFormValues.employeeType,
      email: empFormValues.email,
      phoneNumber: empFormValues.phoneNumber,
    });
  };

  useEffect(() => {
    if (props.employeeData?.addEmployeeResponse) {
      let data = props.employeeData.addEmployeeResponse;
      if (data.success) {
        // setStepData((prev) => ({ ...prev, step3: values.step3 }));
        setCompletedSteps([completedSteps[0], completedSteps[1], true]); // Mark Step 3 as complete
        setIsModalVisible(false);
        message.success("Employee addedd successfully!"); // Show success message
        message.success("All steps completed!"); // Show success message
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employeeData]);

  // Steps component data
  const steps = [
    {
      title: "Step 1",
      description: "Setup your Account",
      onClick: () => openModal(1),
      disabled: !completedSteps[0] && current !== 0, // Allow access to Step 1 if it's the current step or already completed
    },
    {
      title: "Step 2",
      description: "Add Department",
      onClick: () => openModal(2),
      disabled: !completedSteps[0] && current !== 1, // Allow access to Step 2 only if Step 1 is completed and it's the current step
    },
    {
      title: "Step 3",
      description: "Add/Invite Employees",
      onClick: () => openModal(3),
      disabled: !completedSteps[1] && current !== 2, // Allow access to Step 3 only if Step 2 is completed and it's the current step
    },
  ];

  // Modal content based on the current step
  const renderModalContent = () => {
    switch (modalContent) {
      case "Setup your Account":
        return (
          <Form
            layout="vertical"
            // onFinish={handleSubmit}
            onFinish={handleStep1Submit}
            style={{
              maxWidth: "600px",
              margin: "auto",
              padding: "10px 20px 0 0",
            }}
          >
            {/* Company Name */}
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[
                { required: true, message: "Please input your company name!" },
              ]}
            >
              <Input
                name="companyName"
                value={formValues.companyName}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Industry Type */}
            <Form.Item
              label="Industry Type"
              name="industryType"
              rules={[
                {
                  required: true,
                  message: "Please select your industry type!",
                },
              ]}
            >
              <Select
                placeholder="Select Industry Type"
                value={formValues.industryType}
                onChange={(value) => handleSelectChange(value, "industryType")}
              >
                {industryTypes.map((industry) => (
                  <Option key={industry.value} value={industry.value}>
                    {industry.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Company Address */}
            <Form.Item
              label="Company Address 1"
              name="address1"
              rules={[
                {
                  required: true,
                  message: "Please input your company address!",
                },
              ]}
            >
              <Input
                name="address1"
                value={formValues.address1}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Company Address 2" name="address2">
              <Input
                name="address2"
                value={formValues.address2}
                onChange={handleChange}
              />
            </Form.Item>

            {/* City, State, Zipcode */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input
                    name="city"
                    value={formValues.city}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[
                    { required: true, message: "Please input your state!" },
                  ]}
                >
                  <Input
                    name="state"
                    value={formValues.state}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Zipcode"
                  name="zipcode"
                  rules={[
                    { required: true, message: "Please input your zipcode!" },
                  ]}
                >
                  <Input
                    name="zipcode"
                    value={formValues.zipcode}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Phone Number */}
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Company Registration Number/EIN (Optional) */}
            <Form.Item
              label="Company Registration Number/EIN Number (Optional)"
              name="ein"
            >
              <Input
                name="ein"
                value={formValues.ein}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Business Size */}
            <Form.Item
              label="Business Size"
              name="businessSize"
              rules={[
                {
                  required: true,
                  message: "Please select your business size!",
                },
              ]}
            >
              <Select
                placeholder="Select Business Size"
                value={formValues.businessSize}
                onChange={(value) => handleSelectChange(value, "businessSize")}
              >
                <Option value="small">Small</Option>
                <Option value="medium">Medium</Option>
                <Option value="large">Large</Option>
              </Select>
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        );
      case "Add Department":
        return (
          <Form
            layout="vertical"
            onFinish={handleStep2Submit}
            style={{
              maxWidth: "600px",
              margin: "auto",
              padding: "10px 20px 0 0",
            }}
          >
            {/* Department Name */}
            <Form.Item
              label="Department Name"
              name="departmentName"
              rules={[
                { required: true, message: "Please select a department!" },
              ]}
            >
              <Select
                placeholder="Select Department"
                value={isOtherSelected ? "other" : departmentName}
                onChange={handleDepartmentChange}
              >
                <Option value="sales">Sales</Option>
                <Option value="hr">HR</Option>
                <Option value="it">IT</Option>
                <Option value="finance">Finance</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {/* Custom Department Name (appears when 'Other' is selected) */}
            {isOtherSelected && (
              <Form.Item
                label="Custom Department Name"
                name="customDepartment"
                rules={[
                  {
                    required: true,
                    message: "Please enter a custom department name!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter custom department name"
                  value={departmentName}
                  onChange={handleCustomDepartmentChange}
                />
              </Form.Item>
            )}

            {/* Department Code */}
            <Form.Item label="Department Code (optional)" name="departmentCode">
              <Input
                placeholder="Enter department code"
                value={departmentCode}
                onChange={handleDepartmentCodeChange}
              />
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Finish
              </Button>
            </Form.Item>
          </Form>
        );
      case "Add/Invite Employees":
        return (
          <Form
            layout="vertical"
            onFinish={handleStep3Submit}
            style={{
              maxWidth: "600px",
              margin: "auto",
              padding: "10px 20px 0 0",
            }}
          >
            {/* Employee Name */}
            <Form.Item
              label="Employee First Name"
              name="employeeFirstName"
              rules={[
                {
                  required: true,
                  message: "Please input your employee first name!",
                },
              ]}
            >
              <Input
                name="firstName"
                value={empFormValues.firstName}
                onChange={empHandleChange}
              />
            </Form.Item>

            <Form.Item
              label="Employee Last Name"
              name="employeeLastName"
              rules={[
                {
                  required: true,
                  message: "Please input your employee last name!",
                },
              ]}
            >
              <Input
                name="lastName"
                value={empFormValues.lastName}
                onChange={empHandleChange}
              />
            </Form.Item>
            {/* Department Name */}
            <Form.Item
              label="Department Name"
              name="empDepartmentName"
              rules={[
                { required: true, message: "Please select a department!" },
              ]}
            >
              <Select
                placeholder="Select Department"
                onChange={(value) => empHandleSelectChange(value, "department")}
              >
                <Option value="sales">Sales</Option>
                <Option value="hr">HR</Option>
                <Option value="it">IT</Option>
                <Option value="finance">Finance</Option>
                <Option value="other">Other</Option> {/* 'Other' option */}
              </Select>
            </Form.Item>

            {/* Employee Type */}
            <Form.Item
              label="Employee Type"
              name="employeeType"
              rules={[
                { required: true, message: "Please select a employee type!" },
              ]}
            >
              <Select
                placeholder="Select Employee Type"
                onChange={(value) =>
                  empHandleSelectChange(value, "employeeType")
                }
              >
                <Option value="fullTime">Full Time</Option>
                <Option value="partTime">Part Time</Option>
                <Option value="temporary">Temporary</Option>
              </Select>
            </Form.Item>
            {/* Employee Email and Phone */}
            <Form.Item
              label="Phone Number"
              name="empPhoneNumber"
              rules={[
                { required: true, message: "Please input phone number!" },
              ]}
            >
              <Input
                name="phoneNumber"
                value={empFormValues.phoneNumber}
                onChange={empHandleChange}
              />
            </Form.Item>
            <Form.Item
              label="Email Address"
              name="emailAddress"
              rules={[
                { required: true, message: "Please input email address!" },
              ]}
            >
              <Input
                name="email"
                value={empFormValues.email}
                onChange={empHandleChange}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "80%", margin: "50px auto" }}>
      <Steps current={current} direction="vertical" style={{ gap: "10px" }}>
        {steps.map((item, index) => (
          <Step
            className="custom-step-item"
            key={index}
            title={item.title}
            description={item.description}
            onClick={item.onClick}
            disabled={item.disabled}
            // Make sure the step is clickable even when it is completed
            style={
              item.disabled ? { cursor: "not-allowed" } : { cursor: "pointer" }
            }
          />
        ))}
      </Steps>

      <Modal
        title={modalContent}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        bodyStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companyData: state.addCompany,
  departmentData: state.addDepartment,
  employeeData: state.addEmployee,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addCompany: (values) => dispatch(addcompany(values)),
  addDepartment: (values) => dispatch(addDepartment(values)),
  addEmployee: (values) => dispatch(addEmployee(values)),
});

App.propTypes = {
  login: PropTypes.func,
  addEmployee: PropTypes.func,
  addDepartment: PropTypes.func,
  addCompany: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
