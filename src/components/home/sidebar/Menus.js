import React, { Fragment } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  UserAddOutlined,
  TeamOutlined,
  MoreOutlined,
  DollarOutlined,
  FileAddOutlined,
  BarChartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import SidebarMenu from "../../controls/SidebarMenu";
import { useNavigate, useLocation } from "react-router-dom";

const Menus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSelected = (path) =>
    location.pathname === `/${path}` || location.pathname.includes(`/${path}/`);

  const onMenuClick = (route) => {
    navigate(route);
  };

  return (
    <Fragment>
      <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
        <SidebarMenu
          isSelected={isSelected("sale")}
          onClick={() => onMenuClick("/sale")}
          text="Sale"
          icon={<AppstoreOutlined />}
        />
        <Menu.SubMenu key="master" title="MASTER">
          <SidebarMenu
            isSelected={isSelected("customers")}
            onClick={() => onMenuClick("/customers")}
            text="Customers"
            icon={<UserAddOutlined />}
          />
          <SidebarMenu
            isSelected={isSelected("vendors")}
            onClick={() => onMenuClick("/vendors")}
            text="Vendors"
            icon={<TeamOutlined />}
          />
          <SidebarMenu
            isSelected={isSelected("products") || isSelected("producttypes")}
            onClick={() => onMenuClick("/products")}
            text="Products"
            icon={<MoreOutlined />}
          />
          <SidebarMenu
            isSelected={isSelected("expense") || isSelected("expensetypes")}
            onClick={() => onMenuClick("/expense")}
            text="Expense"
            icon={<DollarOutlined />}
          />
          <SidebarMenu
            isSelected={isSelected("receivings")}
            onClick={() => onMenuClick("/receivings")}
            text="Receivings"
            icon={<FileAddOutlined />}
          />
        </Menu.SubMenu>
        <Menu.SubMenu key="reports" title="REPORTS">
          <SidebarMenu text="Todays Sales" icon={<BarChartOutlined />} />
          <SidebarMenu text="Credit Sale" icon={<ShoppingOutlined />} />
          <SidebarMenu text="Expense" icon={<DollarOutlined />} />
        </Menu.SubMenu>
      </Menu>
    </Fragment>
  );
};

export default Menus;
