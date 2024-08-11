import React, { useState } from "react";
import { Button } from "antd";
import NormalSale from "../../sale/NormalSale";

const Footer = ({ summary }) => {
  const [showNormalPopup, setShowNormalPopup] = useState(false);

  const normalSaleClick = () => setShowNormalPopup(true);
  const handleNormalSaleClose = () => setShowNormalPopup(false);

  if (summary.noOfItems === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 20 }}>
      {showNormalPopup && (
        <NormalSale
          visible={showNormalPopup}
          handleClose={handleNormalSaleClose}
        />
      )}
      <Button type="default" block onClick={normalSaleClick}>
        Normal Sale
      </Button>

      <Button type="default" block onClick={() => { /* Implement credit sale */ }}>
        Credit Sale
      </Button>
    </div>
  );
};

export default Footer;
