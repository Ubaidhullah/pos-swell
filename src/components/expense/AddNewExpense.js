import React, { useState, useEffect, useRef } from "react";
import * as equal from "fast-deep-equal";
import { useNavigate, useParams } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Container from "../controls/Container";
import Form from "../controls/Form";
import CustomTextField from "../controls/textfields/CustomTextField";
import Dropdown from "../controls/dropdown/Dropdown";
import CircularLoader from "../controls/loader/CircularLoader";
import api from "../../api";
import NumberTextField from "../controls/textfields/NumberTextField";
import { isValueExists } from "../../utils";
import Message from "../controls/Message";
import Prompt from "../controls/dialog/Prompt";
// import CustomDatePicker from "../controls/pickers/CustomDatePicker";

// eslint-disable-next-line
const styles = theme => ({
  form: {
    marginLeft: 20
  },
  wrapper: {
    position: "relative"
  }
});

const AddNewExpense = ({ classes }) => {
  const initialData = {
    expenseTypeId: "",
    description: "",
    amount: "",
    spentAt: ""
  };

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [expenseTypeIds, setExpenseTypeIds] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await api.expenseType.fetchAll();
        const expenseTypeIds = res.data.map(d => ({
          value: d.id,
          label: d.id
        }));

        setExpenseTypeIds(expenseTypeIds);
        setIsLoading(false);

        if (id) {
          const res2 = await api.expense.fetchById(id);
          const expenseToEdit = res2.data;
          setData(expenseToEdit);
          setIsEdit(true);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchData();
  }, [id]);

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onExpenseTypeDropdownChange = value => {
    const expenseTypeId = value === null ? "" : value;

    setData({ ...data, expenseTypeId });
    setErrors({ ...errors, expenseTypeId: "" });
  };

  const onCancelClick = () => {
    const isDirty = !equal(initialData, data);

    if (isDirty && !isEdit) {
      clearForm();
      return;
    }

    navigate(-1);
  };

  const onSubmit = async e => {
    e.preventDefault();

    const validationErrors = isValueExists(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      data.amount = Number(data.amount);

      if (!isEdit) {
        await createNew(data);
      } else {
        await update(data);
      }
    } catch (error) {
      showError(error);
    }
  };

  const createNew = async data => {
    const res = await api.expense.createNew(data);

    if (res.status === 200) {
      showMessageHandler("Saved successfully");
      clearForm();
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  const update = async data => {
    const res = await api.expense.update(id, data);

    if (res.status === 200) {
      clearForm(true);
    } else {
      throw new Error(`Unable to update. The status code is ${res.status}`);
    }
  };

  const clearForm = (canShowMessageDialog = false) => {
    setData(initialData);
    setShowMessageDialog(canShowMessageDialog);

    if (idRef.current) {
      idRef.current.focus();
    }
  };

  const onMessageCloseClick = () => {
    setShowMessage(false);
    setMessage("");
    setIsError(false);
  };

  const showMessageHandler = message => {
    setShowMessage(true);
    setMessage(message);
    setIsError(false);
  };

  const showError = error => {
    setShowMessage(true);
    setMessage(error.message);
    setIsError(true);
    setIsLoading(false);
  };

  const onMessageDialogCloseClick = () => {
    setShowMessageDialog(false);
    navigate(-1);
  };

  const handleDateChange = date => {
    setData({ ...data, spentAt: date });
    setErrors({ ...errors, spentAt: "" });
  };

  return (
    <Container title={isEdit ? "Edit Expense" : "New Expense"}>
      <Prompt
        message="The expense you entered was saved successfully."
        open={showMessageDialog}
        handleClose={onMessageDialogCloseClick}
      />
      <CircularLoader isLoading={isLoading} />
      <Message
        title="Message"
        message={message}
        show={showMessage}
        isError={isError}
        onCloseClick={onMessageCloseClick}
        autoClose={!isError}
      />

      <Form id="expense" onSubmit={onSubmit} onCancel={onCancelClick}>
        <CustomTextField
          inputRef={idRef}
          error={!!errors.description}
          name="description"
          value={data.description}
          label="Expense description"
          onChange={onChange}
        />

        <Dropdown
          name="expenseType"
          value={data.expenseTypeId}
          error={!!errors.expenseType}
          datasource={expenseTypeIds}
          onChange={onExpenseTypeDropdownChange}
          placeholder=""
          label="Expense type"
        />

        <NumberTextField
          error={!!errors.amount}
          name="amount"
          value={data.amount}
          label="Amount"
          onChange={onChange}
        />

        {/* <CustomDatePicker
          error={!!errors.spentAt}
          name="spentAt"
          label="Spent At"
          value={data.spentAt}
          showTodayButton={true}
          handleDateChange={handleDateChange}
        /> */}
      </Form>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(AddNewExpense);
