import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, DatePicker, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import moment from "moment";

const { Option } = Select;

const AddNewExpense = () => {
  const initialData = {
    expenseTypeId: "",
    description: "",
    amount: "",
    spentAt: moment(),
  };

  const [data, setData] = useState(initialData);
  const [expenseTypeIds, setExpenseTypeIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await api.expenseType.fetchAll();
        setExpenseTypeIds(res.data);

        if (id) {
          const res2 = await api.expense.fetchById(id);
          setData({ ...res2.data, spentAt: moment(res2.data.spentAt) });
          setIsEdit(true);
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (isEdit) {
        await api.expense.update(id, values);
      } else {
        await api.expense.createNew(values);
      }
      message.success("Saved successfully");
      navigate(-1);
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        layout="vertical"
        initialValues={data}
        onFinish={onSubmit}
      >
        <Form.Item
          name="description"
          label="Expense description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input ref={idRef} />
        </Form.Item>

        <Form.Item
          name="expenseTypeId"
          label="Expense type"
          rules={[{ required: true, message: "Please select an expense type" }]}
        >
          <Select>
            {expenseTypeIds.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.id}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter an amount" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="spentAt"
          label="Spent At"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker />
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
    </Spin>
  );
};

export default AddNewExpense;
