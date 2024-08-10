import React from "react";
import { Layout, Drawer } from "antd";
import Menus from "./Menus";

const { Sider } = Layout;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  return (
    <>
      {/* Render the Drawer only on mobile viewports */}
      {mobileOpen && (
        <Drawer
          title="Menu"
          placement="left"
          closable={false}
          onClose={handleDrawerToggle}
          visible={mobileOpen}
        >
          <Menus />
        </Drawer>
      )}

      {/* Render Sider for larger screens */}
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
        <Menus />
      </Sider>
    </>
  );
};

Sidebar.defaultProps = {
  mobileOpen: false,
};

export default Sidebar;
