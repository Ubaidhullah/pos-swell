import React, { useState } from "react";
import { Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Routes from "./Routes";

const { Content } = Layout;

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const shouldRenderMobileMenu = location.pathname === "/sale";

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        shouldRenderMobileMenu={shouldRenderMobileMenu}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Layout>
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          <Routes />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
