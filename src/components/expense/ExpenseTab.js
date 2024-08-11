import React, { useState } from "react";
import { Button, Input, Table, Modal, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import moment from "moment";

const ExpenseTab = () => {
  const expenseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Spent At",
      dataIndex: "spentAt",
      key: "spentAt",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record)}>Delete</Button>
        </>
      ),
    },
  ];

  const [clearSearch, setClearSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
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
    navigate("/expense/new");
  };

  const onEdit = (row) => {
    navigate(`/expense/edit/${row.id}`);
  };

  const onDelete = (itemToDelete) => {
    setShowConfirmDeleteDialog(true);
    setItemToDelete(itemToDelete);
  };

  const onConfirmDeleteClick = async () => {
    const { id } = itemToDelete;

    try {
      setIsLoading(true);

      const res = await api.expense.delete(id);

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

  const getApiPromise = () => {
    if (searchQuery.length === 0) {
      return api.expense.fetchByPages();
    }

    return api.expense.searchByIdAndGetByPages(searchQuery);
  };

  return (
    <div>
      {isLoading && <Spin />}
      {showMessage && <Alert message={message} type={isError ? "error" : "success"} closable />}
      <div style={{ marginBottom: 16 }}>
        <Button onClick={onListClick}>List</Button>
        <Button type="primary" onClick={onCreateNewClick}>Create New</Button>
        <Input.Search
          placeholder="Search by ID"
          onSearch={onSearchSubmit}
          style={{ width: 200, marginLeft: 16 }}
        />
      </div>
      <Table columns={expenseColumns} dataSource={dataSource} rowKey="id" />
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

export default ExpenseTab;
