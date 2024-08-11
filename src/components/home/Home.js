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
     
        <Sidebar>
        {/* Main Content Area */}
          <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", overflow: "auto" }}>
            <Routes />
          </Content>
        </Sidebar>
    </Layout>
  );
};

export default Home;
