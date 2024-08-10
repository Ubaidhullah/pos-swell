import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  UserAddOutlined,
  TeamOutlined,
  DollarOutlined,
  FileAddOutlined,
  BarChartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const SidebarMenu = ({ isSelected, onClick, text, icon }) => {
  return (
    <Menu.Item
      key={text}
      onClick={onClick}
      icon={icon}
      style={{
        backgroundColor: isSelected ? "#e6f7ff" : "transparent",
        color: isSelected ? "#1890ff" : "inherit",
      }}
    >
      {text}
    </Menu.Item>
  );
};

export default SidebarMenu;
