import React from "react";
import { Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LineChartOutlined,
  MoneyCollectOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./style.css";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const items = [
  {
    label: (
      <span style={{ fontSize: "10px", color: "#7F8FA6", fontWeight: 600 }}>
        ADMINISTRATOR
      </span>
    ),
    key: "administrator",
    type: "group",
    children: [
      {
        key: "dashboard",
        icon: <DashboardOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Dashboard</span>
        ),
      },
      {
        key: "employee",
        icon: <UserOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Employee</span>
        ),
      },
      {
        key: "attendance",
        icon: <TeamOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Attendance Data
          </span>
        ),
      },
      {
        key: "performance",
        icon: <LineChartOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Performance</span>
        ),
      },
      {
        key: "payroll",
        icon: <MoneyCollectOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Payroll & Benefits
          </span>
        ),
      },
      {
        key: "tasks",
        icon: <CheckSquareOutlined style={{ color: "#7F8FA6" }} />,
        label: <span style={{ fontSize: "18px", fontWeight: 600 }}>Tasks</span>,
      },
    ],
  },
  {
    label: (
      <span style={{ fontSize: "10px", color: "#7F8FA6", fontWeight: 600 }}>
        SETTINGS
      </span>
    ),
    key: "settings",
    type: "group",
    children: [
      {
        key: "permissions",
        icon: <UserOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Permissions</span>
        ),
      },
      {
        key: "reports",
        icon: <FileTextOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Reports</span>
        ),
      },
      {
        key: "logout",
        icon: <LogoutOutlined style={{ color: "#7F8FA6" }} />,
        label: (
          <span style={{ fontSize: "18px", fontWeight: 600 }}>Logout</span>
        ),
      },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleMenuClick = (menuItem) => {
    const { key } = menuItem;
    const routeMap = {
      dashboard: "/admin-dashboard",
      employee: "/employee",
      attendance: "/attendance",
      performance: "/performance",
      payroll: "/payroll",
      tasks: "/tasks",
      permissions: "/permissions",
      reports: "/reports",
      logout: "/", // Define your logout route
    };
    const route = routeMap[key];
    if (route) navigate(route);
  };

  return (
    <Sider
      width={300}
      style={{
        background: "#fff",
        height: "100%",
        borderRight: "1px solid #D9D9D9",
        padding: "20px",
      }}
    >
      <div
        style={{
          height: 64,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
          paddingTop: "20px",
          color: "#7F8FA6",
        }}
      >
        Logo placeholder
      </div>
      <Menu
        mode="inline"
        style={{
          borderRight: 0,
          borderRadius: 0,
        }}
        items={items}
        defaultSelectedKeys={["dashboard"]}
        theme="light"
        onClick={handleMenuClick}
      />
      <style jsx>{`
        .ant-menu-item {
          color: #7f8fa6 !important;
        }
        .ant-menu-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background-color: #0984e3;
          display: block;
        }

        .ant-menu-item-selected::before {
          width: 5px;
        }

        .ant-menu-item-selected {
          background-color: transparent !important;
          color: #0984e3 !important;
        }

        .ant-menu-item:hover {
          color: #0984e3;
        }
        .ant-menu-item-selected .anticon {
          color: #0984e3 !important;
        }
      `}</style>
      <div className="card">
        <div>
          Customize <br /> Dashboard
        </div>
        <Button
          style={{
            backgroundColor: "rgba(255, 168, 0, 1)",
            width: "100px",
            marginTop: "10px",
          }}
          type="primary"
        >
          Click here
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;