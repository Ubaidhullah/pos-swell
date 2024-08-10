import React from "react";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography'; // Import Typography

const styles = {
  appBar: {
    position: "relative"
  },
  title: {
    flex: 1,
    paddingLeft: "5px",
    fontWeight: 100,
    fontSize: "20px"
  },
  subTitle: {
    paddingLeft: "10px",
    fontWeight: 100,
    fontSize: "16px"
  }
};

const Transition = props => <Slide direction="up" {...props} />;

const FullPageDialog = ({ classes, open, handleClose, children, title }) => (
  <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    TransitionComponent={Transition}
  >
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.title}>
          {title}
        </Typography>
        <IconButton color="inherit" onClick={handleClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    {children}
  </Dialog>
);

export default withStyles(styles)(FullPageDialog);
