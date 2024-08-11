import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs } from "antd";
import ExpenseTab from "./ExpenseTab";
import ExpenseTypeTab from "./ExpenseTypeTab";

const { TabPane } = Tabs;

const Expense = () => {
  const [activeKey, setActiveKey] = useState("expense");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/expense") {
      setActiveKey("expense");
    } else {
      setActiveKey("expensetypes");
    }
  }, [location.pathname]);

  const handleChange = (key) => {
    if (key === "expense") {
      navigate("/expense");
    } else {
      navigate("/expensetypes");
    }
    setActiveKey(key);
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleChange}>
      <TabPane tab="Expense" key="expense">
        <ExpenseTab />
      </TabPane>
      <TabPane tab="Expense Types" key="expensetypes">
        <ExpenseTypeTab />
      </TabPane>
    </Tabs>
  );
};

export default Expense;
