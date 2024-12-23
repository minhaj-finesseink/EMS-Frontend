// /* eslint-disable react/prop-types */
// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import { Button, Modal, Input, Form, message, Select, Row, Col } from "antd";
// import { industryTypes } from "../../utils/industryType";
// import { DeleteOutlined } from "@ant-design/icons";
// import { addcompany } from "../../redux/Add-company/company.action";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { addDepartment } from "../../redux/Add-department/department.action";
// import Image from "../../assets/company-details-image.jpeg";
// import "./style.css";

// const { Option } = Select;

// const countryStateMapping = {
//   "United States": ["California", "Texas", "Florida", "New York"],
//   "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
//   "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
//   Qatar: ["Doha", "Al Rayyan", "Al Wakrah"],
//   "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Dammam"],
//   Bahrain: ["Manama", "Riffa", "Muharraq"],
//   Kuwait: ["Hawalli", "Salmiya", "Farwaniya"],
// };

// const AccountSetup = (props) => {
//   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [step, setStep] = useState(1); // Step 1: Account, Step 2: Department
//   const [formValues, setFormValues] = useState({
//     companyName: "",
//     industryType: "",
//     customIndustry: "",
//     address1: "",
//     address2: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     phoneNumber: "",
//     ein: "",
//     businessSize: "",
//     country: "",
//     // departmentName: "",
//     // customDepartment: "",
//     // departmentCode: "",
//   });
//   const [isOtherIndustry, setIsOtherIndustry] = useState(false); // For 'Other' Industry Type
//   const [departmentValues, setDepartmentValues] = useState([
//     {
//       id: Date.now(),
//       departmentName: "",
//       customDepartment: "",
//       departmentCode: "",
//       isOther: false,
//     },
//   ]);
//   const [isOtherDepartment, setIsOtherDepartment] = useState(false); // For 'Other' Department
//   const [companyId, setCompanyId] = useState("");

//   // const showModal = () => {
//   //   setIsModalVisible(true);
//   // };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setStep(1); // Reset to initial step
//     setFormValues({
//       companyName: "",
//       industryType: "",
//       customIndustry: "",
//       address1: "",
//       address2: "",
//       city: "",
//       state: "",
//       zipcode: "",
//       phoneNumber: "",
//       ein: "",
//       businessSize: "",
//       // departmentName: "",
//       // customDepartment: "",
//       // departmentCode: "",
//     });
//     setDepartmentValues([
//       ...departmentValues,
//       {
//         id: Date.now(),
//         departmentName: "",
//         customDepartment: "",
//         departmentCode: "",
//       },
//     ]);
//     setIsOtherIndustry(false);
//     setIsOtherDepartment(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (value, field) => {
//     setFormValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     if (field === "industryType") {
//       setIsOtherIndustry(value === "other");
//     }
//     if (field === "departmentName") {
//       setIsOtherDepartment(value === "other");
//     }
//   };

//   // Function to handle department input changes
//   const handleDepartmentInputChange = (e, id) => {
//     const { name, value } = e.target;
//     const updatedFields = departmentValues.map((field) =>
//       field.id === id ? { ...field, [name]: value } : field
//     );
//     setDepartmentValues(updatedFields);
//   };

//   // Function to handle department select changes
//   // const handleDepartmentSelectChange = (value, fieldName, id) => {
//   //   const updatedFields = departmentValues.map((field) =>
//   //     field.id === id ? { ...field, [fieldName]: value } : field
//   //   );

//   //   if (value === "other") {
//   //     setIsOtherDepartment(true);
//   //   }

//   //   setDepartmentValues(updatedFields);
//   // };

//   const handleDepartmentSelectChange = (value, fieldName, id) => {
//     const updatedFields = departmentValues.map((field) => {
//       if (field.id === id) {
//         const updatedField = { ...field, [fieldName]: value };
//         if (fieldName === "departmentName" && value === "other") {
//           updatedField.isOther = true; // Set isOther to true when "Other" is selected
//         } else if (fieldName === "departmentName" && value !== "other") {
//           updatedField.isOther = false; // Reset isOther when another department is selected
//         }
//         return updatedField;
//       }
//       return field;
//     });

//     setDepartmentValues(updatedFields);
//   };

//   // Function to add new department
//   const addDepartmentField = () => {
//     setDepartmentValues([
//       ...departmentValues,
//       {
//         id: Date.now(),
//         departmentName: "",
//         customDepartment: "",
//         departmentCode: "",
//         isOther: false,
//       },
//     ]);
//   };

