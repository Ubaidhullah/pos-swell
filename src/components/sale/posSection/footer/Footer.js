import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import NormalSale from "../sale/NormalSale";

class Footer extends Component {
  state = {
    showNormalPopup: false
  };

  normalSaleClick = () => {
    this.setState({ showNormalPopup: true });
  };

  handleNormalSaleClose = () => {
    this.setState({ showNormalPopup: false });
  };

  render() {
    const { showNormalPopup } = this.state;
    const { summary } = this.props;

    if (summary.noOfItems === 0) {
      return null;
    }

    return (
      <div style={{ marginTop: 20 }}>
        {showNormalPopup && (
          <NormalSale
            visible={showNormalPopup}
            handleClose={this.handleNormalSaleClose}
          />
        )}
        <Button
          type="default"
          block
          onClick={this.normalSaleClick}
        >
          Normal Sale
        </Button>

        <Button
          type="default"
          block
          onClick={this.creditSaleClick}
        >
          Credit Sale
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  summary: cart.summary
});

export default connect(mapStateToProps)(Footer);
