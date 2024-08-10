import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Searchbox from "../controls/Searchbox";
import api from "../../api";
import ApiAutoFetchDatagrid from "../controls/datagrid/ApiAutoFetchDatagrid";
import Message from "../controls/Message";
import CircularLoader from "../controls/loader/CircularLoader";
import YesNo from "../controls/dialog/YesNo";

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

const ProductTypeTab = ({ classes }) => {
  const productColumns = ["Product Type ID", "Description"];

  const [clearSearch, setClearSearch] = useState(false);
  const [serachQuery, setSerachQuery] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
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
    navigate("producttypes/new");
  };

  const onEdit = row => {
    navigate(`producttypes/edit/${row.id}`);
  };

  const onDelete = itemToDelete => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.productType.delete(id);

      if (res.status === 200) {
        displayMessage("Deleted successfully.");
      } else {
        throw new Error(`Couldn't delete the record. The status code is ${res.status}`);
      }
    } catch (error) {
      let { message } = error;

      if (message === "FOREIGN_KEY_CONSTRAINT") {
        message =
          "There are products associated with the selected product type chosen for deletion. So it can't be deleted. Please modify the product references this product type and then delete.";
      }
      displayMessage(message, true);
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
      return api.productType.fetchByPages();
    }

    return api.productType.searchByIdAndGetByPages(serachQuery);
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

export default withStyles(styles, { withTheme: true })(ProductTypeTab);