//   // Function to remove an department
//   const removeDepartmentField = (id) => {
//     setDepartmentValues(departmentValues.filter((field) => field.id !== id));
//   };

//   const handleAccountSubmit = () => {
//     props.addCompany({
//       userId: userInfo._id,
//       companyName: formValues.companyName,
//       industryType:
//         formValues.industryType === "other"
//           ? formValues.customIndustry
//           : formValues.industryType,
//       address1: formValues.address1,
//       address2: formValues.address2,
//       city: formValues.city,
//       state: formValues.state,
//       zipcode: formValues.zipcode,
//       phoneNumber: formValues.phoneNumber,
//       ein: formValues.ein,
//       businessSize: formValues.businessSize,
//       country: formValues.country,
//     });
//   };

//   useEffect(() => {
//     if (props.companyData.addCompanyResponse) {
//       let data = props.companyData.addCompanyResponse;
//       if (data.success) {
//         message.success("Account details added successfully!");
//         setStep(2);
//         let companyId = data.company._id;
//         setCompanyId(companyId);
//         let localStorageData = userInfo;
//         localStorageData.companyId = companyId;
//         // Save the updated data back to local storage
//         localStorage.setItem("userInfo", JSON.stringify(localStorageData));
//         handleCancel();
//       }
//     }
//   }, [props.companyData.addCompanyResponse]);

//   const handleDepartmentSubmit = () => {
//     console.log("formValues final", departmentValues);
//     const payload = {
//       userId: userInfo._id,
//       companyId: companyId,
//       department: departmentValues.map((field) => ({
//         departmentName:
//           field.departmentName === "other"
//             ? field.customDepartment
//             : field.departmentName,
//         departmentCode: field.departmentCode,
//       })),
//     };
//     props.addDepartment(payload);
//   };

//   useEffect(() => {
//     if (props.departmentData.addDepartmentResponse) {
//       let data = props.departmentData.addDepartmentResponse;
//       if (data.success) {
//         message.success("Department details added successfully!");
//         handleCancel();
//       }
//       if (data.user) {
//         let setupComplete = data.user.isSetupComplete;
//         let localStorageData = userInfo;
//         localStorageData.isSetupComplete = setupComplete;
//         // Save the updated data back to local storage
//         localStorage.setItem("userInfo", JSON.stringify(localStorageData));
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.departmentData.addDepartmentResponse]);

//   useEffect(() => {
//     let data = props.showModal;
//     if (!data) {
//       setIsModalVisible(true);
//     }
//   }, []);

//   return (
//     <div className="company-setup-main-container">
//       {/* <Button style={{ width: "200px" }} type="primary" onClick={showModal}>
//         Get Started
//       </Button> */}
//       <Modal
//         // title={step === 1 ? "Setup your company account" : "Add Department"}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         className="company-setup-modal"
//         width={"80%"}
//         style={{ top: "20px" }}
//       >
//         <div className="company-setup-container">
//           <div className="company-setup-image-container">
//             <img
//               className="company-setup-image"
//               src={Image}
//               alt="Add Company Details Image"
//             />
//           </div>
//           <Form
//             layout="vertical"
//             onFinish={handleAccountSubmit}
//             className="company-setup-form-container"
//           >
//             {/* Company Name */}
//             <Form.Item
//               // label="Company Name"
//               name="companyName"
//               rules={[
//                 { required: true, message: "Please input your company name!" },
//               ]}
//             >
//               <Input
//                 placeholder="Company Name"
//                 className="company-setup-input"
//                 name="companyName"
//                 value={formValues.companyName}
//                 onChange={handleInputChange}
//               />
//             </Form.Item>

//             {/* Industry Type */}
//             <Form.Item
//               // label="Industry Type"
//               name="industryType"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select your industry type!",
//                 },
//               ]}
//             >
//               <Select
//                 className="company-setup-input"
//                 placeholder="Industry Type"
//                 value={formValues.industryType}
//                 onChange={(value) => handleSelectChange(value, "industryType")}
//               >
//                 {industryTypes.map((industry) => (
//                   <Option key={industry.value} value={industry.value}>
//                     {industry.label}
//                   </Option>
//                 ))}
//                 <Option value="other">Other</Option>
//               </Select>
//             </Form.Item>

