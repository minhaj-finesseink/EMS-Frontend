import React from "react";
import "./style.css";
import CircularProgress from "../../utils/progressBar";

function AttendanceAndPayroll() {
  return (
    <div className="main-container">
      <div style={{ width: "50%" }}>
        <span>Attendance today</span>
        <div className="attendance-card">
          <div>
            <div style={{ fontSize: "20px", color: "#46B544" }}>218</div>
            <div style={{fontSize:'15px',fontWeight:600}}>Reported Employees</div>
            <div style={{ fontSize: "20px", color: "#46B544" }}>20</div>
            <div style={{fontSize:'15px',fontWeight:600}}>Employees on leave</div>
          </div>
          <div>
            <CircularProgress />
          </div>
        </div>
      </div>
      <div style={{ width: "50%" }}>
        <span>Payroll overview</span>
        <div className="attendance-card2">
          <div>
            <div style={{ fontSize: "20px", color: "#46B544" }}>$3,230,250</div>
            <div style={{fontSize:'15px',fontWeight:600}}>Monthly Payroll</div>
            <div style={{ fontSize: "20px", color: "#46B544" }}>$3,23.00</div>
            <div style={{fontSize:'15px',fontWeight:600}}>Overtime</div>
          </div>
          <div>
            <CircularProgress />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceAndPayroll;
