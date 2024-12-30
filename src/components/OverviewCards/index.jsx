// import React, { useState } from "react";
// import UserIcon from "../../assets/user-icon.svg";
// import LeavePolicyIcon from "../../assets/leave-policy-icon.svg";
// import ProjectIcon from "../../assets/project-icon.svg";
// import EventIcon from "../../assets/event-icon.svg";
// import PayrollIcon from "../../assets/payroll-icon.svg";
// import LearningIcon from "../../assets/learning-icon.svg";
// import DepartmentIcon from "../../assets/department-icon.svg";
// import VerticalDots from "../../assets/verticalDots.svg";
// import QuickMenuIcon from "../../assets/quick-menu-icon.svg";
// import "./style.css";
// import { Modal } from "antd";

// function OverviewCards(props) {
//   const [departmentModalOpen, setDepartmentModalOpen] = useState(false);

//   const openDepartmentModal = () => setDepartmentModalOpen(true);
//   const closeDepartmentModal = () => setDepartmentModalOpen(false);

//   const cardData = [
//     {
//       icon: UserIcon,
//       backgoundColor: "#1F74EC33",
//       title: "Add Employees",
//       description: "Add New/ Existing Employees",
//       // eslint-disable-next-line react/prop-types
//       onClick: () => props.addEmployees(true),
//     },
//     {
//       icon: LeavePolicyIcon,
//       backgoundColor: "#1FEC304D",
//       title: "Setup leave policy",
//       description: "Add or edit leave policy",
//       // eslint-disable-next-line react/prop-types
//       onClick: () => props.leavePolicy(true),
//     },
//     {
//       icon: ProjectIcon,
//       backgoundColor: "#ED1C244D",
//       title: "Add project",
//       description: "Add project for employees",
//     },
//     {
//       icon: EventIcon,
//       backgoundColor: "#FFCB0533",
//       title: "Add Event",
//       description: "Add / edit/ invitation of events",
//     },
//     {
//       icon: PayrollIcon,
//       backgoundColor: "#F3B4B7",
//       title: "Add payroll",
//       description: "Manage payroll details",
//     },
//     {
//       icon: LearningIcon,
//       backgoundColor: "#CADBF3",
//       title: "Add learning",
//       description: "Add learning rsources",
//     },
//     {
//       icon: UserIcon,
//       backgoundColor: "#1F74EC33",
//       title: "Send offer letter",
//       description: "Create,edit,view offer letters",
//     },
//     {
//       icon: DepartmentIcon,
//       backgoundColor: "#F3B4B7",
//       title: "Add Department",
//       description: "Add News Departments",
//       onClick: openDepartmentModal,
//     },
//   ];
//   return (
//     <div style={{ padding: "20px" }}>
//       {/* Horizontal scrolling container */}
//       <div className="overview-cards-container">
//         {cardData.map((card, index) => (
//           <div
//             key={index}
//             className="overview-card"
//             onClick={card.onClick}
//             style={{ cursor: card.onClick ? "pointer" : "default" }}
//           >
//             <div className="card-items-wrapper">
//               <div
//                 className="card-icon-container"
//                 style={{ backgroundColor: card.backgoundColor }}
//               >
//                 <img className="card-icon" src={card.icon} alt={card.title} />
//               </div>
//               <div>
//                 <div className="card-title">{card.title}</div>
//                 <div className="card-description">{card.description}</div>
//               </div>
//             </div>
//             <div style={{ marginTop: "15px" }}>
//               <img src={VerticalDots} alt="Vertical dots" />
//             </div>
//           </div>
//         ))}
//         <div className="overview-card">
//           <div className="quick-menu-card">
//             <img src={QuickMenuIcon} alt="Quick Menu" />
//             <div className="quick-menu">Add Quickmenu</div>
//           </div>
//         </div>
//       </div>
//       {/* Modal */}
//       <Modal isOpen={departmentModalOpen} onClose={closeDepartmentModal}>
//         <h2>Add Department</h2>
//         <form>
//           <div>
//             <label>Department Name:</label>
//             <input type="text" placeholder="Enter department name" />
//           </div>
//           <button type="submit">Submit</button>
//         </form>
//       </Modal>
//     </div>
//   );
// }

