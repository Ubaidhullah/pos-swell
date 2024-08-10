import React from "react";
import { TableRow, TableBody } from "@mui/material";
import NoItemsTableCell from "./NoItemsTableCell";

const CartBodyNoItems = () => (
  <TableBody>
    <TableRow>
      <NoItemsTableCell />
    </TableRow>
  </TableBody>
);

export default CartBodyNoItems;
