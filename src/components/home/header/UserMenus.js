import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { logout } from "../../../actions/auth";

class UserMenu extends Component {
  state = { visible: false };

  handleMenuClick = ({ key }) => {
    if (key === "logout") {
      this.props.logout();
    } else if (key === "profile") {
      this.myProfile();
    }
  };

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  };

  myProfile = () => {
    // Handle profile click
  };

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="profile">
          My Profile
        </Menu.Item>
        <Menu.Item key="logout">
          Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <Fragment>
        {/* Right corner menu [logout, my profile] */}
        <Dropdown
          overlay={menu}
          trigger={['click']}
          onVisibleChange={this.handleVisibleChange}
          visible={this.state.visible}
        >
          <Button style={{
              fontSize: "16px",
              color: "#fff", // Match the text color to the dark theme
            }}
             type="text" 
             icon={<UserOutlined />} />
        </Dropdown>
      </Fragment>
    );
  }
}

export default connect(null, { logout })(UserMenu);