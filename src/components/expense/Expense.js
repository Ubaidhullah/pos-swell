import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { withStyles } from "@mui/styles";
import CustomTabs from "../controls/Tabs";
import TabContainer from "../controls/TabContainer";
import ExpenseTab from "./ExpenseTab";
import ExpenseTypeTab from "./ExpenseTypeTab";

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

const Expense = ({ classes }) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/expense") {
      setValue(0);
    } else {
      setValue(1);
    }
  }, [location.pathname]);

  const handleChange = (event, value) => {
    if (value === 0) {
      navigate("/expense");
    } else {
      navigate("/expensetypes");
    }
    setValue(value);
  };

  return (
    <div>
      <div className={classes.tabHolder}>
        <CustomTabs
          onChange={handleChange}
          value={value}
          items={["Expense", "Expense Types"]}
        />
        {value === 0 && (
          <TabContainer>
            <ExpenseTab />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <ExpenseTypeTab />
          </TabContainer>
        )}
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Expense);
