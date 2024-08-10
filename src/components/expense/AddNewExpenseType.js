import React, { useState, useEffect, useRef } from "react";
import * as equal from "fast-deep-equal";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../controls/Container";
import Form from "../controls/Form";
import CustomTextField from "../controls/textfields/CustomTextField";
import { isValueExists } from "../../utils";
import api from "../../api";
import Message from "../controls/Message";
import Prompt from "../controls/dialog/Prompt";
import CircularLoader from "../controls/loader/CircularLoader";

const AddNewExpenseType = () => {
  const initialData = {
    id: "",
    description: ""
  };

  const [data, setData] = useState(initialData);
  const [showMessage, setShowMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        const res = await api.expenseType.fetchById(id);
        setData(res.data);
        setIsEdit(true);
      } catch (error) {
        showMessageHandler(error.message, true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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

    const validationErrors = isValueExists(data, ["description"]);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isEdit) {
        await update();
      } else {
        await createNew();
      }
    } catch (error) {
      showMessageHandler(error.message, true);
    }
  };

  const createNew = async () => {
    const res = await api.expenseType.createNew(data);

    if (res.status === 200) {
      showMessageHandler("Saved successfully");
      clearForm();
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  const update = async () => {
    const res = await api.expenseType.update(id, data);

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

  const showMessageHandler = (message, isError = false) => {
    setShowMessage(true);
    setMessage(message);
    setIsError(isError);
    setIsLoading(false);
  };

  const onMessageDialogCloseClick = () => {
    setShowMessageDialog(false);
    navigate(-1);
  };

  return (
    <Container title={isEdit ? "Edit expense type" : "New expense type"}>
      <Message
        title="Message"
        message={message}
        show={showMessage}
        isError={isError}
        autoClose={!isError}
        onCloseClick={onMessageCloseClick}
      />

      <Prompt
        message="The expense type you entered was saved successfully."
        open={showMessageDialog}
        handleClose={onMessageDialogCloseClick}
      />
      <CircularLoader isLoading={isLoading} />

      <Form id="expenseType" onSubmit={onSubmit} onCancel={onCancelClick}>
        <CustomTextField
          inputRef={idRef}
          error={!!errors.id}
          name="id"
          value={data.id}
          label="Expense type Id"
          helperText="This should be unique"
          onChange={onChange}
          disabled={isEdit}
        />
        <br />

        <CustomTextField
          name="description"
          value={data.description}
          label="Description"
          onChange={onChange}
        />
      </Form>
    </Container>
  );
};

export default AddNewExpenseType;
