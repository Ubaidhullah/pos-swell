/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { withStyles } from "@mui/styles";

const styles = () => ({
  root: {
    textDecoration: "none",
    borderBottom: "0.5px dotted #541b8a",
    outline: "none"
  }
});

const LinkButton = ({ classes, text, onClick }) => (
  <a
    href=""
    className={classes.root}
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {text}
  </a>
);

export default withStyles(styles)(LinkButton);
