import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Searchbox from "../controls/Searchbox";
import api from "../../api";
import ApiAutoFetchDatagrid from "../controls/datagrid/ApiAutoFetchDatagrid";
import YesNo from "../controls/dialog/YesNo";
import CircularLoader from "../controls/loader/CircularLoader";
import Message from "../controls/Message";

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  wrapper: {
    marginTop: 20,
    position: "relative"
  }
});

const ProductTab = ({ classes }) => {
  const productColumns = [
    "ID",
    "Name",
    "Description",
    "Cost price",
    "Selling price",
    "Type"
  ];

  const [clearSearch, setClearSearch] = useState(false);
  const [serachQuery, setSerachQuery] = useState("");
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const onListClick = () => {
    setClearSearch(true);
    setSerachQuery("");
    setShowMessage(false);
  };

  const onSearchSubmit = async id => {
    setClearSearch(false);
    setSerachQuery(id);
  };

  const onCreateNewClick = () => {
    navigate("products/new");
  };

  const onEdit = row => {
    navigate(`products/edit/${row.id}`);
  };

  const onDelete = itemToDelete => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.product.delete(id);

      if (res.status === 200) {
        displayMessage("Deleted successfully.");
      } else {
        throw new Error(`Couldn't delete the record. The status code is ${res.status}`);
      }
    } catch (error) {
      displayMessage(error.message, true);
    }
  };

  const displayMessage = (message, isError = false) => {
    setShowMessage(true);
    setIsError(isError);
    setMessage(message);
    setIsLoading(false);
    setShowConfirmDeleteDialog(false);
  };

  const onMessageCloseClick = () => {
    setShowMessage(false);
  };

  const onCancelConfirmDeleteClick = () => {
    setShowConfirmDeleteDialog(false);
  };

  const getApiPromise = () => {
    if (serachQuery.length === 0) {
      return api.product.fetchByPages();
    }

    return api.product.searchByIdAndGetByPages(serachQuery);
  };

  return (
    <div className={classes.wrapper}>
      <CircularLoader isLoading={isLoading} />
      <YesNo
        open={showConfirmDeleteDialog}
        message="Are you sure wan't to delete the selected item"
        onOk={onConfirmDeleteClick}
        onCancel={onCancelConfirmDeleteClick}
      />
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="default"
          size="small"
          onClick={onListClick}
        >
          List
        </Button>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          onClick={onCreateNewClick}
        >
          Create New
        </Button>
        <Searchbox
          clear={clearSearch}
          onSubmit={onSearchSubmit}
        />
      </div>

      <Message
        style={{ width: "98%" }}
        title="Message"
        message={message}
        show={showMessage}
        isError={isError}
        onCloseClick={onMessageCloseClick}
        autoClose={!isError}
      />

      <div className={classes.wrapper}>
        <ApiAutoFetchDatagrid
          datasourcePromise={getApiPromise}
          actions={["del", "edit"]}
          onEdit={onEdit}
          onDelete={onDelete}
          headers={productColumns}
        />
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ProductTab);
