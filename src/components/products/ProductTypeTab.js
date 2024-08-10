import React, { useState } from "react";
import { Button, Input, Table, Modal, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ProductTypeTab = () => {
  const productColumns = [
    {
      title: "Product Type ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => onDelete(record)}>Delete</Button>
        </>
      ),
    },
  ];

  const [clearSearch, setClearSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  const navigate = useNavigate();

  const onListClick = () => {
    setClearSearch(true);
    setSearchQuery("");
    setShowMessage(false);
  };

  const onSearchSubmit = async (value) => {
    setClearSearch(false);
    setSearchQuery(value);
    const data = await getApiPromise();
    setDataSource(data);
  };

  const onCreateNewClick = () => {
    navigate("/producttypes/new");
  };

  const onEdit = (row) => {
    navigate(`/producttypes/edit/${row.id}`);
  };

  const onDelete = (itemToDelete) => {
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
          "There are products associated with the selected product type chosen for deletion. So it can't be deleted. Please modify the product references to this product type and then delete.";
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

  const getApiPromise = () => {
    if (searchQuery.length === 0) {
      return api.productType.fetchByPages();
    }

    return api.productType.searchByIdAndGetByPages(searchQuery);
  };

  return (
    <div style={{ marginTop: 20, position: "relative" }}>
      {isLoading && <Spin />}
      {showMessage && <Alert message="Message" description={message} type={isError ? "error" : "success"} closable />}
      
      <div style={{ marginBottom: 16 }}>
        <Button onClick={onListClick}>List</Button>
        <Button type="primary" onClick={onCreateNewClick} style={{ marginLeft: 8 }}>
          Create New
        </Button>
        <Input.Search
          placeholder="Search by ID"
          onSearch={onSearchSubmit}
          style={{ width: 200, marginLeft: 16 }}
        />
      </div>

      <Table columns={productColumns} dataSource={dataSource} rowKey="id" />

      <Modal
        title="Confirm Deletion"
        visible={showConfirmDeleteDialog}
        onOk={onConfirmDeleteClick}
        onCancel={() => setShowConfirmDeleteDialog(false)}
      >
        Are you sure you want to delete the selected item?
      </Modal>
    </div>
  );
};

export default ProductTypeTab;
