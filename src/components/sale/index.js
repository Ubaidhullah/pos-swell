import React, { Component } from "react";
import PosSection from "./posSection/PosSection";
import GridItem from "./displaySection/GridItem";

class Sale extends Component {
  render() {
    return (
      <div style={{ display: 'flex' }}>
        {/* Left side carts grid and barcode/search text box  */}
        <div style={{ flex: 1 }}>
          <PosSection />
        </div>

        {/* Right side products display grid */}
        <div style={{ flex: 1 }}>
          <GridItem />
        </div>
      </div>
    );
  }
}

export default Sale;
