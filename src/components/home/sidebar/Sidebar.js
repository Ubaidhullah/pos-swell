import React from "react";
import { Layout, Drawer } from "antd";
import Menus from "./Menus";

const { Sider } = Layout;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const renderPermamentDrawer = () => (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      style={{ height: "100vh", borderRight: "1px solid #e0e0e0" }}
    >
      <div className="logo" style={{ padding: 16, textAlign: "center", color: "#fff", backgroundColor: "#3f51b5" }}>
        <span>Point Of Sale</span>
      </div>
      <Menus />
    </Sider>
  );

  const renderSlidingDrawer = () => (
    <Drawer
      title="Menu"
      placement="left"
      closable={false}
      onClose={handleDrawerToggle}
      visible={mobileOpen}
    >
      <Menus />
    </Drawer>
  );

  return (
    <>
      {/* MEDIUM SCREENS */}
      {renderSlidingDrawer()}

      {/* Default - LARGER SCREENS */}
      {renderPermamentDrawer()}
    </>
  );
};

Sidebar.defaultProps = {
  mobileOpen: false
};

export default Sidebar;
