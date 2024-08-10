import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, Spin, Alert, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const AddNewProduct = () => {
  const initialData = {
    id: "",
    name: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    productTypeId: ""
  };

  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [productTypeIds, setProductTypeIds] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await api.productType.fetchAll();
        const productTypeIds = res.data.map(d => ({
          value: d.id,
          label: d.id
        }));

        setProductTypeIds(productTypeIds);
        setIsLoading(false);

        if (id) {
          const res2 = await api.product.fetchById(id);
          const productToEdit = res2.data;
          setData(productToEdit);
          setIsEdit(true);
        }
      } catch (error) {
        displayMessage(error.message, true);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      if (!isEdit) {
        await createNew(values);
      } else {
        await update(values);
      }
    } catch (error) {
      displayMessage(error.message, true);
    }
  };

  const createNew = async (values) => {
    const res = await api.product.createNew(values);

    if (res.status === 200) {
      displayMessage("Saved successfully");
      clearForm();
    } else {
      throw new Error(`Unable to create the record. The status code is ${res.status}`);
    }
  };

  const update = async (values) => {
    const res = await api.product.update(id, values);

    if (res.status === 200) {
      displayMessage("Updated successfully");
      clearForm(true);
    } else {
      throw new Error(`Unable to update. The status code is ${res.status}`);
    }
  };

  const clearForm = (showDialog = false) => {
    form.resetFields();
    setShowMessageDialog(showDialog);
  };

  const displayMessage = (message, isError = false) => {
    setShowMessage(true);
    setMessage(message);
    setIsError(isError);
    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      {showMessage && (
        <Alert
          message="Message"
          description={message}
          type={isError ? "error" : "success"}
          closable
          onClose={() => setShowMessage(false)}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={data}
      >
        <Form.Item
          label="Product Id"
          name="id"
          rules={[{ required: true, message: "Please input the product ID!" }]}
        >
          <Input disabled={isEdit} />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the product name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Product Type"
          name="productTypeId"
          rules={[{ required: true, message: "Please select a product type!" }]}
        >
          <Select options={productTypeIds} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Cost Price"
          name="costPrice"
          rules={[{ required: true, message: "Please input the cost price!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Selling Price"
          name="sellingPrice"
          rules={[{ required: true, message: "Please input the selling price!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Saved Successfully"
        visible={showMessageDialog}
        onOk={() => navigate(-1)}
        onCancel={() => setShowMessageDialog(false)}
      >
        The product you entered was saved successfully.
      </Modal>
    </Spin>
  );
};

export default AddNewProduct;
