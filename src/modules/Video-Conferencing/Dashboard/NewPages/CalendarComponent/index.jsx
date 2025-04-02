/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarIcon from "../../../../../assets/NewIcons/calendar.svg";
import "./CalendarStyles.css"; // Import updated CSS

const localizer = momentLocalizer(moment);

// // Custom Toolbar (Now matches Figma UI)
// const CustomToolbar = ({ label, onNavigate, onViewChange, view }) => {
//   return (
//     <div className="custom-toolbar">
//       {/* Left Section (Today & Navigation) */}
//       <div className="toolbar-left">
//         <button className="today-btn" onClick={() => onNavigate("TODAY")}>
//           Today
//         </button>
//         <button className="nav-btn" onClick={() => onNavigate("PREV")}>
//           ‹
//         </button>
//         <button className="nav-btn" onClick={() => onNavigate("NEXT")}>
//           ›
//         </button>
//         <span className="month-title">{label}</span>
//       </div>

//       <div style={{ display: "flex", gap: "15px" }}>
//         {/* Middle Section (View Switcher) */}
//         <div className="toolbar-center">
//           <button
//             className={`view-btn ${view === "day" ? "active" : ""}`}
//             onClick={() => onViewChange("day")}
//           >
//             Day
//           </button>
//           <button
//             className={`view-btn ${view === "week" ? "active" : ""}`}
//             onClick={() => onViewChange("week")}
//           >
//             Week
//           </button>
//           <button
//             className={`view-btn ${view === "month" ? "active" : ""}`}
//             onClick={() => onViewChange("month")}
//           >
//             Month
//           </button>
//         </div>

//         {/* Right Section (Schedule a Meeting) */}
//         <button className="schedule-btn" onClick={openScheduleMeetingModal(true)}>
//           <img src={CalendarIcon} alt="icon" /> <span>Schedule a Meeting</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// const CustomTimeGutterHeader = ({ view }) => {
//   return view === "month" ? null : (
//     <div className="custom-time-gutter">GMT</div>
//   );
// };

const CalendarComponent = ({openScheduleMeetingModal}) => {
  const [view, setView] = useState(Views.WEEK); // Default to week view
  const [events, setEvents] = useState([
    {
      title: "Meeting Title",
      start: new Date(new Date().setHours(16, 0, 0, 0)), // Today at 4:00 PM
      end: new Date(new Date().setHours(17, 0, 0, 0)), // Today at 5:00 PM
    },
  ]);

  // Custom Toolbar (Now matches Figma UI)
  const CustomToolbar = ({ label, onNavigate, onViewChange, view }) => {
    return (
      <div className="custom-toolbar">
        {/* Left Section (Today & Navigation) */}
        <div className="toolbar-left">
          <button className="today-btn" onClick={() => onNavigate("TODAY")}>
            Today
          </button>
          <button className="nav-btn" onClick={() => onNavigate("PREV")}>
            ‹
          </button>
          <button className="nav-btn" onClick={() => onNavigate("NEXT")}>
            ›
          </button>
          <span className="month-title">{label}</span>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          {/* Middle Section (View Switcher) */}
          <div className="toolbar-center">
            <button
              className={`view-btn ${view === "day" ? "active" : ""}`}
              onClick={() => onViewChange("day")}
            >
              Day
            </button>
            <button
              className={`view-btn ${view === "week" ? "active" : ""}`}
              onClick={() => onViewChange("week")}
            >
              Week
            </button>
            <button
              className={`view-btn ${view === "month" ? "active" : ""}`}
              onClick={() => onViewChange("month")}
            >
              Month
            </button>
          </div>

          {/* Right Section (Schedule a Meeting) */}
          <button
            className="schedule-btn"
            onClick={() => openScheduleMeetingModal(true)}
          >
            <img src={CalendarIcon} alt="icon" />{" "}
            <span>Schedule a Meeting</span>
          </button>
        </div>
      </div>
    );
  };

  const CustomTimeGutterHeader = ({ view }) => {
    return view === "month" ? null : (
      <div className="custom-time-gutter">GMT</div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        views={["day", "week", "month"]}
        showMultiDayTimes={true} // Prevents all-day event row from reserving space
        step={60} // Step interval of 30 minutes
        timeslots={1} // Ensures correct spacing in week/day views
        components={{
          toolbar: (props) => (
            <CustomToolbar {...props} onViewChange={setView} view={view} />
          ),
          timeGutterHeader: (props) => <CustomTimeGutterHeader view={view} />,
        }}
        style={{
          height: "80vh",
          borderRadius: "10px",
          padding: "10px",
        }}
      />
    </div>
  );
};

export default CalendarComponent;
