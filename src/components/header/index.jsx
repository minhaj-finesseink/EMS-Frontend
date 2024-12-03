import React, { useState, useEffect } from "react";
import "./style.css";
import { Input, Badge, Space } from "antd";
import {
  BulbOutlined,
  BellOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header" style={styles.headerContainer}>
      <div style={styles.searchContainer}>
        <Search
          className="custom-search"
          placeholder="input search text"
          onSearch={onSearch}
          bordered={false} // To remove the border of the input
        />
      </div>
      <div style={styles.topBarContainer}>
        <Space size="large">
          <BulbOutlined style={styles.icon} />
          <Badge count={1}>
            <BellOutlined style={styles.icon} />
          </Badge>
          <SettingOutlined style={styles.icon} />
        </Space>
        {/* Language and Time */}
        <Space size="middle">
          <span style={styles.languageContainer}>
            <GlobalOutlined style={styles.icon} />
            ENG
          </span>
          <span>
            {currentTime.toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </Space>
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderRadius: "8px",
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px",
    border: "1px solid #D9D9D9",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    height: "100px",
    width: "50%",
  },
  topBarContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
  icon: {
    fontSize: "18px",
    color: "#606770",
    cursor: "pointer",
  },
  languageContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
    color: "#606770",
  },
};

export default Header;
