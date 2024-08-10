import { withStyles } from "@mui/styles";
import TableCell from '@mui/material/TableCell';

const CustomTableCell = withStyles(() => ({
  head: {
    backgroundColor: "#f5f5f5",
    color: "black",
    fontSize: 14
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

export default CustomTableCell;
