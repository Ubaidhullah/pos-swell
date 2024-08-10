import React from "react";
import { Routes, Route } from "react-router-dom";
import customer from "../customers";
import expense from "../expense";
import receivings from "../receivings";
import product from "../products";
import vendor from "../vendor";
import sale from "../sale";
import NotFound from "../notFound/NotFound";

const AppRoutes = () => (
  <div style={{ overflow: "auto" }}>
    <Routes>
      <Route path="/" element={<div />} />

      {/* Sale */}
      <Route path="/sale" element={<sale />} />

      {/* Receivings */}
      <Route path="/receivings" element={<receivings.Receivings />} />
      <Route path="/receivings/new" element={<receivings.AddNew />} />

      {/* Vendor */}
      <Route path="/vendors" element={<vendor.Vendors />} />
      <Route path="/vendors/new" element={<vendor.AddNew />} />
      <Route path="/vendors/edit/:id" element={<vendor.AddNew />} />

      {/* Customer */}
      <Route path="/customers" element={<customer.Customers />} />
      <Route path="/customers/new" element={<customer.AddNew />} />
      <Route path="/customers/edit/:id" element={<customer.AddNew />} />

      {/* Expense */}
      <Route path="/expense" element={<expense.Expense />} />
      <Route path="/expense/new" element={<expense.AddNewExpense />} />
      <Route path="/expense/edit/:id" element={<expense.AddNewExpense />} />

      {/* Expense Type */}
      <Route path="/expensetypes" element={<expense.Expense />} />
      <Route path="/expensetypes/new" element={<expense.AddNewExpenseType />} />
      <Route path="/expensetypes/edit/:id" element={<expense.AddNewExpenseType />} />

      {/* Product */}
      <Route path="/products" element={<product.Products />} />
      <Route path="/products/new" element={<product.AddNewProduct />} />
      <Route path="/products/edit/:id" element={<product.AddNewProduct />} />

      {/* Product Type */}
      <Route path="/producttypes" element={<product.Products />} />
      <Route path="/producttypes/new" element={<product.AddNewProductType />} />
      <Route path="/producttypes/edit/:id" element={<product.AddNewProductType />} />

      {/* Catch : Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default AppRoutes;
