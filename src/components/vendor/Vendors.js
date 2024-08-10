import React, { useState } from "react";
import { Button, Card, Alert, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Searchbox from "../controls/Searchbox";
import ApiAutoFetchDatagrid from "../controls/datagrid/ApiAutoFetchDatagrid";
import api from "../../api";
import YesNo from "../controls/dialog/YesNo";

const styles = theme => ({
  wrapper: {
    position: "relative",
    margin: "20px 5px 5px 5px"
  }
});

const Vendors = ({ classes }) => {
  const vendorColumns = ["Id", "Name", "Description", "Address", "Mobile", "Email"];

  const [clearSearch, setClearSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const onListClick = () => {
    setClearSearch(true);
    setSearchQuery("");
    setShowMessage(false);
  };

  const onSearchSubmit = async id => {
    setClearSearch(false);
    setSearchQuery(id);
  };

  const onCreateNewClick = () => {
    navigate("/vendors/new"); // Ensure the path is correct and matches your route setup
  };

  const onEdit = row => {
    navigate(`/vendors/edit/${row.id}`); // Ensure the path is correct and matches your route setup
  };

  const onDelete = itemToDelete => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.vendor.delete(id);

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
    if (searchQuery.length === 0) {
      return api.vendor.fetchByPages();
    }

    return api.vendor.searchByIdAndGetByPages(searchQuery);
  };

  return (
    <Card title="Vendors">
      <Spin spinning={isLoading} tip="Loading... Please wait.">
        <YesNo
          open={showConfirmDeleteDialog}
          message="Are you sure you want to delete the selected item?"
          onOk={onConfirmDeleteClick}
          onCancel={onCancelConfirmDeleteClick}
        />

        <div>
          <Button type="default" size="small" onClick={onListClick}>
            List
          </Button>

          <Button type="default" size="small" onClick={onCreateNewClick}>
            Create New
          </Button>

          <Searchbox
            clear={clearSearch}
            onSubmit={onSearchSubmit}
          />
        </div>

        {showMessage && (
          <Alert
            message="Message"
            description={message}
            type={isError ? "error" : "success"}
            closable
            onClose={onMessageCloseClick}
          />
        )}

        <div className={classes.wrapper}>
          <ApiAutoFetchDatagrid
            datasourcePromise={getApiPromise}
            actions={["del", "edit"]}
            onEdit={onEdit}
            onDelete={onDelete}
            headers={vendorColumns}
          />
        </div>
      </Spin>
    </Card>
  );
};

export default withStyles(styles, { withTheme: true })(Vendors);
