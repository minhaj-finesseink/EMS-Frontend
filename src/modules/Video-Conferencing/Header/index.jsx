import React from "react";
import { Avatar, Input } from "antd";
import SearchIcon from "../../../assets/Icons/search.svg";
import notification from "../../../assets/Icons/notification.svg";
import "./style.css";

function Header() {
  return (
    <div className="video-header">
      <div className="video-header-left">
        <div>
          <Input
            prefix={
              <img
                src={SearchIcon}
                alt="search"
                style={{ width: 16, height: 16 }}
              />
            }
            placeholder="Search"
            style={{ height: 38, width: 500 }}
          />
        </div>
      </div>
      <div className="video-header-right">
        <img src={notification} alt="notification" />
        <Avatar  />
      </div>
    </div>
  );
}

export default Header;
