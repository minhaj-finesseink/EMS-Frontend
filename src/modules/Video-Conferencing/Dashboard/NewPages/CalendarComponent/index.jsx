/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarIcon from "../../../../../assets/NewIcons/calendar.svg";
import "./CalendarStyles.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({
  openScheduleMeetingModal,
  eventsDate,
  setRangeDates,
}) => {
  const [view, setView] = useState(Views.WEEK); // Default to week view
  const [events, setEvents] = useState([]);

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const handleRangeChange = (range) => {
    let startDate, endDate;

    if (Array.isArray(range)) {
      // For 'week' and 'day' views
      startDate = range[0];
      endDate = range[range.length - 1];
    } else if (typeof range === "object" && range.start && range.end) {
      // For 'month' view
      startDate = range.start;
      endDate = range.end;
    }

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    setRangeDates({ start: formattedStart, end: formattedEnd });
  };

  useEffect(() => {
    // Trigger range change logging on initial mount
    const now = new Date();
    if (view === "week") {
      const start = moment(now).startOf("week").toDate();
      const end = moment(now).endOf("week").toDate();
      handleRangeChange([start, end]);
    } else if (view === "month") {
      const start = moment(now).startOf("month").toDate();
      const end = moment(now).endOf("month").toDate();
      handleRangeChange({ start, end });
    } else if (view === "day") {
      handleRangeChange([now]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

   // 🔄 Update events when eventsDate changes
   useEffect(() => {
    if (eventsDate) {
      if (Array.isArray(eventsDate)) {
        const mapped = eventsDate.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(mapped);
      } else if (eventsDate.start && eventsDate.end) {
        setEvents([
          {
            ...eventsDate,
            start: new Date(eventsDate.start),
            end: new Date(eventsDate.end),
          },
        ]);
      }
    }
  }, [eventsDate]);

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
        // onView={setView}
        views={["day", "week", "month"]}
        showMultiDayTimes={true} // Prevents all-day event row from reserving space
        step={60} // Step interval of 30 minutes
        timeslots={1} // Ensures correct spacing in week/day views
        onRangeChange={handleRangeChange}
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
