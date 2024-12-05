// import React from "react";
// import { Layout, Button, Typography } from "antd";
// import { useNavigate } from "react-router-dom";
// import "./style.css";

// const { Header, Content, Footer } = Layout;
// const { Title, Paragraph } = Typography;

// const SimpleLandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <Layout className="landing-page">
//       {/* Header Section */}
//       <Header className="landing-header">
//         <div className="logo">EMS</div>
//         <div>
//           <Button type="link" onClick={() => navigate("/sign-in")}>
//             Sign In
//           </Button>
//           <Button type="primary" onClick={() => navigate("/sign-up")}>
//             Sign Up
//           </Button>
//         </div>
//       </Header>

//       {/* Hero Section */}
//       <Content className="hero-section">
//         <Title level={1}>Welcome to EMS</Title>
//         <Paragraph>
//           Streamline your employee management process with ease. Organize,
//           track, and manage your workforce effortlessly.
//         </Paragraph>
//         <div className="button-group">
//           <Button
//             type="primary"
//             size="large"
//             onClick={() => navigate("/sign-up")}
//           >
//             Sign Up
//           </Button>
//           <Button size="large" onClick={() => navigate("/sign-in")}>
//             Sign In
//           </Button>
//         </div>
//       </Content>

//       {/* Footer Section */}
//       <Footer className="footer-section">
//         <Paragraph style={{ color: "white" }}>
//           © {new Date().getFullYear()} EMS. All rights reserved.
//         </Paragraph>
//       </Footer>
//     </Layout>
//   );
// };

// export default SimpleLandingPage;

// import React from "react";
// import logo from "../../assets/landing-page-logo.png";
// import "./style.css";
// import { Button } from "antd";

// function LandingPage() {
//   return (
//     <div className="landing-page">
//       <div className="navigation-bar">
//         <div className="logo">
//           <img src={logo} alt="logo" />
//         </div>
//         <div className="nav-links">
//           <div className="links">Features</div>
//           <div className="links">How it works</div>
//           <div className="links">Testimonials</div>
//           <div className="links">FAQ</div>
//         </div>
//         <div className="nav-buttons">
//           <Button type="primary" htmlType="submit" className="nav-button" block>
//             Sign In{" "}
//           </Button>{" "}
//           <Button type="primary" htmlType="submit" className="nav-button" block>
//             Sign Up{" "}
//           </Button>{" "}
//         </div>
//       </div>
//       <div className="main-content">
//         <div className="content-title">
//           Lorem Ipsum is <br /> simply dummy text{" "}
//         </div>
//         <div className="content-desc">
//           all-in-one solution for seamless employee management! Join now to
//           streamline HR tasks,
//           <br /> track performance, and empower your team to succeed
//         </div>
//         <div className="content-buttons">
//           <div className="content-button">
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="content-btn"
//               block
//             >
//               Get Started{" "}
//             </Button>{" "}
//           </div>
//           <div className="content-button">
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="content-btn"
//               block
//             >
//               Watch Demo{" "}
//             </Button>{" "}
//           </div>
//         </div>
//       </div>
//       {/* <div></div> */}
//     </div>
//   );
// }

// export default LandingPage;

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
            Sign In
          </Button>
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
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
            Sign In
          </Button>
          <Button
            type="primary"
            className="nav-button"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
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
