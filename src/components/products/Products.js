import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs } from "antd";
import ProductTab from "./ProductTab";
import ProductTypeTab from "./ProductTypeTab";

const { TabPane } = Tabs;

const Products = () => {
  const [activeKey, setActiveKey] = useState("0");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/products") {
      setActiveKey("0");
    } else {
      setActiveKey("1");
    }
  }, [location.pathname]);

  const handleChange = (key) => {
    if (key === "0") {
      navigate("/products");
    } else {
      navigate("/producttypes");
    }
    setActiveKey(key);
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleChange}>
      <TabPane tab="Products" key="0">
        <ProductTab />
      </TabPane>
      <TabPane tab="Product Types" key="1">
        <ProductTypeTab />
      </TabPane>
    </Tabs>
  );
};

export default Products;
