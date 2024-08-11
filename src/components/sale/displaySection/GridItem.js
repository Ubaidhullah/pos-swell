import React, { Component } from "react";
import { Card, Avatar } from "antd";

class GridItem extends Component {
  render() {
    return (
      <Card
        style={{
          width: 150,
          height: 150,
          overflow: "auto",
          display: "inline-block",
          textAlign: "center"
        }}
      >
        <Avatar
          style={{
            margin: "auto",
            backgroundColor: "#3f50b5",
            color: "#fff"
          }}
        >
          BR
        </Avatar>
        <p
          style={{
            width: 130,
            overflowWrap: "break-word",
            padding: 5,
            fontSize: "13px",
            marginTop: 30,
          }}
        >
          Britania Tiger
        </p>
      </Card>
    );
  }
}

export default GridItem;