//             {/* Show input for 'Other' Industry */}
//             {isOtherIndustry && (
//               <Form.Item
//                 // label="Enter your Industry"
//                 name="customIndustry"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please specify your industry!",
//                   },
//                 ]}
//               >
//                 <Input
//                   placeholder="Industry Type Name"
//                   className="company-setup-input"
//                   name="customIndustry"
//                   value={formValues.customIndustry}
//                   onChange={handleInputChange}
//                 />
//               </Form.Item>
//             )}

//             {/* Company Address */}
//             <Form.Item
//               // label="Company Address 1"
//               name="address1"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input your company address!",
//                 },
//               ]}
//             >
//               <Input
//                 placeholder="Company Address"
//                 className="company-setup-input"
//                 name="address1"
//                 value={formValues.address1}
//                 onChange={handleInputChange}
//               />
//             </Form.Item>

//             <Form.Item
//               // label="Company Address 2"
//               name="address2"
//             >
//               <Input
//                 placeholder="Company Address 2"
//                 className="company-setup-input"
//                 name="address2"
//                 value={formValues.address2}
//                 onChange={handleInputChange}
//               />
//             </Form.Item>

//             {/* City, Country, State, Zipcode */}
//             <Row gutter={16}>
//               {/* City */}
//               <Col span={6}>
//                 <Form.Item
//                   // label="City"
//                   name="city"
//                   rules={[
//                     { required: true, message: "Please input your city!" },
//                   ]}
//                 >
//                   <Input
//                     placeholder="City"
//                     className="company-setup-input"
//                     name="city"
//                     value={formValues.city}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Country */}
//               <Col span={6}>
//                 <Form.Item
//                   // label="Country"
//                   name="country"
//                   rules={[
//                     { required: true, message: "Please select a country!" },
//                   ]}
//                 >
//                   <Select
//                     className="company-setup-input"
//                     placeholder="Country"
//                     value={formValues.country}
//                     onChange={(value) => handleSelectChange(value, "country")}
//                   >
//                     {Object.keys(countryStateMapping).map((country) => (
//                       <Option key={country} value={country}>
//                         {country}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               {/* State */}
//               <Col span={6}>
//                 <Form.Item
//                   // label="State"
//                   name="state"
//                   rules={[
//                     { required: true, message: "Please select a state!" },
//                   ]}
//                 >
//                   <Select
//                     className="company-setup-input"
//                     placeholder="State"
//                     value={formValues.state}
//                     onChange={(value) => handleSelectChange(value, "state")}
//                     disabled={!formValues.country} // Disable if no country selected
//                   >
//                     {(countryStateMapping[formValues.country] || []).map(
//                       (state) => (
//                         <Option key={state} value={state}>
//                           {state}
//                         </Option>
//                       )
//                     )}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               {/* Zipcode */}
//               <Col span={6}>
//                 <Form.Item
//                   // label="Zipcode"
//                   name="zipcode"
//                   rules={[
//                     { required: true, message: "Please input your zipcode!" },
//                     {
//                       pattern: /^\d{5}(-\d{4})?$/, // Regex for US ZIP codes (5 digits, optional 4 digits)
//                       message: "Please enter a valid ZIP code!",
//                     },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Zip"
//                     className="company-setup-input"
//                     name="zipcode"
//                     value={formValues.zipcode}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* Phone Number */}
//             <Form.Item
//               // label="Phone Number"
//               name="phoneNumber"
//               rules={[
//                 { required: true, message: "Please input your phone number!" },
//                 {
//                   pattern: /^[0-9]{10,15}$/, // Allows only digits with a length of 10 to 15
//                   message: "Please enter a valid phone number (10-15 digits)!",
//                 },
//               ]}
//             >
//               <Input
//                 placeholder="Phone Number"
//                 className="company-setup-input"
//                 name="phoneNumber"
//                 value={formValues.phoneNumber}
//                 onChange={handleInputChange}
//               />
//             </Form.Item>

//             {/* Company Registration Number/EIN */}
//             <Form.Item
//               // label="Company Registration Number/EIN (Optional)"
//               name="ein"
//             >
//               <Input
//                 placeholder="Company Registration Number/EIN"
//                 className="company-setup-input"
//                 name="ein"
//                 value={formValues.ein}
//                 onChange={handleInputChange}
//               />
//             </Form.Item>

