import React, { useState } from "react";
import { Button } from 'antd';
import { Card } from 'antd';
import { Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Container from "../controls/Container";
import Searchbox from "../controls/Searchbox";
import Message from "../controls/Message";
import { Alert } from 'antd';
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

const Customers = ({ classes }) => {
  const customerColumns = ["Id", "Name", "Description", "Address", "Mobile", "Email"];
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

  const onSearchChange = (event) => {
    setSerachQuery(event.target.value);
  };

  const onSearchSubmit = async id => {
    setClearSearch(false);
    setSerachQuery(id);
  };

  const onCreateNewClick = () => {
    navigate("customers/new");
  };

  const onEdit = row => {
    navigate(`customers/edit/${row.id}`);
  };

  const onDelete = itemToDelete => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.customer.delete(id);

      if (res.status === 200) {
        showMessageHandler("Deleted successfully.");
      } else {
        throw new Error(`Couldn't delete the record. The status code is ${res.status}`);
      }
    } catch (error) {
      showMessageHandler(error.message, true);
    }
  };

  const showMessageHandler = (message, isError = false) => {
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
      return api.customer.fetchByPages();
    }

    return api.customer.searchByIdAndGetByPages(serachQuery);
  };

  return (
    <Container title="Customers">
      <CircularLoader isLoading={isLoading} />
      <YesNo
        open={showConfirmDeleteDialog}
        message="Are you sure wan't to delete the selected item"
        onOk={onConfirmDeleteClick}
        onCancel={onCancelConfirmDeleteClick}
      />

      <div>
      <Button type="default" size="small" onClick={onListClick}>
          List
        </Button>

        <Button type="default" size="small" onClick={onListClick}>
          Create New
        </Button>

        <Searchbox
          clear={clearSearch}
          onChange={onSearchChange}
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
          headers={customerColumns}
        />
      </div>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(Customers);
