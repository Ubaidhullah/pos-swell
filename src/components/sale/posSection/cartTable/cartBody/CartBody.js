import React from "react";
import { Table } from "antd";
import { Button } from "antd";

const CartBody = ({ cartArray, onDeleteCartItem, onProductItemSelect }) => {
  if (cartArray.length === 0) {
    return (
      <Table dataSource={[]} pagination={false} locale={{ emptyText: "No items in the cart" }} />
    );
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button type="link" onClick={() => onProductItemSelect(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      align: "right",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right",
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right",
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (text, record) => (
        <Button danger onClick={() => onDeleteCartItem(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return <Table dataSource={cartArray} columns={columns} rowKey="id" pagination={false} />;
};

export default CartBody;
