import { TableCell } from "@mui/material";
import { withStyles } from "@mui/styles";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#e5e5e5",
    color: theme.palette.common.black,
    padding: "5px",
    fontSize: 14
  },
  body: {
    fontSize: 13,
    padding: "5px",
    overflowWrap: "break-word"
  }
}))(TableCell);

export default CustomTableCell;
