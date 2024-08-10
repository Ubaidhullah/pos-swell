import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { withStyles } from "@mui/styles";
import CustomTabs from "../controls/Tabs";
import TabContainer from "../controls/TabContainer";
import ProductTab from "./ProductTab";
import ProductTypeTab from "./ProductTypeTab";

const styles = theme => ({
  root: {
    padding: 10
  },
  tabHolder: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    boxShadow: "none"
  },
  tabItem: {
    fontSize: "12px"
  },
  indicator: {
    backgroundColor: "#3f51b5"
  }
});

const Products = ({ classes }) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/products") {
      setValue(0);
    } else {
      setValue(1);
    }
  }, [location.pathname]);

  const handleChange = (event, value) => {
    if (value === 0) {
      navigate("/products");
    } else {
      navigate("/producttypes");
    }
    setValue(value);
  };

  return (
    <div>
      <div className={classes.tabHolder}>
        <CustomTabs
          onChange={handleChange}
          value={value}
          items={["Products", "Product Types"]}
        />
        {value === 0 && (
          <TabContainer>
            <ProductTab />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <ProductTypeTab />
          </TabContainer>
        )}
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Products);
