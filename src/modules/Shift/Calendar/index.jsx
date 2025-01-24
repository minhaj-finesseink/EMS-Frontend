/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Dropdown, Form, Menu, Modal } from "antd";
import {
  ClockCircleOutlined,
  DownOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import AddShiftIcon from "../../../assets/add-shift-icon.svg";
import MembersIcon from "../../../assets/members-icon.svg";
import AddUser from "../../../assets/add-user.svg";
import AddUser1 from "../../../assets/add-user-settings.svg";
import ExistingEmployee from "../../../components/ExistingEmployee";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddShiftModal from "../AddShiftModal";
import { getAllShift } from "../../../redux/ShiftAPIs/Shift/shift.action";
import CustomButton from "../../../components/CustomButton";
import PasteTable from "../ExcelPasteTable";
import AddUsersUsitiveHr from "../AddUserUsitiveHR";
import "./style.css";

const Calendar = (props) => {
  const [form] = Form.useForm();
  const menu = (
    <Menu
      items={[
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ]}
    />
  );

  const [weekDates, setWeekDates] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [activeView, setActiveView] = useState("Week");
  const [todaysShifts, setTodaysShifts] = useState([]);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [addIndividualMember, setAddIndividualMember] = useState(false);
  const [addUsitiveHr, setAddUsitiveHr] = useState(false);
  const [addshiftModal, setAddShiftModal] = useState(false);
  const [addShiftPopupDetails, setAddShiftPopupDetails] = useState({
    employeeId: "",
    employeeName: "",
  });
  const [addBulkEmployeeModal, setAddBulkEmployeeModal] = useState(false);
  const [openExcelTableModal, setOpenExcelTableModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([
    "First Name",
    "Last Name",
    "Email",
  ]); // Default checked fields

  const extractTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const extractDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toISOString().split("T")[0];
  };

  const processDateTime = (startTime, endTime) => {
    const formatDateTime = (dateTime) => {
      const date = new Date(dateTime);
      const formattedDate = date.toISOString().split("T")[0]; // Extract date (yyyy-mm-dd)
      const formattedTime = `${String(date.getHours()).padStart(
        2,
        "0"
      )}:${String(date.getMinutes()).padStart(2, "0")}`; // Extract time (hh:mm)
      return { date: formattedDate, time: formattedTime };
    };

    const calculateTimeDifference = (start, end) => {
      const diffInMilliseconds = new Date(end) - new Date(start);
      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { hours, minutes };
    };

    const startDetails = formatDateTime(startTime);
    const endDetails = formatDateTime(endTime);
    const timeDifference = calculateTimeDifference(startTime, endTime);

    return {
      start: startDetails,
      end: endDetails,
      difference: timeDifference,
    };
  };

  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString().split("T")[0],
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    setWeekDates(week);
    const todayDate = new Date().toISOString().split("T")[0];
    const todaysShiftData = shifts.flatMap((employee) =>
      employee.shifts
        .filter((shift) => extractDate(shift.startTime) === todayDate)
        .map((shift) => ({
          employee: employee.name,
          department: employee.department,
          shiftName: employee.shiftName,
          ...shift,
        }))
    );

    setTodaysShifts(todaysShiftData);
  }, [shifts]);

  const shiftColors = ["#AADDC4", "#F8F3D6", "#CCE5F3"];

  const getShiftForDay = (shiftList, date, index, isLastShift, employee) => {
    const shift = shiftList.find((s) => s.startTime.split("T")[0] === date);

    const editShift =
      employee.shifts && employee.shifts.length > 0
        ? {
            employeeId: employee._id,
            employeeName: employee.name,
            shiftId: shift ? shift._id : "",
            shiftName: shift ? shift.shiftName : "",
            startTime: shift ? shift.startTime : "",
            endTime: shift ? shift.endTime : "",
            paidBreak: shift ? shift.paidBreak : "",
            unpaidBreak: shift ? shift.unpaidBreak : "",
            shiftNotes: shift ? shift.shiftNotes : "",
            repeat: shift ? shift.repeat : "",
            repeatPeriod: shift ? shift.repeatPeriod : "",
            repeatExpire: shift ? shift.repeatExpire : "",
            repeatDays: shift ? shift.repeatDays : "",
          }
        : {
            employeeId: employee._id,
            employeeName: employee.name,
          };

    const backgroundColor = shiftColors[index % shiftColors.length]; // Cycle through colors
    const startTime = shift ? shift.startTime : "";
    const endTime = shift ? shift.endTime : "";

    return shift ? (
      <div
        className="shift"
        style={{ backgroundColor: backgroundColor }}
        onClick={() => {
          setAddShiftModal(true);
          // Update the state with employee details
          setAddShiftPopupDetails(editShift);
        }}
      >
        <div className="time" style={{ color: "#5D5669" }}>
          {shift.shiftName}
        </div>
        <div className="time">
          {extractTime(startTime) + " - " + extractTime(endTime)}
        </div>
        <div className="hours">
          <ClockCircleOutlined />
          {processDateTime(startTime, endTime).difference.hours}h
        </div>
      </div>
    ) : isLastShift ? (
      <div className="shift-slot">
        <Button
          style={{ border: "1.5px dashed", width: "100px" }}
          onClick={() => {
            setAddShiftModal(true);
            // Update the state with employee details
            setAddShiftPopupDetails({
              employeeId: employee._id,
              employeeName: employee.name,
            });
          }}
        >
          {" "}
          <img src={AddShiftIcon} alt="add shift icon" />{" "}
        </Button>
      </div>
    ) : null;
  };

  const handleToggle = (view) => {
    setActiveView(view);
  };

  const closeAddEmployeeModal = () => {
    setAddEmployeeModal(false);
  };

  useEffect(() => {
    // props.getUserByCompanyId(userInfo.companyId);
    const format =
      activeView === "Today"
        ? "daily"
        : activeView === "Week"
        ? "weekly"
        : activeView === "Month"
        ? "monthly"
        : "";
    props.getAllShift(format);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeView,
    props.shiftData.addShiftResponse,
    props.shiftData.deleteShiftByIdResponse,
    props.shiftData.updateShiftByIdResponse,
  ]);

  useEffect(() => {
    if (props.shiftData.getAllShiftResponse) {
      let data = props.shiftData.getAllShiftResponse;
      // console.log("log", data.shifts);
      setShifts(data.shifts);
    }
  }, [props.shiftData.getAllShiftResponse]);

  const handleAddShiftModalCancel = () => {
    setAddShiftModal(false); // Close the modal
    form.resetFields(); // Reset form fields
  };

  // Update the state when checkboxes are toggled
  const handleFieldSelectionChange = (field, checked) => {
    setSelectedFields((prev) =>
      checked ? [...prev, field] : prev.filter((f) => f !== field)
    );
  };

  return (
    <div className="shift-calendar-container">
      {addIndividualMember ? (
        // "add Individual Member"
        <ExistingEmployee
          addIndividualMember={setAddIndividualMember}
          module={"shift"}
        />
      ) : addUsitiveHr ? (
        // Add users - Usitive HR
        <AddUsersUsitiveHr />
      ) : (
        <>
          <div className="calendar-header-section">
            <div className="calendar-left">
              <div className="calendar-title">Add Shift</div>
              <div className="calendar-desc">
                Add and manage employee shifts
              </div>
            </div>
            <div className="calendar-right">
              <div className="toggle-buttons">
                {["Today", "Week", "Month"].map((view) => (
                  <Button
                    key={view}
                    onClick={() => handleToggle(view)}
                    style={{
                      padding: "5px 15px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor:
                        activeView === view ? "#009A4E" : "transparent",
                      color: activeView === view ? "#fff" : "#555",
                      border: "none",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                      width: "100px",
                    }}
                  >
                    {view}
                  </Button>
                ))}
              </div>
              <Button
                className="shift-add-employee-button"
                onClick={() => setAddEmployeeModal(true)}
              >
                + Add Employees
              </Button>
            </div>
            <Modal
              visible={addEmployeeModal}
              onCancel={closeAddEmployeeModal}
              footer={null}
              className="shift-add-employee-modal"
              width={750}
            >
              <div className="shift-add-user-container">
                {/* Add individual team memeber */}
                <div
                  className="shift-add-user-box"
                  style={{ backgroundColor: "#2A93CFCC", color: "#FFFFFF" }}
                  onClick={() => {
                    setAddIndividualMember(true), setAddEmployeeModal(false);
                  }}
                >
                  <div
                    className="shift-add-user-box-icon"
                    style={{ backgroundColor: "#007DC5" }}
                  >
                    {" "}
                    <img
                      style={{ height: "20px" }}
                      src={AddUser}
                      alt="add user icon"
                    />
                  </div>
                  <div style={{ lineHeight: 1 }}>
                    Add individual team member
                  </div>
                </div>
                {/* Add bulk */}
                <>
                  <div
                    className="shift-add-user-box"
                    style={{ backgroundColor: "#2AAB6C", color: "#FFFFFF" }}
                    onClick={() => {
                      // setAddEmployeeModal(false),
                      setAddBulkEmployeeModal(true);
                    }}
                  >
                    <div
                      className="shift-add-user-box-icon"
                      style={{ backgroundColor: "#007DC5" }}
                    >
                      {" "}
                      <img
                        style={{ height: "20px" }}
                        src={AddUser}
                        alt="add user icon"
                      />
                    </div>
                    <div style={{ lineHeight: 1 }}>
                      Add team members in bulk{" "}
                    </div>
                  </div>
                  <Modal
                    title="Add Employee"
                    visible={addBulkEmployeeModal}
                    onCancel={() => setAddBulkEmployeeModal(false)}
                    footer={null}
                  >
                    <div className="add-bulk-employee-container">
                      <div className="bulk-navigation">
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#F3686D",
                              borderRadius: "50%",
                              height: "18px",
                              width: "18px",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            1
                          </div>
                          <div
                            style={{
                              fontFamily: "Inter",
                              color: "#F3686D",
                              fontWeight: 700,
                            }}
                          >
                            Select fields
                          </div>
                        </div>
                        <div
                          style={{
                            width: "70px",
                            borderBottom: "1px solid #E0E5EB",
                            height: 0,
                            margin: "10px",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#f9b3b6",
                              borderRadius: "50%",
                              height: "18px",
                              width: "18px",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            2
                          </div>
                          <div
                            style={{
                              fontFamily: "Inter",
                              color: "#f9b3b6",
                              fontWeight: 700,
                            }}
                          >
                            Add data
                          </div>
                        </div>
                      </div>
                      <div className="add-shift-bulk-employee-title">
                        Select the fields that you want to add in bulk
                      </div>
                      <div className="shift-add-bulk-employee-excel-items">
                        <div className="shift-add-bulk-employee-items">
                          <label>
                            <Checkbox
                              checked
                              disabled
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "First Name",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>First Name</span>
                          </label>
                          <label>
                            <Checkbox
                              checked
                              disabled
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "Last Name",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>Last Name</span>
                          </label>
                          <label>
                            <Checkbox
                              checked
                              disabled
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "Email",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>Email</span>
                          </label>
                          <label>
                            <Checkbox
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "Phone",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>Phone</span>
                          </label>{" "}
                          <label>
                            <Checkbox
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "DOB",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>DOB</span>
                          </label>
                          <label>
                            <Checkbox
                              onChange={(e) =>
                                handleFieldSelectionChange(
                                  "Date of Hiring",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            <span>Date of hiring</span>
                          </label>
                        </div>
                      </div>

                      <div className="shift-bulk-employee-btn">
                        <CustomButton
                          color={"grey"}
                          transparent
                          onClick={() => setAddBulkEmployeeModal(false)}
                        >
                          Cancel
                        </CustomButton>
                        <CustomButton
                          color={"blue"}
                          onClick={() => setOpenExcelTableModal(true)}
                        >
                          Add
                        </CustomButton>
                      </div>
                    </div>
                  </Modal>
                  {/* Excel paste table modal */}
                  <Modal
                    visible={openExcelTableModal}
                    // onCancel={() => setOpenExcelTableModal(false)}
                    footer={null}
                    width={"80%"}
                    closable={false}
                  >
                    <div className="shift-add-bulk-from-excel">
                      <PasteTable
                        onCancel={() => setOpenExcelTableModal(false)}
                        selectedFields={selectedFields}
                      />
                    </div>
                  </Modal>
                </>
                {/* Add with usitive */}
                <div
                  className="shift-add-user-box"
                  style={{ backgroundColor: "#FFD42F" }}
                  onClick={() => {
                    setAddUsitiveHr(true), setAddEmployeeModal(false);
                  }}
                >
                  <div
                    className="shift-add-user-box-icon"
                    style={{ backgroundColor: "#E9C025" }}
                  >
                    {" "}
                    <img
                      style={{ height: "20px" }}
                      src={AddUser1}
                      alt="add user icon"
                    />
                  </div>
                  <div style={{ lineHeight: 1 }}>
                    Add with <br /> USITIVE HR
                  </div>
                </div>
              </div>
            </Modal>
          </div>

          <div className="calendar-filter-section">
            {/* Date Range Selector */}
            <div>
              <Button
                className="shift-filter-button"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <LeftOutlined />
                December 22 - 28
                <RightOutlined />
              </Button>
            </div>

            <div className="shift-filter-buttons-container">
              {/* Employee Filter */}
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button className="shift-filter-button">
                  <FilterOutlined style={{ opacity: "0.7" }} /> Employee{" "}
                  <span style={{ fontWeight: "bold" }}>All</span> |{" "}
                  <DownOutlined />
                </Button>
              </Dropdown>

              {/* Department Filter */}
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button className="shift-filter-button">
                  <FilterOutlined style={{ opacity: "0.7" }} /> Department{" "}
                  <span style={{ fontWeight: "bold" }}>All</span> |{" "}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>

          <div className="calendar">
            <div className="calendar-open-shift">
              <div className="open-shifts">Open Shifts(4)</div>
              <div className="add-shift">
                <button className="add-shift-btn">
                  <span style={{ marginRight: "10px" }}>
                    {" "}
                    <img
                      style={{ display: "flex" }}
                      src={AddShiftIcon}
                      alt="add icon"
                    />{" "}
                  </span>
                  Add Shift
                </button>
              </div>
            </div>
            {activeView === "Week" ? (
              <>
                {" "}
                {/* Calendar Header */}
                <div className="calendar-header">
                  <div className="calendar-cell members-column">
                    {" "}
                    <img
                      style={{ marginRight: "5px" }}
                      src={MembersIcon}
                      alt="members icon"
                    />{" "}
                    Members
                  </div>
                  {weekDates.map((day, index) => (
                    <div
                      key={index}
                      className={`calendar-cell week-days-cell ${
                        day.isToday ? "today" : ""
                      }`}
                    >
                      <div className="week-days-day">{day.day}</div>
                      <div className="week-days-date">{day.date}</div>
                    </div>
                  ))}
                </div>
                {/* Calendar Body */}
                <div className="calendar-body">
                  {shifts.map((employee) => {
                    // {
                    //   console.log("employee", employee);
                    // }
                    const lastShiftDayIndex = employee.shifts.length
                      ? Math.max(
                          ...employee.shifts.map((shift) =>
                            weekDates.findIndex(
                              (day) =>
                                day.fullDate === shift.startTime.split("T")[0]
                            )
                          )
                        )
                      : -1; // Default value when shifts is empty

                    return (
                      <div key={employee._id} className="member-row">
                        <div className="calendar-cell member-info">
                          <div className="employee-name">{employee.name}</div>
                          <div className="employee-shift-name">
                            {employee.shiftName}
                          </div>
                          <div className="employee-department">
                            {employee.department}
                          </div>
                        </div>
                        {weekDates.map((day, index) => (
                          <div
                            key={index}
                            className={`calendar-cell employee-shift-time ${
                              index > lastShiftDayIndex
                                ? "add-shift-column"
                                : ""
                            }`}
                          >
                            {getShiftForDay(
                              employee.shifts,
                              day.fullDate,
                              index,
                              index === lastShiftDayIndex + 1,
                              employee
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : activeView === "Today" ? (
              <>
                {" "}
                {/* Today calendar view */}
                <div className="today-calendar-view">
                  <div className="today-shifts">
                    {todaysShifts.length > 0 ? (
                      todaysShifts.map((shift, index) => (
                        <div
                          key={index}
                          className="today-shift"
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                          }}
                        >
                          <Checkbox
                            style={{
                              transform: "scale(1.5)",
                              padding: "20px",
                            }}
                          />

                          <div
                            className="shift-info"
                            style={{
                              backgroundColor:
                                shiftColors[index % shiftColors.length],
                              width: "100%",
                              padding: "25px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                width: "45%",
                              }}
                            >
                              <div className="employee-name">
                                {shift.employee}
                              </div>
                              <div className="employee-shift-name">
                                {shift.shiftName}
                              </div>
                              <div className="employee-department">
                                {shift.department}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{ marginBottom: "5px" }}
                                className="time"
                              >
                                {extractTime(shift.startTime) +
                                  " - " +
                                  extractTime(shift.endTime)}
                              </div>
                              <div className="hours">
                                <ClockCircleOutlined />{" "}
                                {
                                  processDateTime(
                                    shift.startTime,
                                    shift.endTime
                                  ).difference.hours
                                }
                                h
                              </div>
                            </div>
                            <div style={{ marginLeft: "20px" }}>
                              <Button
                                style={{
                                  border: "1.5px dashed",
                                  width: "100px",
                                  backgroundColor:
                                    shiftColors[index % shiftColors.length],
                                  height: "40px",
                                }}
                              >
                                {" "}
                                <img
                                  src={AddShiftIcon}
                                  alt="add shift icon"
                                />{" "}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-shifts">No shifts for today</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Month view
              <>
                {/* Calendar Header */}
                <div className="month-calendar-header">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <div
                        key={index}
                        className="calendar-cell month-days-header"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                {/* Calendar Body */}
                <div className="calendar-body month-view">
                  {(() => {
                    const today = new Date();
                    const startOfMonth = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1
                    );
                    const endOfMonth = new Date(
                      today.getFullYear(),
                      today.getMonth() + 1,
                      0
                    );

                    const startDayOfWeek = startOfMonth.getDay();
                    const daysInMonth = endOfMonth.getDate();

                    const totalCells =
                      Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

                    const daysArray = [];
                    for (let i = 0; i < totalCells; i++) {
                      const date = new Date(
                        startOfMonth.getFullYear(),
                        startOfMonth.getMonth(),
                        i - startDayOfWeek + 1
                      );

                      daysArray.push({
                        date,
                        isToday:
                          date.toDateString() === new Date().toDateString(),
                        isCurrentMonth: date.getMonth() === today.getMonth(),
                      });
                    }

                    return daysArray.map((day, index) => (
                      <div
                        key={index}
                        className={`calendar-cell month-day-cell ${
                          day.isToday ? "today" : ""
                        } ${!day.isCurrentMonth ? "other-month" : ""}`}
                      >
                        <div
                          style={{ fontSize: "24px" }}
                          className="month-day-number"
                        >
                          {day.date.getDate()}
                          {/* {console.log("day", day.date)} */}
                        </div>
                        {/* Filter and Display Shifts for the Current Day */}
                        {shifts.flatMap((employee) =>
                          employee.shifts
                            .filter(
                              (shift) =>
                                new Date(shift.startTime).toDateString() ===
                                day.date.toDateString()
                            )
                            .map((shift, idx) => (
                              <div
                                key={idx}
                                className="shift"
                                style={{
                                  backgroundColor:
                                    shiftColors[
                                      shifts.indexOf(employee) %
                                        shiftColors.length
                                    ],
                                  borderRadius: 0,
                                  textAlign: "center",
                                }}
                              >
                                <div className="time">{employee.name}</div>
                                <div className="hours">
                                  {extractTime(shift.startTime) +
                                    " - " +
                                    extractTime(shift.endTime)}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </>
            )}

            <div className="calendar-footer">
              <button
                className="add-shift-btn"
                onClick={() => setAddEmployeeModal(true)}
              >
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  <img
                    style={{ display: "flex" }}
                    src={AddShiftIcon}
                    alt="add icon"
                  />{" "}
                </span>
                Add Employee
              </button>
            </div>
          </div>
        </>
      )}
      {/* Add shift Modal */}
      <Modal
        visible={addshiftModal}
        // onCancel={() => setAddShiftModal(false)}
        onCancel={handleAddShiftModalCancel}
        footer={null}
      >
        <AddShiftModal
          employeeDetails={addShiftPopupDetails}
          form={form}
          onCancel={handleAddShiftModalCancel}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.user,
  shiftData: state.shift,
});

const mapDispatchToProps = (dispatch) => ({
  getAllShift: (values) => dispatch(getAllShift(values)),
});

Calendar.propTypes = {
  getAllShift: PropTypes.func,
  userData: PropTypes.object,
  shiftData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