//             {/* Business size */}
//             <Form.Item
//               // label="Business Size"
//               name="businessSize"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select your business size!",
//                 },
//               ]}
//             >
//               <Select
//                 className="company-setup-input"
//                 placeholder="Business Size"
//                 value={formValues.businessSize}
//                 onChange={(value) => handleSelectChange(value, "businessSize")}
//               >
//                 <Option value="small">Up to 10 Employees</Option>
//                 <Option value="medium">10 - 49 Employees</Option>
//                 <Option value="large">50 - 249 Employees</Option>
//                 <Option value="extra-large">250 + Employees</Option>
//               </Select>
//             </Form.Item>

//             {/* Register Button */}
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 style={{ width: "100%" }}
//                 className="company-setup-button"
//               >
//                 Finish
//               </Button>
//             </Form.Item>
//           </Form>

//           {/* // <Form
//           //   layout="vertical"
//           //   onFinish={handleDepartmentSubmit}
//           //   style={{
//           //     maxWidth: "600px",
//           //     margin: "auto",
//           //     padding: "10px 10px 0",
//           //   }}
//           // >
//           //   {departmentValues.map((field) => (
//           //     <div
//           //       key={field.id}
//           //       style={{
//           //         border: "1px solid #d9d9d9",
//           //         borderRadius: "5px",
//           //         padding: "20px",
//           //         marginBottom: "20px",
//           //       }}
//           //     >
//           //       <Form.Item
//           //         name={`departmentName_${field.id}`}
//           //         label="Department Name"
//           //         rules={[
//           //           { required: true, message: "Please select a department!" },
//           //         ]}
//           //       >
//           //         <Select
//           //           placeholder="Select Department"
//           //           value={field.departmentName}
//           //           onChange={(value) =>
//           //             handleDepartmentSelectChange(
//           //               value,
//           //               "departmentName",
//           //               field.id
//           //             )
//           //           }
//           //         >
//           //           <Option value="sales">Sales</Option>
//           //           <Option value="hr">HR</Option>
//           //           <Option value="it">IT</Option>
//           //           <Option value="finance">Finance</Option>
//           //           <Option value="other">Other</Option>
//           //         </Select>
//           //       </Form.Item>

//           //       {field.isOther && (
//           //         <Form.Item
//           //           name={`customDepartment_${field.id}`}
//           //           label="Custom Department Name"
//           //           rules={[
//           //             {
//           //               required: true,
//           //               message: "Please enter a custom department name!",
//           //             },
//           //           ]}
//           //         >
//           //           <Input
//           //             name={`customDepartment`}
//           //             value={field.customDepartment}
//           //             onChange={(e) => handleDepartmentInputChange(e, field.id)}
//           //           />
//           //         </Form.Item>
//           //       )}

//           //       <Form.Item
//           //         name={`departmentCode_${field.id}`}
//           //         label="Department Code (optional)"
//           //       >
//           //         <Input
//           //           name={`departmentCode`}
//           //           placeholder="Enter department code"
//           //           value={field.departmentCode}
//           //           onChange={(e) => handleDepartmentInputChange(e, field.id)}
//           //         />
//           //       </Form.Item>

//           //       {departmentValues.length > 1 && (
//           //         <Button
//           //           type="text"
//           //           danger
//           //           icon={<DeleteOutlined />}
//           //           onClick={() => removeDepartmentField(field.id)}
//           //         >
//           //           Delete
//           //         </Button>
//           //       )}
//           //     </div>
//           //   ))}

//           //   <div style={{ display: "flex", justifyContent: "space-between" }}>
//           //     <Form.Item>
//           //       <Button
//           //         type="primary"
//           //         style={{ width: "100px" }}
//           //         onClick={() => setStep(1)}
//           //       >
//           //         Back
//           //       </Button>
//           //     </Form.Item>

//           //     <Form.Item>
//           //       <Button
//           //         type="primary"
//           //         style={{
//           //           width: "150px",
//           //           color: "black",
//           //           backgroundColor: "lightblue",
//           //         }}
//           //         onClick={addDepartmentField}
//           //       >
//           //         Add Department +
//           //       </Button>
//           //     </Form.Item>

//           //     <Form.Item>
//           //       <Button
//           //         type="primary"
//           //         htmlType="submit"
//           //         style={{ width: "100px" }}
//           //       >
//           //         Finish
//           //       </Button>
//           //     </Form.Item>
//           //   </div>
//           // </Form> */}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   companyData: state.company,
//   departmentData: state.department,
// });

// const mapDispatchToProps = (dispatch) => ({
//   addCompany: (values) => dispatch(addcompany(values)),
//   addDepartment: (values) => dispatch(addDepartment(values)),
// });

