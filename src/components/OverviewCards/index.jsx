import React from "react";
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

function OverviewCards(props) {
  const cardData = [
    {
      icon: UserIcon,
      backgoundColor: "#1F74EC33",
      title: "Add Employees",
      description: "Add New/ Existing Employees",
      // eslint-disable-next-line react/prop-types
      onClick: () => props.addEmployees(true),
    },
    {
      icon: LeavePolicyIcon,
      backgoundColor: "#1FEC304D",
      title: "Setup leave policy",
      description: "Add or edit leave policy",
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
      description: "Add learning rsources",
    },
    {
      icon: UserIcon,
      backgoundColor: "#1F74EC33",
      title: "Send offer letter",
      description: "Create,edit,view offer letters",
    },
    {
      icon: DepartmentIcon,
      backgoundColor: "#F3B4B7",
      title: "Add Department",
      description: "Add News Departments",
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
    </div>
  );
}

export default OverviewCards;
