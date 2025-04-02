import React from "react";
import './style.css'

function Header() {
  return (
    <div className="video-header">
      {/* Left Section - Nav Links */}
      <div className="video-nav-links">
        <a href="#" className="video-nav-item">
          Features
        </a>
        <a href="#" className="video-nav-item">
          Resources
        </a>
        <a href="#" className="video-nav-item">
          Solutions
        </a>
        <a href="#" className="video-nav-item">
          Help
        </a>
      </div>
      {/* Right Section - Notification + Profile */}
      <div className="video-nav-right">
        {/* Notification Icon */}
        <button className="video-nav-icon">
          {/* <Bell size={20} strokeWidth={1.5} /> */}
        </button>

        {/* Profile Image */}
        <img
          // src={ProfileImg}
          alt="Profile"
          className="video-profile-img"
        />
      </div>
    </div>
  );
}

export default Header;
