import React from "react";
import { ListItemIcon, ListItemText } from "@mui/material/List";

export const CustomListItemIcon = props => {
  const { children, ...rest } = props;

  return (
    <ListItemIcon {...rest} style={{ width: 19 }}>
      {props.children}
    </ListItemIcon>
  );
};

export const CustomListItemText = props => {
  const { children, ...rest } = props;

  return (
    <ListItemText {...rest} style={{ padding: 2 }}>
      {children}
    </ListItemText>
  );
};

// export default CustomListItemIcon;
