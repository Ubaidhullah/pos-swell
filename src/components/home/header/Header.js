import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './Header.css'; // Assuming you create a CSS file for your custom styles
import Menus from "./UserMenus";

const { Header: AntHeader } = Layout;
const drawerWidth = 200;

class Header extends Component {
  render() {
    const { handleDrawerToggle, shouldRenderMobileMenu } = this.props;

    const navIconClass = shouldRenderMobileMenu ? "navIconShow" : "navIconHide";
    const appBarClass = shouldRenderMobileMenu ? "appBarFullWidth" : "appBar";

    return (
      <Fragment>
        <AntHeader className={appBarClass}>
          <div className={classNames("logo", navIconClass)}>
            <div className="logoContainer">
              <Button
                style={{ margin: 0 }}
                icon={<MenuOutlined />}
                type="text"
                onClick={handleDrawerToggle}
              />
              <span>Point Of Sale</span>
            </div>
          </div>
          <div className="flex">
            <Menus />
          </div>
        </AntHeader>
      </Fragment>
    );
  }
}

export default Header;
