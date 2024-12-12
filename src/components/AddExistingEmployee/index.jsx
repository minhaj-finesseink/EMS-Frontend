/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Radio, Button, Tabs, Select } from "antd";
import { addEmployee } from "../../redux/Add-employee/employee.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const { TabPane } = Tabs;
const { Option } = Select;

const AddEmployee = (props) => {
  const [form] = Form.useForm();
  // const [employmentType, setEmploymentType] = useState("Full-time");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  // const [payPeriod, setPayPeriod] = useState("");
  const [suffix, setSuffix] = useState("");
  const [formValues, setFormValues] = useState({
    employementType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    employmentStartDate: "",
    dob: "",
    sex: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    street: "",
    state: "",
    city: "",
    zip: "",
    country: "",
    department: "",

    salary: "",
    salaryPeriod: "",
    timeOff: "",
    carryForwardTimeOff: "",
  });
  const [accountId, setAccountId] = useState(null);

  // const handleEmploymentTypeChange = (e) => {
  //   setEmploymentType(e.target.value);
  // };

  const handleTabChange = (key) => {
    setActiveTab(key); // Update the active tab key
  };

  const handleSubmit = (values) => {
    // console.log("Form Submitted:", values);
    setActiveTab("2"); // Navigate to Benefits tab on form submission
  };

  const getHeadingContent = () => {
    if (activeTab === "1") return "Add Existing Employee";
    if (activeTab === "2") return "Employee Time Off";
    return "Form Section";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("name", name, "value", value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date, dateString, fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: dateString,
    });
  };

  const handleSelectChange = (value, fieldName) => {
    // console.log("value - ", value, "fieldName - ", fieldName);
    setFormValues({
      ...formValues,
      [fieldName]: value,
    });

    // setPayPeriod(value);

    switch (value) {
      case "hourly":
        setSuffix("/hr");
        break;
      case "weekly":
        setSuffix("/week");
        break;
      case "biweekly":
        setSuffix("/2 weeks");
        break;
      case "daily":
        setSuffix("/day");
        break;
      case "monthly":
        setSuffix("/month");
        break;
      case "yearly":
        setSuffix("/year");
        break;
      case "semiMonthly":
        setSuffix("/semi-monthly");
        break;
      case "projectBased":
        setSuffix("/project");
        break;
      default:
        setSuffix("");
    }
  };

  // console.log("Test- ", formValues);

  useEffect(() => {
    if (props.loginData?.loginResponse) {
      const loginData = props.loginData.loginResponse;
      setAccountId(loginData.user.accountId); // Set accountId from loginData
    }

    if (props.registerData?.registerResponse) {
      const registerData = props.registerData.registerResponse;
      setAccountId(registerData.user.accountId); // Set accountId from registerData
    }
  }, [props.loginData, props.registerData]);

  const handleAddExistingUser = () => {
    props.addEmployee({
      accountId: accountId,
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      departmentName: formValues.department,
      employeeType: formValues.employementType,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      employementStartDate: formValues.employmentStartDate,
      dob: formValues.dob,
      sex: formValues.sex,
      idNumber: formValues.idNumber,
      address: {
        address: formValues.address ? formValues.address : "",
        street: formValues.street ? formValues.street : "",
        state: formValues.state ? formValues.state : "",
        city: formValues.city ? formValues.city : "",
        zip: formValues.zip ? formValues.zip : "",
        country: formValues.country ? formValues.country : "",
      },
      salary: formValues.salary,
      salaryPeriod: formValues.salaryPeriod,
      timeOff: formValues.timeOff,
      carryforwardTimeOff: formValues.carryForwardTimeOff,
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>{getHeadingContent()}</h2>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {/* Profile Details Tab */}
        <TabPane tab="Profile Detail" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <Form.Item
                name="employmentType"
                label="Employement Type"
                rules={[
                  {
                    required: true,
                    message: "Please select employee employement type!",
                  },
                ]}
              >
                <Radio.Group
                  name="employementType"
                  onChange={handleChange}
                  value={formValues.employementType}
                  // style={{}}
                >
                  <Radio.Button value="Full-time">Full-time</Radio.Button>
                  <Radio.Button value="Part-time">Part-time</Radio.Button>
                  <Radio.Button value="Internship">Internship</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee first name!",
                  },
                ]}
              >
                <Input
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </Form.Item>

              <Form.Item name="middleName" label="Middle Name">
                <Input
                  name="middleName"
                  value={formValues.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee last name!",
                  },
                ]}
              >
                <Input
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Item>

              <Form.Item
                name="department"
                label="Department Name"
                rules={[
                  {
                    required: true,
                    message: "Please input employee department name!",
                  },
                ]}
              >
                <Input
                  name="department"
                  value={formValues.department}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Item>

              <Form.Item
                name="employmentStartDate"
                label="Employment Start Date"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee start date!",
                  },
                ]}
              >
                <DatePicker
                  name="employementStartDate"
                  value={formValues.employmentStartDate}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "employmentStartDate")
                  }
                  placeholder="Select start date"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item name="dob" label="DOB">
                <DatePicker
                  name="dob"
                  value={formValues.dob}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "dob")
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="sex"
                label="Sex"
                rules={[
                  {
                    required: true,
                    message: "Please select sex!",
                  },
                ]}
              >
                <Radio.Group
                  name="sex"
                  value={formValues.sex}
                  onChange={handleChange}
                >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="idNumber"
                label="ID Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee ID number!",
                  },
                ]}
              >
                <Input
                  name="idNumber"
                  value={formValues.idNumber}
                  onChange={handleChange}
                  placeholder="ID number"
                />
              </Form.Item>

              <Form.Item name="phoneNumber" label="Phone">
                <Input
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please enter employee email!",
                  },
                ]}
              >
                <Input
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </Form.Item>

              <Form.Item name="street" label="Street">
                <Input
                  name="street"
                  value={formValues.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
              </Form.Item>

              <Form.Item name="state" label="State/Province">
                <Input
                  name="state"
                  value={formValues.state}
                  onChange={handleChange}
                  placeholder="State / Province"
                />
              </Form.Item>

              <Form.Item name="city" label="City">
                <Select
                  value={formValues.city}
                  onChange={(value) => handleSelectChange(value, "city")}
                  placeholder="City"
                >
                  <Option value="city1">City 1</Option>
                  <Option value="city2">City 2</Option>
                </Select>
              </Form.Item>

              <Form.Item name="zip" label="Zip / Postal Code">
                <Input
                  name="zip"
                  value={formValues.zip}
                  onChange={handleChange}
                  placeholder="Ward"
                />
              </Form.Item>

              <Form.Item name="country" label="Country/Region">
                <Select
                  value={formValues.country}
                  onChange={(value) => handleSelectChange(value, "country")}
                  placeholder="Country / Region"
                >
                  <Option value="country1">Country 1</Option>
                  <Option value="country2">Country 2</Option>
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100px" }}
              >
                Continue
              </Button>
            </div>
          </Form>
        </TabPane>

        {/* Benefits Tab */}
        <TabPane tab="Time Off" key="2">
          <Form
            form={form}
            layout="vertical"
            // onFinish={handleTimeOff}
            style={{ marginTop: "20px" }}
          >

            {/* Time Off Section */}
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <Form.Item
                label="Paid Time Off"
                name="paidTimeOff"
                rules={[
                  {
                    required: true,
                    message: "Please enter the paid time off details!",
                  },
                ]}
              >
                <Input placeholder="Enter Paid Time Off" />
              </Form.Item>

              <Form.Item
                label="Carry forward unused leave unto"
                name="carryForwardUnusedLeave"
                rules={[
                  {
                    required: true,
                    message: "Please enter the carry forward leave details!",
                  },
                ]}
              >
                <Input placeholder="Carry forward unused leave unto" />
              </Form.Item>

              <Form.Item
                label="Maximum Accural"
                name="maxArrual"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Maximum Accural details!",
                  },
                ]}
              >
                <Input placeholder="Maximum Accural" />
              </Form.Item>

              <Form.Item name="reset" label="Reset">
                <Select
                  value={formValues.city}
                  // onChange={(value) => handleSelectChange(value, "city")}
                  placeholder="Reset"
                >
                  <Option value="monthly">Monthly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Encash unused leave upto"
                name="encashedUnsedLeave"
                rules={[
                  {
                    required: true,
                    message: "Please enter the encashed unused leave details!",
                  },
                ]}
              >
                <Input placeholder="Encash unused leave upto" />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100px" }}
                // onClick={handleAddExistingUser}
              >
                Finished
              </Button>
            </div>
          </Form>
          {/* <div>
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <Form.Item
                name="paidTimeOff"
                label="Paid Tim eOff"
                rules={[
                  {
                    required: true,
                    message: "Please enter input!",
                  },
                ]}
              >
                <Input
                  name="timeOff"
                  value={formValues.timeOff}
                  onChange={handleChange}
                  placeholder={"15"}
                  suffix={"Hrs"}
                />
              </Form.Item>
              <Form.Item
                name="carryForward"
                label="Carry forward unused leave upto"
                rules={[
                  {
                    required: true,
                    message: "Please enter input!",
                  },
                ]}
              >
                <Input
                  name="carryForwardTimeOff"
                  value={formValues.carryForwardTimeOff}
                  onChange={handleChange}
                  placeholder={"5"}
                  suffix={"hrs/year"}
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100px" }}
                onClick={handleAddExistingUser}
              >
                Finished
              </Button>
            </div>
          </div> */}
        </TabPane>
      </Tabs>
    </div>
  );
};

// export default AddEmployee;
const mapStateToProps = (state) => ({
  employeeData: state.AddEmployee,
  loginData: state.login,
  registerData: state.register,
});

const mapDispatchToProps = (dispatch) => ({
  addEmployee: (values) => dispatch(addEmployee(values)),
});

AddEmployee.propTypes = {
  // login: PropTypes.func,
  addEmployee: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);
