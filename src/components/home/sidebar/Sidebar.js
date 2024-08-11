import React, { useState } from "react";
import { Layout, Menu, Button, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  TeamOutlined,
  MoreOutlined,
  DollarOutlined,
  FileAddOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShopOutlined,  // Icon for POS
} from "@ant-design/icons";
import UserMenu from "../header/UserMenus";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onMenuClick = (route) => {
    navigate(route);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <Avatar style={{ backgroundColor: "#1890ff", marginRight: "10px" }} icon={<ShopOutlined />} />
          SWELL POS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => onMenuClick(key)}
          items={[
            {
              key: "/sale",
              icon: <AppstoreOutlined />,
              label: "Sale",
            },
            {
              key: "/customers",
              icon: <UserAddOutlined />,
              label: "Customers",
            },
            {
              key: "/vendors",
              icon: <TeamOutlined />,
              label: "Vendors",
            },
            {
              key: "/products",
              icon: <MoreOutlined />,
              label: "Products",
            },
            {
              key: "/expense",
              icon: <DollarOutlined />,
              label: "Expense",
            },
            {
              key: "/receivings",
              icon: <FileAddOutlined />,
              label: "Receivings",
            },
            {
              key: "/todays-sales",
              icon: <BarChartOutlined />,
              label: "Today's Sales",
            },
            {
              key: "/credit-sale",
              icon: <ShoppingOutlined />,
              label: "Credit Sale",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#001529", // Same color as Sider
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              color: "#fff", // Match the text color to the dark theme
            }}
          />
          <div style={{ flex: 1 }} />
          <UserMenu />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
