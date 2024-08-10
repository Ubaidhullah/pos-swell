import React, { useState } from "react";
import { Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Routes from "./Routes";

const { Content } = Layout;

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const shouldRenderMobileMenu = location.pathname === "/sale";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header and Sidebar */}
      <Header
        shouldRenderMobileMenu={shouldRenderMobileMenu}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Layout>
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        {/* Main Content Area */}
        <Layout style={{ padding: "24px" }}>
          <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", overflow: "auto" }}>
            <Routes />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