// AccountSetup.propTypes = {
//   addCompany: PropTypes.func,
//   addDepartment: PropTypes.func,
//   companyData: PropTypes.object,
//   departmentData: PropTypes.object,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(AccountSetup);

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Modal, Input, Form, message, Select, Row, Col } from "antd";
import { industryTypes } from "../../utils/industryType";
import { addcompany } from "../../redux/Add-company/company.action";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDepartment } from "../../redux/Add-department/department.action";
import Image from "../../assets/company-details-image.jpeg";
import "./style.css";

const { Option } = Select;

const countryStateMapping = {
  "United States": ["California", "Texas", "Florida", "New York"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Qatar: ["Doha", "Al Rayyan", "Al Wakrah"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Dammam"],
  Bahrain: ["Manama", "Riffa", "Muharraq"],
  Kuwait: ["Hawalli", "Salmiya", "Farwaniya"],
};

const AccountSetup = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    companyName: "",
    industryType: "",
    customIndustry: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
    ein: "",
    businessSize: "",
    country: "",
  });
  const [isOtherIndustry, setIsOtherIndustry] = useState(false); // For 'Other' Industry Type
  const [departmentValues, setDepartmentValues] = useState([
    {
      id: Date.now(),
      departmentName: "",
      customDepartment: "",
      departmentCode: "",
      isOther: false,
    },
  ]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormValues({
      companyName: "",
      industryType: "",
      customIndustry: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      phoneNumber: "",
      ein: "",
      businessSize: "",
    });
    setDepartmentValues([
      ...departmentValues,
      {
        id: Date.now(),
        departmentName: "",
        customDepartment: "",
        departmentCode: "",
      },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "industryType") {
      setIsOtherIndustry(value === "other");
    }
  };

  const handleAccountSubmit = () => {
    props.addCompany({
      userId: userInfo._id,
      companyName: formValues.companyName,
      industryType:
        formValues.industryType === "other"
          ? formValues.customIndustry
          : formValues.industryType,
      address1: formValues.address1,
      address2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      zipcode: formValues.zipcode,
      phoneNumber: formValues.phoneNumber,
      ein: formValues.ein,
      businessSize: formValues.businessSize,
      country: formValues.country,
    });
  };

  useEffect(() => {
    if (props.companyData.addCompanyResponse) {
      let data = props.companyData.addCompanyResponse;
      if (data.success) {
        message.success("Account details added successfully!");
        // let companyId = data.company._id;
        // let localStorageData = userInfo;
        // localStorageData.companyId = companyId;
        // Save the updated data back to local storage
        // localStorage.setItem("userInfo", JSON.stringify(localStorageData));
        let userData = data.user;
        // Save the updated data back to local storage
        localStorage.setItem("userInfo", JSON.stringify(userData));
        handleCancel();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.companyData.addCompanyResponse]);

  // useEffect(() => {
  //   if (props.departmentData.addDepartmentResponse) {
  //     let data = props.departmentData.addDepartmentResponse;
  //     if (data.success) {
  //       message.success("Department details added successfully!");
  //       handleCancel();
  //     }
  //     if (data.user) {
  //       let setupComplete = data.user.isSetupComplete;
  //       let localStorageData = userInfo;
  //       localStorageData.isSetupComplete = setupComplete;
  //       // Save the updated data back to local storage
  //       localStorage.setItem("userInfo", JSON.stringify(localStorageData));
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.departmentData.addDepartmentResponse]);

  useEffect(() => {
    let data = props.showModal;
    if (!data) {
      setIsModalVisible(true);
    }
  }, []);

  return (
    <div className="company-setup-main-container">
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false} // Prevents modal dismissal on outside click
        closable={false} // Removes the close button
        className="company-setup-modal"
        width={"80%"}
        style={{ top: "20px" }}
      >
        <div className="company-setup-container">
          <div className="company-setup-image-container">
            <img
              className="company-setup-image"
              src={Image}
              alt="Add Company Details Image"
            />
          </div>
          <Form
            layout="vertical"
            onFinish={handleAccountSubmit}
            className="company-setup-form-container"
          >
            {/* Company Name */}
            <Form.Item
              name="companyName"
              rules={[
                { required: true, message: "Please input your company name!" },
              ]}
            >
              <Input
                placeholder="Company Name"
                className="company-setup-input"
                name="companyName"
                value={formValues.companyName}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Industry Type */}
            <Form.Item
              name="industryType"
              rules={[
                {
                  required: true,
                  message: "Please select your industry type!",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Industry Type"
                value={formValues.industryType}
                onChange={(value) => handleSelectChange(value, "industryType")}
              >
                {industryTypes.map((industry) => (
                  <Option key={industry.value} value={industry.value}>
                    {industry.label}
                  </Option>
                ))}
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {/* Show input for 'Other' Industry */}
            {isOtherIndustry && (
              <Form.Item
                name="customIndustry"
                rules={[
                  {
                    required: true,
                    message: "Please specify your industry!",
                  },
                ]}
              >
                <Input
                  placeholder="Industry Type Name"
                  className="company-setup-input"
                  name="customIndustry"
                  value={formValues.customIndustry}
                  onChange={handleInputChange}
                />
              </Form.Item>
            )}

            {/* Company Address */}
            <Form.Item
              name="address1"
              rules={[
                {
                  required: true,
                  message: "Please input your company address!",
                },
              ]}
            >
              <Input
                placeholder="Company Address"
                className="company-setup-input"
                name="address1"
                value={formValues.address1}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item name="address2">
              <Input
                placeholder="Company Address 2"
                className="company-setup-input"
                name="address2"
                value={formValues.address2}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* City, Country, State, Zipcode */}
            <Row gutter={16}>
              {/* City */}
              <Col span={6}>
                <Form.Item
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input
                    placeholder="City"
                    className="company-setup-input"
                    name="city"
                    value={formValues.city}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>

              {/* Country */}
              <Col span={6}>
                <Form.Item
                  name="country"
                  rules={[
                    { required: true, message: "Please select a country!" },
                  ]}
                >
                  <Select
                    className="company-setup-input"
                    placeholder="Country"
                    value={formValues.country}
                    onChange={(value) => handleSelectChange(value, "country")}
                  >
                    {Object.keys(countryStateMapping).map((country) => (
                      <Option key={country} value={country}>
                        {country}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* State */}
              <Col span={6}>
                <Form.Item
                  name="state"
                  rules={[
                    { required: true, message: "Please select a state!" },
                  ]}
                >
                  <Select
                    className="company-setup-input"
                    placeholder="State"
                    value={formValues.state}
                    onChange={(value) => handleSelectChange(value, "state")}
                    disabled={!formValues.country} // Disable if no country selected
                  >
                    {(countryStateMapping[formValues.country] || []).map(
                      (state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>

              {/* Zipcode */}
              <Col span={6}>
                <Form.Item
                  name="zipcode"
                  rules={[
                    { required: true, message: "Please input your zipcode!" },
                    {
                      pattern: /^\d{5}(-\d{4})?$/, // Regex for US ZIP codes (5 digits, optional 4 digits)
                      message: "Please enter a valid ZIP code!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Zip"
                    className="company-setup-input"
                    name="zipcode"
                    value={formValues.zipcode}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Phone Number */}
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  pattern: /^[0-9]{10,15}$/, // Allows only digits with a length of 10 to 15
                  message: "Please enter a valid phone number (10-15 digits)!",
                },
              ]}
            >
              <Input
                placeholder="Phone Number"
                className="company-setup-input"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Company Registration Number/EIN */}
            <Form.Item name="ein">
              <Input
                placeholder="Company Registration Number/EIN"
                className="company-setup-input"
                name="ein"
                value={formValues.ein}
                onChange={handleInputChange}
              />
            </Form.Item>

            {/* Business size */}
            <Form.Item
              name="businessSize"
              rules={[
                {
                  required: true,
                  message: "Please select your business size!",
                },
              ]}
            >
              <Select
                className="company-setup-input"
                placeholder="Business Size"
                value={formValues.businessSize}
                onChange={(value) => handleSelectChange(value, "businessSize")}
              >
                <Option value="small">Up to 10 Employees</Option>
                <Option value="medium">10 - 49 Employees</Option>
                <Option value="large">50 - 249 Employees</Option>
                <Option value="extra-large">250 + Employees</Option>
              </Select>
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                className="company-setup-button"
              >
                Finish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companyData: state.company,
  departmentData: state.department,
});

const mapDispatchToProps = (dispatch) => ({
  addCompany: (values) => dispatch(addcompany(values)),
  addDepartment: (values) => dispatch(addDepartment(values)),
});

AccountSetup.propTypes = {
  addCompany: PropTypes.func,
  addDepartment: PropTypes.func,
  companyData: PropTypes.object,
  departmentData: PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountSetup);
