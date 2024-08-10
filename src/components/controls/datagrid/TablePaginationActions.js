import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const styles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends Component {
  render() {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      onFirst,
      onPrev,
      onLast,
      onNext
    } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={onFirst}
          disabled={page === 1}
          aria-label="First Page"
        >
          <FirstPageIcon />
        </IconButton>

        <IconButton
          onClick={onPrev}
          disabled={page === 1}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          onClick={onNext}
          disabled={page >= Math.ceil(count / rowsPerPage)}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>

        <IconButton
          onClick={onLast}
          disabled={page >= Math.ceil(count / rowsPerPage)}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TablePaginationActions);
