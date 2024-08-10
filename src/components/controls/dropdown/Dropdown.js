import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import 'react-select/dist/react-select.min.css';
import SelectWrapped from "./SelectWrapped";
import styles from "./styles";
import CustomTextField from "../textfields/CustomTextField";  // Import CustomTextField

const Dropdown = props => {
  const { classes, datasource, ...rest } = props;

  return (
    <CustomTextField
      {...rest}
      fullWidth
      name="react-select-chip-label"
      InputLabelProps={{
        shrink: true
      }}
      InputProps={{
        inputComponent: SelectWrapped,
        inputProps: {
          classes,
          instanceId: "react-select-chip-label",
          id: "react-select-chip-label",
          simpleValue: true,
          options: datasource
        }
      }}
    />
  );
};

Dropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  datasource: PropTypes.array.isRequired,  // Add prop type validation for datasource
};

export default withStyles(styles)(Dropdown);
