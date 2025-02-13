/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Layout,
  List,
  Modal,
  Select,
  Spin,
  Switch,
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser, getUserByCompanyId } from "../../redux/User/user.action";
import { getGeneralTimeOff } from "../../redux/GeneralTimeOff/generalTimeOff.action";
import { addUserTimeOff } from "../../redux/UserTimeOff/userTimeOff.action";
import toast from "react-hot-toast";
import MailIcon from "../../assets/mail-open.svg";
import GeneralTimeOff from "../GeneralTimeOff";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIcon from "../../assets/drag-icon.svg";
import CustomButton from "../CustomButton";
import "./style.css";

const { Option } = Select;
const { Sider, Content } = Layout;

function ExistingEmployee(props) {
  const [form] = Form.useForm();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [activeTab, setActiveTab] = useState("1"); // Track active tab
  const [formValues, setFormValues] = useState({});
  const [timeOffList, setTimeOffList] = useState([]); // Time-off policies list
  const [selectedTimeOffId, setSelectedTimeOffId] = useState(null); // Selected policy ID
  const [policiesData, setPoliciesData] = useState([]); // Holds data for each policy
  const [usersList, setUsersList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [switchStates, setSwitchStates] = useState({
    carryforward: false,
    accrualLimit: false,
    cashoutLimit: false,
    resetPolicy: false,
  });

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const [isCustomPolicyVisible, setIsCustompolicyVisible] = useState(false);

  const [selectedTimeOffDetails, setSelectedTimeOffDetails] = useState(null); // To store the full details
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Function to check device width
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 767) {
        // console.log("mobile");
        setIsMobileView(true); // Mobile
      } else {
        // console.log("desk");
        setIsMobileView(false); // Desktop
      }
    };

    // Initial check and add event listener
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  // Function to handle the cancel button click
  const showCancelModal = () => {
    setIsCancelModalVisible(true);
  };

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  // Function to handle modal Cancel button
  const handleCancel = () => {
    setIsCancelModalVisible(false);
    setIsConfirmModalVisible(false);
    // console.log("Cancelled action cancelled");
  };

  // Function to handle checkbox selection
  const handleCheckboxChange = (value) => {
    setSelectedType(value === selectedType ? null : value);
    setFormValues({
      ...formValues,
      employementType: value,
    });
    form.setFieldsValue({ employmentType: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, fieldId) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const handleDateChange = (date, dateString, fieldId) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: dateString,
    }));
  };

  useEffect(() => {
    props.getGeneralTimeOff(userInfo.companyId);
    props.getUserByCompanyId(userInfo.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.userData.getUserByCompanyIdResponse) {
      let data = props.userData.getUserByCompanyIdResponse;
      if (data.success) {
        setUsersList(data.users);
      }
    }
  }, [props.userData.getUserByCompanyIdResponse]);

  useEffect(() => {
    if (props.generalTimeOffData.getGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.getGeneralTimeOffResponse;
      if (data.success) {
        // Assuming the first item in the data array contains the time off policies
        const policies = data.data[0]?.timeOff.map((policy) => ({
          code: policy.policyCode, // Unique identifier for the policy
          name: policy.policyName,
          type: policy.policyType,
          units: policy.units,
          per: policy.per,
        }));
        setTimeOffList(policies); // Set the time-off policies to state
        setSelectedTimeOffId(policies[0]?.code); // Set the first policy as selected by default
        setPoliciesData(
          policies.map((x) => ({
            policyName: x.name,
            policyCode: x.code,
            policyType: x.type,
            units: x.units,
            per: x.per,
            creditsHours: "",
            creditsUnits: "",
            carryForwardUnits: "",
            accuralUnits: "",
            EncashedUnusedLeaveUnits: "",
            resetInd: "yes",
            resetType: "yearly",
          }))
        );
      }
    }
  }, [props.generalTimeOffData.getGeneralTimeOffResponse]);

  const handleNextTab = () => {
    setActiveTab("2"); // Navigate to Benefits tab on form submission
  };

  useEffect(() => {
    if (props.generalTimeOffData.addGeneralTimeOffResponse) {
      let data = props.generalTimeOffData.addGeneralTimeOffResponse;
      if (data.success) {
        props.getGeneralTimeOff(userInfo.companyId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.generalTimeOffData.addGeneralTimeOffResponse]);

  const handleSelectTimeOff = (timeOffId) => {
    setSelectedTimeOffId(timeOffId); // Update selected policy
    // Find the full details of the selected time-off
    const selectedDetails = timeOffList.find(
      (timeOff) => timeOff.code === timeOffId
    );
    setSelectedTimeOffDetails(selectedDetails); // Save the details in state
  };

  // Function to handle input changes for policiesData
  const handleChangePolicy = (key, value, index) => {
    setPoliciesData((prevPolicies) =>
      prevPolicies.map((policy, i) =>
        i === index
          ? {
              ...policy,
              [key]: value, // Update the credits field for the matching index
            }
          : policy
      )
    );
  };

  // Function to handle select changes for policiesData
  const handleSelectChangePolicy = (value, index, field) => {
    setPoliciesData((prevPolicies) =>
      prevPolicies.map((policy, i) =>
        i === index
          ? {
              ...policy,
              [field]: value, // Update the specified field for the matching index
            }
          : policy
      )
    );
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const payload = {
      companyId: userInfo.companyId,
      companyName: userInfo.companyName,
      ...formValues,
      ...(props.module === "shift" && { isShiftActive: true }), // Spread conditionally
    };
    props.addUser(payload);
  };

  useEffect(() => {
    if (props.userData.addUserResponse) {
      let data = props.userData.addUserResponse;
      if (data.success) {
        console.log("1");
        const payload = {
          companyId: data.user.companyId,
          userId: data.user._id,
          timeOff: policiesData.map((x) => {
            let resetDate = "";
            if (x.resetType === "monthly") {
              // Get the last date of the current month
              const now = new Date();
              resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                .toISOString()
                .split("T")[0];
            } else if (x.resetType === "yearly") {
              // Set to 31st December of the current year
              const now = new Date();
              resetDate = new Date(now.getFullYear(), 11, 31)
                .toISOString()
                .split("T")[0];
            }
            return {
              policyName: x.policyName,
              policyCode: x.policyCode,
              policyType: x.policyType,
              units: x.units,
              per: x.per,
              creditsHours: x.creditsHours,
              creditsUnits: x.creditsUnits,
              carryForwardUnits: x.carryForwardUnits,
              accuralUnits: x.accuralUnits,
              EncashedUnusedLeaveUnits: x.EncashedUnusedLeaveUnits,
              resetInd: x.resetInd,
              resetType: x.resetType,
              resetDate: resetDate, // Set dynamically
            };
          }),
        };
        props.addUserTimeOff(payload);
        setIsEmailError(false);
      } else {
        console.log("2");
        toast.error(data.message);
        setIsLoading(false);
        setIsEmailError(true);
        setTimeout(() => {
          setActiveTab("1");
          handleCancel();
        }, 1000);
      }
    }
    // props.userData.addUserResponse = null;
    // Cleanup function to reset addUserResponse
    return () => {
      props.userData.addUserResponse = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userData.addUserResponse]);

  useEffect(() => {
    if (props.userTimeOffData.addUserTimeOffResponse) {
      let data = props.userTimeOffData.addUserTimeOffResponse;
      if (data.success) {
        setTimeout(() => {
          handleCancel();
          props.existingEmployees(false);
          //closing from shift
          props.addIndividualMember(false);
          setIsLoading(false);
        }, 1000);
      }
      props.userTimeOffData.addUserTimeOffResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userTimeOffData.addUserTimeOffResponse]);

  // Function to handle switch toggle
  const handleSwitchChange = (key, value) => {
    setSwitchStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [fields, setFields] = useState([
    { id: "firstName", label: "First Name", type: "input", required: true },
    { id: "middleName", label: "Middle Name", type: "input" },
    { id: "lastName", label: "Last Name", type: "input", required: true },
    { id: "phoneNumber", label: "Phone", type: "input" },
    { id: "email", label: "Email", type: "input", required: true },
    {
      id: "employmentStartDate",
      label: "Employment Start Date",
      type: "date",
      required: true,
    },
    {
      id: "employeeIdNumber",
      label: "Employee ID Number",
      type: "input",
      required: true,
    },
    { id: "jobTitle", label: "Job Title", type: "input" },
    { id: "reporting", label: "Employee Reporting To", type: "select" },
  ]);

  const [predefinedOptions] = useState([
    { id: "dob", label: "DOB", type: "date" },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
        { label: "Prefer not to say", value: "prefer_not_to_say" },
      ],
    },
    { id: "address1", label: "Address 1", type: "input" },
    { id: "address2", label: "Address 2", type: "input" },
    { id: "city", label: "City", type: "input" },
    { id: "state", label: "State", type: "input" },
    { id: "country", label: "Country", type: "input" },
    { id: "zip", label: "Zip", type: "input" },
    {
      id: "maritalStatus",
      label: "Marital Status",
      type: "select",
      options: [
        { label: "Single", value: "single" },
        { label: "Married", value: "married" },
        { label: "Divorced", value: "divorced" },
        // { label: "Widowed", value: "widowed" },
      ],
    },
    { id: "homePhone", label: "Home Phone", type: "input" },
    {
      id: "emergencyContactName",
      label: "Emergency Contact Name",
      type: "input",
    },
    {
      id: "emergencyContactPhone",
      label: "Emergency Contact Phone",
      type: "input",
    },
    {
      id: "emergencyContactRelation",
      label: "Emergency Contact Relation",
      type: "input",
    },
  ]);

  useEffect(() => {
    // Filter to include only the predefined fields that are currently selected in 'fields'
    const selectedPredefinedFields = predefinedOptions.filter(
      (field) => fields.some((f) => f.id === field.id) // Only include fields already added to 'fields'
    );

    // Initialize formValues for all selected fields (both predefined and dynamically added)
    const initialFormValues = selectedPredefinedFields.reduce((acc, field) => {
      acc[field.id] = ""; // Initialize with an empty string (or default value)
      return acc;
    }, {});

    // Ensure that the dynamic fields are also included
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialFormValues, // Merge new fields with existing values (if any)
    }));
  }, [fields, predefinedOptions]); // Runs when 'fields' or 'predefinedOptions' change

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle drag-and-drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);

    setFields(reorderedFields);
  };

  const handleAddField = (value) => {
    const fieldToAdd = predefinedOptions.find((field) => field.id === value);

    if (fieldToAdd && !fields.some((field) => field.id === fieldToAdd.id)) {
      setFields((prevFields) => {
        const newFields = [...prevFields, fieldToAdd];
        return newFields;
      });

      // Update formValues to initialize the new field with an empty string
      setFormValues((prevValues) => ({
        ...prevValues,
        [fieldToAdd.id]: "", // Initialize value for the newly added field
      }));
    }
  };

  return (
    <div className="existing-employee-container">
      <div className="existing-employee-header">
        <div>
          <div className="existing-employee-title">Enter Profile Details</div>
          <div className="existing-employee-desc">
            Bring an existing employee into the system
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              className="existing_employee_tab_number"
              style={
                activeTab === "1"
                  ? { backgroundColor: "#F3686D" }
                  : { backgroundColor: "#f9b3b6" }
              }
            >
              1
            </div>
            <div
              className="existing-employee-tabs"
              style={
                activeTab === "1" ? { color: "#F3686D" } : { color: "#f9b3b6" }
              }
            >
              Profile Details
            </div>
          </div>
          <div className="existing_employee_tab_line"></div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              className="existing_employee_tab_number"
              style={
                activeTab === "2"
                  ? { backgroundColor: "#F3686D" }
                  : { backgroundColor: "#f9b3b6" }
              }
            >
              2
            </div>
            <div
              className="existing-employee-tabs"
              style={
                activeTab === "2" ? { color: "#F3686D" } : { color: "#f9b3b6" }
              }
            >
              Add Benefits
            </div>
          </div>
        </div>
      </div>

      {activeTab === "1" ? (
        <div className="existing-employee-form">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleNextTab}
            style={{ marginTop: "20px" }}
          >
            <div className="form-checkbox-button">
              {/* Single-Selectable Checkboxes */}
              <Form.Item
                name="employmentType"
                rules={[
                  {
                    required: true,
                    message: "Select employment type",
                  },
                ]}
              >
                <div className="employee_type_container">
                  <Checkbox
                    checked={selectedType === "fullTime"}
                    onChange={() => handleCheckboxChange("fullTime")}
                  >
                    Full-time
                  </Checkbox>
                  <Checkbox
                    checked={selectedType === "partTime"}
                    onChange={() => handleCheckboxChange("partTime")}
                  >
                    Part-time
                  </Checkbox>
                  <Checkbox
                    checked={selectedType === "internship"}
                    onChange={() => handleCheckboxChange("internship")}
                  >
                    Internship
                  </Checkbox>
                </div>
              </Form.Item>

              <div style={{ width: "170px" }}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#009A4E",
                    // borderColor: "#28a745",
                    width: "100%",
                    borderRadius: "18px",
                  }}
                  onClick={() => setIsModalVisible(true)}
                >
                  Add/Edit Fields
                </Button>
              </div>
            </div>

            {/* Main Form */}
            <div className="existing_employee_form_container">
              {fields.map((field) => (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={
                    <span className="employee-custom-label">{field.label}</span>
                  }
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: `Enter ${field.label.toLowerCase()}`,
                          },
                        ]
                      : []
                  }
                  validateStatus={
                    field.id === "email" && isEmailError ? "error" : undefined
                  }
                  help={
                    field.id === "email" && isEmailError
                      ? "This email already exists"
                      : undefined
                  }
                >
                  {field.type === "input" && (
                    <Input
                      className="employee-input"
                      name={field.id}
                      value={formValues[field.id]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  {field.type === "date" && (
                    <DatePicker
                      className="employee-input"
                      name={field.id}
                      value={formValues[field.id]}
                      onChange={(date, dateString) =>
                        handleDateChange(date, dateString, field.id)
                      }
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      style={{ width: "100%" }}
                      format="MM/DD/YYYY"
                    />
                  )}
                  {field.type === "select" && (
                    <Select
                      className="employee-input"
                      value={formValues[field.id]}
                      onChange={(value) => handleSelectChange(value, field.id)}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    >
                      {field.options
                        ? field.options.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))
                        : usersList.map((user) => (
                            <Option key={user._id} value={user._id}>
                              {`${user.firstName} ${user.middleName || ""} ${
                                user.lastName
                              }`.trim()}
                            </Option>
                          ))}
                    </Select>
                  )}
                </Form.Item>
              ))}
              {/* </Form> */}
            </div>

            {/* Customization Modal */}
            <Modal
              className="add_employee_custon_field_modal"
              title="Add or Edit Fields for Employees"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={[
                <Button
                  style={{
                    width: "150px",
                    height: "40px",
                    borderRadius: "18px",
                  }}
                  key="cancel"
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </Button>,
                <Button
                  style={{
                    width: "150px",
                    height: "40px",
                    borderRadius: "18px",
                  }}
                  key="submit"
                  type="primary"
                  onClick={() => setIsModalVisible(false)}
                >
                  Save
                </Button>,
              ]}
              width={600}
            >
              <div className="add_employee_custon_field_modal_desc">
                Drag to reorder information on Employee form
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      // style={{ maxHeight: "300px", overflowY: "auto" }}
                      className="add_employee_draggable_items_container"
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="add_employee_draggable_items"
                            >
                              <img src={DragIcon} alt="drag icon" />
                              {field.label}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Dropdown to add new fields */}
              <div style={{ marginTop: "20px" }}>
                <Select
                  placeholder="Add a new field"
                  onChange={handleAddField}
                  className="add_employee_draggable_items_dropdown"
                >
                  {predefinedOptions.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </Modal>

            <div className="existing_employee_buttons_container">
              <div>
                <CustomButton
                  color={"grey"}
                  onClick={() => {
                    // props.existingEmployees(false);
                    props.addIndividualMember(false);
                  }}
                >
                  Cancel
                </CustomButton>
              </div>
              <div>
                <CustomButton color={"blue"} htmlType="submit">
                  Continue
                </CustomButton>
              </div>
            </div>
          </Form>
        </div>
      ) : (
        <>
          <Layout style={{ backgroundColor: "#fff" }}>
            {isMobileView ? (
              <div style={{ padding: "10px", marginTop: "20px" }}>
                <div
                  className="policy-custom-label"
                  style={{ marginBottom: "10px" }}
                >
                  Select Leave Policy
                </div>
                <Select
                  className="leave-policy-input"
                  style={{ width: "100%" }}
                  placeholder="Select"
                  onChange={handleSelectTimeOff}
                >
                  {timeOffList.map((x) => (
                    <Option key={x.code} value={x.code}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
                <div className="card">
                  <div className="circle"></div>
                  <div className="content">
                    <h3>
                      {selectedTimeOffDetails
                        ? selectedTimeOffDetails.name
                        : ""}
                    </h3>
                    <div className="details">
                      Code:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.code
                          : ""}
                      </span>{" "}
                      &nbsp; &nbsp; Type:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.type
                          : ""}
                      </span>
                    </div>
                    <div className="details">
                      Units:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.units
                          : ""}
                      </span>{" "}
                      &nbsp; &nbsp; Per:{" "}
                      <span>
                        {selectedTimeOffDetails
                          ? selectedTimeOffDetails.per
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Sider
                width={300}
                style={{ background: "#fff", padding: "10px" }}
              >
                <div
                  style={{ marginTop: "30px" }}
                  className="leave-policy-heading"
                >
                  Leave Policies
                </div>
                <List
                  style={{ marginTop: "20px", border: 0 }}
                  bordered
                  dataSource={timeOffList}
                  renderItem={(timeOff) => (
                    <List.Item
                      style={{ cursor: "pointer", padding: "20px 0 20px 20px" }}
                      onClick={() => handleSelectTimeOff(timeOff.code)}
                      className={`card-item ${
                        selectedTimeOffId === timeOff.code ? "selected" : ""
                      }`}
                    >
                      <div className="card">
                        <div className="circle"></div>
                        <div className="content">
                          <h3>{timeOff.name}</h3>
                          <div className="details">
                            Code: <span>{timeOff.code}</span> &nbsp; &nbsp;
                            Type: <span>{timeOff.type}</span>
                          </div>
                          <div className="details">
                            Units: <span>{timeOff.units}</span> &nbsp; &nbsp;
                            Per: <span>{timeOff.per}</span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                <div style={{ marginTop: "20px" }}>
                  <Button
                    className="custom-policy-button"
                    onClick={() => setIsCustompolicyVisible(true)}
                  >
                    Create custom leave policy
                  </Button>
                </div>
                <Modal
                  visible={isCustomPolicyVisible}
                  footer={null}
                  width={"80%"}
                  onCancel={() => setIsCustompolicyVisible(false)}
                >
                  <div style={{ padding: "10px" }}>
                    <GeneralTimeOff />
                  </div>
                </Modal>
              </Sider>
            )}

            <Layout
              style={{ minHeight: "400px" }}
              className="policy-details-continer"
            >
              <Content>
                {selectedTimeOffId ? (
                  <>
                    {timeOffList.map(
                      (policy, index) =>
                        selectedTimeOffId === policy.code && (
                          <div key={policy.code}>
                            {!isMobileView && (
                              <div
                                style={{ borderBottom: "1px solid #e0e0e0" }}
                                className="leave-policy-heading"
                              >
                                {policy.name}
                              </div>
                            )}
                            <Form layout="vertical">
                              {!isMobileView && (
                                <div
                                  style={{
                                    padding: " 20px 100px 0",
                                    borderBottom: "1px solid #e0e0e0",
                                    display: "flex",
                                    gap: "50px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Type
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.policyType}
                                      readOnly
                                      placeholder="Paid"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Units
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.units}
                                      readOnly
                                      placeholder="Hour"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Units per
                                      </span>
                                    }
                                  >
                                    <Input
                                      style={{
                                        backgroundColor: "#f5f7fa",
                                        width: "130px",
                                        border: 0,
                                      }}
                                      className="leave-policy-input"
                                      value={policiesData[index]?.per}
                                      readOnly
                                      placeholder="Month"
                                    />
                                  </Form.Item>
                                </div>
                              )}

                              <div
                                style={{
                                  display: "flex",
                                  borderBottom: "1px solid #E0E0E0",
                                  padding: !isMobileView ? "20px 0" : "",
                                }}
                              >
                                {" "}
                                {!isMobileView && (
                                  <div style={{ width: "104px" }}></div>
                                )}
                                <Form.Item
                                  label={
                                    <span className="policy-custom-label">
                                      Credit {policy.units}
                                    </span>
                                  }
                                  style={{ marginRight: "20px" }}
                                >
                                  <Input
                                    className="leave-policy-input"
                                    value={policiesData[index]?.creditsHours}
                                    placeholder={`0.00 ${policy.units.toLowerCase()}`}
                                    onChange={(e) =>
                                      handleChangePolicy(
                                        "creditsHours",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Item>
                                <div
                                  className="policy-custom-label hours-div"
                                  style={{
                                    marginLeft: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {policy.units}
                                </div>
                              </div>

                              {/* Carryforward Unused Leave */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.carryforward}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "carryforward",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Carry Forward Unused leave upto
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder={`0.00 ${policy.units.toLowerCase()}`}
                                      disabled={!switchStates.carryforward}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "carryForwardUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={
                                        policiesData[index]?.carryForwardUnits
                                      }
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label hours-div"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {policy.units}
                                  </div>
                                </div>
                              </div>

                              {/* Maximum Annual Accrual Limit */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.accrualLimit}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "accrualLimit",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Maximum Annual Accrual Limit{" "}
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder={`0.00 ${policy.units.toLowerCase()}`}
                                      disabled={!switchStates.accrualLimit}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "accuralUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={policiesData[index]?.accuralUnits}
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {policy.units}
                                  </div>
                                </div>
                              </div>
                              {/* Cashout Unused Time Limit */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.cashoutLimit}
                                    onChange={(checked) =>
                                      handleSwitchChange(
                                        "cashoutLimit",
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Cash out unused time upto
                                      </span>
                                    }
                                  >
                                    <Input
                                      className="leave-policy-input"
                                      placeholder={`0.00 ${policy.units.toLowerCase()}`}
                                      disabled={!switchStates.cashoutLimit}
                                      onChange={(e) =>
                                        handleChangePolicy(
                                          "EncashedUnusedLeaveUnits",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      value={
                                        policiesData[index]
                                          ?.EncashedUnusedLeaveUnits
                                      }
                                    />
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {policy.units}
                                  </div>
                                </div>
                              </div>
                              {/* Reset Time Policy */}
                              <div className="policy_details_switch_byn_container">
                                <div
                                  style={{
                                    padding: !isMobileView ? "30px" : "10px",
                                  }}
                                >
                                  <Switch
                                    checked={switchStates.resetPolicy}
                                    onChange={(checked) =>
                                      handleSwitchChange("resetPolicy", checked)
                                    }
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    padding: !isMobileView ? 0 : "10px",
                                  }}
                                >
                                  <Form.Item
                                    label={
                                      <span className="policy-custom-label">
                                        Reset Time policy
                                      </span>
                                    }
                                  >
                                    <Select
                                      style={{ width: "250px" }}
                                      className="leave-policy-input"
                                      placeholder="Select reset"
                                      value={policiesData[index]?.resetType} // Bind to the corresponding policy
                                      onChange={(value) =>
                                        handleSelectChangePolicy(
                                          value,
                                          index,
                                          "resetType"
                                        )
                                      } // Pass value, index, and field
                                      disabled={!switchStates.resetPolicy}
                                    >
                                      <Option value="monthly">Monthly</Option>
                                      <Option value="yearly">Yearly</Option>
                                    </Select>
                                  </Form.Item>
                                  <div
                                    className="policy-custom-label"
                                    style={{
                                      marginLeft: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {policiesData[index]?.resetType ===
                                    "monthly"
                                      ? "Reset on the last day of every month"
                                      : "Reset on 31st December"}
                                  </div>{" "}
                                </div>
                              </div>
                            </Form>
                          </div>
                        )
                    )}
                  </>
                ) : (
                  <div className="leave-policy-heading">Add Leave Policy</div>
                )}
              </Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "20px",
                  margin: "20px 0",
                }}
              >
                <CustomButton color={"grey"} onClick={showCancelModal}>
                  Cancel
                </CustomButton>
                <Modal
                  visible={isCancelModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "30px",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div className="cancel_popup_title">
                      Cancel adding leave benefits?
                    </div>
                    <div className="cancel_popup_desc">
                      You will lose the changes made on the leave policy
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "85%",
                        marginTop: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <CustomButton
                        color={"grey"}
                        onClick={handleCancel}
                        style={{ height: "40px" }}
                      >
                        Not Now
                      </CustomButton>
                      <CustomButton
                        color={"blue"}
                        onClick={() => {
                          setActiveTab("1"), handleCancel();
                        }}
                        style={{ height: "40px" }}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  </div>
                </Modal>
                <CustomButton color={"blue"} onClick={showConfirmModal}>
                  Finish
                </CustomButton>
                <Modal
                  visible={isConfirmModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                  closable={false}
                  width={600}
                >
                  <Spin spinning={isLoading}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <img src={MailIcon} alt="Mail icon" />
                      </div>
                      <div>
                        <div className="cancel_popup_title">
                          An invitation will be send to
                        </div>
                        <div className="cancel_popup_desc">
                          {formValues.email}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column-reverse",
                          gap: "10px",
                          width: "150px",
                        }}
                      >
                        <CustomButton
                          color={"grey"}
                          style={{ height: "40px" }}
                          onClick={handleCancel}
                        >
                          Cancel
                        </CustomButton>
                        <CustomButton
                          color={"blue"}
                          style={{ height: "40px" }}
                          onClick={handleSubmit}
                        >
                          Confirm
                        </CustomButton>
                      </div>
                    </div>
                  </Spin>
                </Modal>
              </div>
            </Layout>
          </Layout>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.user,
  departmentData: state.department,
  generalTimeOffData: state.generalTimeOff,
  userTimeOffData: state.userTimeOff,
});

const mapDispatchToProps = (dispatch) => ({
  addUser: (values) => dispatch(addUser(values)),
  getGeneralTimeOff: (values) => dispatch(getGeneralTimeOff(values)),
  addUserTimeOff: (values) => dispatch(addUserTimeOff(values)),
  getUserByCompanyId: (values) => dispatch(getUserByCompanyId(values)),
});

ExistingEmployee.propTypes = {
  addUser: PropTypes.func,
  getGeneralTimeOff: PropTypes.func,
  addUserTimeOff: PropTypes.func,
  getUserByCompanyId: PropTypes.func,
  userData: PropTypes.object,
  departmentData: PropTypes.object,
  generalTimeOffData: PropTypes.object,
  userTimeOffData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingEmployee);
