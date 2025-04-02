import React from "react";
import { Menu } from "antd";
import './style.css'

const SettingsMenu = ({ selectedMenu, setSelectedMenu, menuItems }) => {
  return (
    <Menu
      mode="vertical"
      selectedKeys={[selectedMenu]}
      onClick={(e) => setSelectedMenu(e.key)}
      className="general-settings-menu"
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SettingsMenu;
