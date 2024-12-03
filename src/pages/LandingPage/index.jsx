// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "antd";
// import "./style.css";

// function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
//       <Button onClick={() => navigate("/sign-up")}>Sign Up</Button>
//     </div>
//   );
// }

// export default LandingPage;

import React from "react";
import { Layout, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const SimpleLandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout className="landing-page">
      {/* Header Section */}
      <Header className="landing-header">
        <div className="logo">EMS</div>
        <div>
          <Button type="link" onClick={() => navigate("/sign-in")}>
            Sign In
          </Button>
          <Button type="primary" onClick={() => navigate("/sign-up")}>
            Sign Up
          </Button>
        </div>
      </Header>

      {/* Hero Section */}
      <Content className="hero-section">
        <Title level={1}>Welcome to EMS</Title>
        <Paragraph>
          Streamline your employee management process with ease. Organize,
          track, and manage your workforce effortlessly.
        </Paragraph>
        <div className="button-group">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </Button>
          <Button size="large" onClick={() => navigate("/sign-in")}>
            Sign In
          </Button>
        </div>
      </Content>

      {/* Footer Section */}
      <Footer className="footer-section">
        <Paragraph style={{ color: "white" }}>
          © {new Date().getFullYear()} EMS. All rights reserved.
        </Paragraph>
      </Footer>
    </Layout>
  );
};

export default SimpleLandingPage;
