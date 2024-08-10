import React, { useState } from "react";
import * as moment from "moment";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Container from "../controls/Container";
import Searchbox from "../controls/Searchbox";
import Message from "../controls/Message";
import ApiAutoFetchDatagrid from "../controls/datagrid/ApiAutoFetchDatagrid";
import api from "../../api";
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
    position: "relative",
    margin: "20px 5px 5px 5px"
  }
});

const Receivings = ({ classes }) => {
  const receivingsColumns = [
    "Order Id",
    "Product",
    "Vendor",
    "Qty",
    "Price",
    "Paid",
    "Date"
  ];

  const [clearSearch, setClearSearch] = useState(false);
  const [serachQuery, setSerachQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const onListClick = () => {
    setClearSearch(true);
    setSerachQuery("");
    setIsMessageVisible(false);
  };

  const onSearchSubmit = async id => {
    setClearSearch(false);
    setSerachQuery(id);
  };

  const onCreateNewClick = () => {
    navigate("receivings/new");
  };

  const onEdit = row => {
    navigate(`receivings/edit/${row.id}`);
  };

  const onDelete = itemToDelete => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.receiving.delete(id);

      if (res.status === 200) {
        displayMessage("Deleted successfully.");
      } else {
        throw new Error(
          `Couldn't delete the record. The status code is ${res.status}`
        );
      }
    } catch (error) {
      displayMessage(error.message, true);
    }
  };

  const displayMessage = (message, isError = false) => {
    setIsMessageVisible(true);
    setIsError(isError);
    setMessage(message);
    setIsLoading(false);
    setShowConfirmDeleteDialog(false);
  };

  const onMessageCloseClick = () => {
    setIsMessageVisible(false);
  };

  const onCancelConfirmDeleteClick = () => {
    setShowConfirmDeleteDialog(false);
  };

  const getApiPromise = () => {
    if (serachQuery.length === 0) {
      return api.receiving.fetchByPages();
    }

    return api.receiving.searchByIdAndGetByPages(serachQuery);
  };

  return (
    <Container title="Receivings">
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
          variant="raised"
          color="default"
          size="small"
          onClick={onListClick}
        >
          List
        </Button>

        <Button
          className={classes.button}
          variant="raised"
          color="primary"
          size="small"
          onClick={onCreateNewClick}
        >
          Create New
        </Button>

        <Searchbox
          placeholder="Vendor ID"
          clear={clearSearch}
          onSubmit={onSearchSubmit}
        />
      </div>

      <Message
        style={{ width: "98%" }}
        title="Message"
        message={message}
        show={isMessageVisible}
        isError={isError}
        onCloseClick={onMessageCloseClick}
        autoClose={!isError}
      />
      <div className={classes.wrapper}>
        <ApiAutoFetchDatagrid
          datasourcePromise={getApiPromise}
          actions={["del", "edit", "sel"]}
          onEdit={onEdit}
          onDelete={onDelete}
          headers={receivingsColumns}
          transformers={{
            date: value => moment(value).format("DD-MM-YYYY")
          }}
        />
      </div>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(Receivings);
