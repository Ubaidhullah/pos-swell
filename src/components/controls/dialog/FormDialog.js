import React from "react";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


const FormDialog = props => (
  <Dialog
    open={props.open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {props.title ? props.title : "Edit Item"}
      <br />
      <span style={{ fontSize: "12px", color: "#3f50b5" }}>
        {props.subtitle ? `(${props.subtitle})` : ""}
      </span>
    </DialogTitle>
    <DialogContent>{props.children}</DialogContent>
    <DialogActions>
      <Button onClick={props.onSave} color="primary" autoFocus>
        Save
      </Button>
      <Button onClick={props.onCancel} color="secondary" autoFocus>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;
