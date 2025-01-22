// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import logo from "../../assets/landing-page-logo.png";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./style.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <div className="landing-page">
      <div className="navigation-bar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="nav-links large-screen">
          <div className="links">Features</div>
          <div className="links">How it works</div>
          <div className="links">Testimonials</div>
          <div className="links">FAQ</div>
        </div>
        <div className="nav-buttons large-screen">
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/sign-in")}
          >
            HR
          </Button>
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/shift-sign-in")}
          >
            Shift
          </Button>
        </div>
        <div className="hamburger-menu small-screen">
          <MenuOutlined onClick={showDrawer} />
        </div>
      </div>
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        className="small-screen-drawer"
      >
        <div className="drawer-links">
          <div className="links">Features</div>
          <div className="links">How it works</div>
          <div className="links">Testimonials</div>
          <div className="links">FAQ</div>
        </div>
        <div className="drawer-buttons">
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/sign-in")}
          >
            HR
          </Button>
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/shift-sign-in")}
          >
            Shift
          </Button>
        </div>
      </Drawer>
      <div className="main-content">
        <div className="content-title">
          Lorem Ipsum is <br /> simply dummy text
        </div>
        <div className="content-desc">
          All-in-one solution for seamless employee management! Join now to
          streamline HR tasks,
          <br /> track performance, and empower your team to succeed.
        </div>
        <div className="content-buttons">
          <Button type="primary" className="content-btn">
            Get Started
          </Button>
          <Button type="primary" className="content-btn">
            Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
