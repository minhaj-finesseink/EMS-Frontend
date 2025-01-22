/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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
import ShiftIcon from "../../assets/shift-icon.svg";
import AddShiftIcon from "../../assets/add-shift-icon.svg";
import MyShiftIcon from "../../assets/my-shift-icon.svg";
import AddDeparment from "../AddDeparment";
import "./style.css";

function OverviewCards(props) {
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const openDepartmentModal = () => setDepartmentModalOpen(true);
  const closeDepartmentModal = () => setDepartmentModalOpen(false);

  const openShiftModal = () => setShiftModalOpen(true);
  const closeShiftModal = () => setShiftModalOpen(false);

  const cardData = userInfo.isShiftActive
    ? [
        // Only show the Shift card
        {
          icon: ShiftIcon,
          backgoundColor: "#1F74EC33",
          title: "Shift",
          description: "Manage and track shifts",
          onClick: openShiftModal,
        },
      ]
    : [
        // Show other cards if isShiftActive is false
        ...(!userInfo.isProfileComplete
          ? [
              {
                icon: UserIcon,
                backgoundColor: "#FFD70033",
                title: "Complete Your Profile",
                description: "Fill out your profile details",
                onClick: () =>
                  props.profileComplete && props.profileComplete(true),
              },
            ]
          : []),
        {
          icon: UserIcon,
          backgoundColor: "#1F74EC33",
          title: "Add Employees",
          description: "Add New/ Existing Employees",
          onClick: () => props.addEmployees && props.addEmployees(true),
        },
        {
          icon: LeavePolicyIcon,
          backgoundColor: "#1FEC304D",
          title: "Setup leave policy",
          description: "Add or edit leave policy",
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

  const shiftCardData = [
    {
      icon: AddShiftIcon, // Replace with correct icon
      backgoundColor: "#B29A2F",
      title: "Add/Edit Shift",
      description: "Add or edit Employee shifts",
      cardBackgroundColor: "#ffcb05",
      cardTitleColor: "#151D48",
      cardDescColor: "#555151",
      onClick: () => {
        if (props.addShift) {
          props.addShift(true);
        }
        closeShiftModal();
      },
    },
    {
      icon: MyShiftIcon, // Replace with correct icon
      backgoundColor: "#346F52",
      title: "My shift",
      description: "Manage your shift",
      onClick: () => console.log("Manage Shifts clicked"),
      cardBackgroundColor: "#009a4e",
      cardTitleColor: "#FFFFFF",
      cardDescColor: "#FFFFFF",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Horizontal scrolling container */}
      <div className="overview-cards-container">
        {cardData.map((card, index) => (
          <div
            key={index}
            // className="overview-card"
            className={`overview-card ${
              card.title === "Complete Your Profile" ? "urgent-card" : ""
            }`}
            onClick={card.onClick}
            style={{
              cursor: card.onClick ? "pointer" : "default",
            }}
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
      {/* Department Modal */}
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

      {/* Shift Modal */}
      <Modal
        visible={shiftModalOpen}
        onCancel={closeShiftModal}
        footer={null}
        className="shift-setup-modal"
      >
        <div className="shift-modal-content">
          {shiftCardData.map((card, index) => (
            <div
              key={index}
              className="shift-card"
              onClick={card.onClick}
              style={{
                cursor: "pointer",
                backgroundColor: card.cardBackgroundColor,
              }}
            >
              <div className="card-items-wrapper">
                <div
                  className="card-icon-container"
                  style={{ backgroundColor: card.backgoundColor }}
                >
                  <img className="card-icon" src={card.icon} alt={card.title} />
                </div>
                <div>
                  <div
                    style={{ color: card.cardTitleColor, marginBottom: 0 }}
                    className="card-title"
                  >
                    {card.title}
                  </div>
                  <div
                    style={{ color: card.cardDescColor }}
                    className="card-description"
                  >
                    {card.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default OverviewCards;
