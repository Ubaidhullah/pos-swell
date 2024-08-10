import React from "react";
import MomentUtils from "@mui/material-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "@mui/material-pickers/utils/MuiPickersUtilsProvider";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import DateRange from "@mui/icons-material/DateRange";
import { withStyles } from "@mui/styles";

// eslint-disable-next-line
const styles = theme => ({
  textField: {
    [theme.breakpoints.up("xs")]: {
      width: 250
    },
    [theme.breakpoints.up("sm")]: {
      width: 300
    },
    [theme.breakpoints.up("md")]: {
      width: 500
    },
    marginRight: 10,
    marginTop: 20
  },
  textFieldFormLabel: {
    fontSize: "1.05rem"
  }
});

const CustomDatePicker = props => {
  const { handleDateChange, classes, name, ...rest } = props;

  const onDateChange = date => {
    const target = {};
    target.name = name;
    // eslint-disable-next-line  no-underscore-dangle
    target.value = date._d;
    handleDateChange({ target });
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        keyboard
        mask={value =>
          value
            ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
            : []
        }
        leftArrowIcon={<KeyboardArrowLeft />}
        rightArrowIcon={<KeyboardArrowRight />}
        InputLabelProps={{
          shrink: true,
          className: classes.textFieldFormLabel
        }}
        keyboardIcon={<DateRange />}
        {...rest}
        className={classes.textField}
        onChange={onDateChange}
        disableOpenOnEnter
        animateYearScrolling={false}
      />
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles, { withTheme: true })(CustomDatePicker);
