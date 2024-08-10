import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { withStyles } from "@mui/styles";

const styles = () => ({
  deleteIcon: {
    color: "#949494"
  }
});

const DeleteButton = ({ onDelete, classes }) => (
  <IconButton onClick={() => onDelete()}>
    <DeleteIcon className={classes.deleteIcon} />
  </IconButton>
);

export default withStyles(styles)(DeleteButton);