// export default OverviewCards;

import React, { useState } from "react";
import { Modal } from "antd"; // Ensure Ant Design is installed
import UserIcon from "../../assets/user-icon.svg";
import LeavePolicyIcon from "../../assets/leave-policy-icon.svg";
import ProjectIcon from "../../assets/project-icon.svg";
import EventIcon from "../../assets/event-icon.svg";
import PayrollIcon from "../../assets/payroll-icon.svg";
import LearningIcon from "../../assets/learning-icon.svg";
import DepartmentIcon from "../../assets/department-icon.svg";
import VerticalDots from "../../assets/verticalDots.svg";
import QuickMenuIcon from "../../assets/quick-menu-icon.svg";
import "./style.css";
import AddDeparment from "../AddDeparment";

function OverviewCards(props) {
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);

  const openDepartmentModal = () => setDepartmentModalOpen(true);
  const closeDepartmentModal = () => setDepartmentModalOpen(false);

  const cardData = [
    {
      icon: UserIcon,
      backgoundColor: "#1F74EC33",
      title: "Add Employees",
      description: "Add New/ Existing Employees",
      // eslint-disable-next-line react/prop-types
      onClick: () => props.addEmployees && props.addEmployees(true),
    },
    {
      icon: LeavePolicyIcon,
      backgoundColor: "#1FEC304D",
      title: "Setup leave policy",
      description: "Add or edit leave policy",
      // eslint-disable-next-line react/prop-types
      onClick: () => props.leavePolicy && props.leavePolicy(true),
    },
    {
      icon: ProjectIcon,
      backgoundColor: "#ED1C244D",
      title: "Add project",
      description: "Add project for employees",
    },
    {
      icon: EventIcon,
      backgoundColor: "#FFCB0533",
      title: "Add Event",
      description: "Add / edit/ invitation of events",
    },
    {
      icon: PayrollIcon,
      backgoundColor: "#F3B4B7",
      title: "Add payroll",
      description: "Manage payroll details",
    },
    {
      icon: LearningIcon,
      backgoundColor: "#CADBF3",
      title: "Add learning",
      description: "Add learning resources",
    },
    {
      icon: UserIcon,
      backgoundColor: "#1F74EC33",
      title: "Send offer letter",
      description: "Create, edit, view offer letters",
    },
    {
      icon: DepartmentIcon,
      backgoundColor: "#F3B4B7",
      title: "Add Department",
      description: "Add New Departments",
      onClick: openDepartmentModal,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Horizontal scrolling container */}
      <div className="overview-cards-container">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="overview-card"
            onClick={card.onClick}
            style={{ cursor: card.onClick ? "pointer" : "default" }}
          >
            <div className="card-items-wrapper">
              <div
                className="card-icon-container"
                style={{ backgroundColor: card.backgoundColor }}
              >
                <img className="card-icon" src={card.icon} alt={card.title} />
              </div>
              <div>
                <div className="card-title">{card.title}</div>
                <div className="card-description">{card.description}</div>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <img src={VerticalDots} alt="Vertical dots" />
            </div>
          </div>
        ))}
        <div className="overview-card">
          <div className="quick-menu-card">
            <img src={QuickMenuIcon} alt="Quick Menu" />
            <div className="quick-menu">Add Quickmenu</div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        // title="Add Department"
        visible={departmentModalOpen}
        onCancel={closeDepartmentModal}
        footer={null}
        // width={"90%"}
        // style={{ top: 20 }}
        className="department-setup-modal"
      >
        <AddDeparment closeDepartmentModal={closeDepartmentModal} />
      </Modal>
    </div>
  );
}

export default OverviewCards;
