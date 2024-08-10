import React, { useState, useEffect, useRef } from "react";
import * as equal from "fast-deep-equal";
import { useNavigate, useParams } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Container from "../controls/Container";
import Form from "../controls/Form";
import { isValueExists, isValidEmail } from "../../utils";
import CustomTextField from "../controls/textfields/CustomTextField";
import api from "../../api";
import Prompt from "../controls/dialog/Prompt";
import CircularLoader from "../controls/loader/CircularLoader";
import Message from "../controls/Message";

const styles = theme => ({
  form: {
    marginLeft: 20
  }
});

const AddNew = ({ classes }) => {
  const initialData = {
    id: "",
    name: "",
    address: "",
    mobile: "",
    description: "",
    email: ""
  };

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          return;
        }

        setIsLoading(true);

        const res = await api.customer.fetchById(id);

        setData(res.data);
        setIsLoading(false);
        setIsEdit(true);
      } catch (error) {
        showMessage(error.message, true);
      }
    };

    fetchData();
  }, [id]);

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onMobileInputChange = e => {
    const mobile = e.target.value;

    setErrors({ ...errors, mobile: null });

    if (mobile.toString().length > 10) {
      return;
    }
    if (mobile.toString() === "") {
      setData({
        ...data,
        mobile: ""
      });
    } else if (!isNaN(mobile)) {
      setData({
        ...data,
        mobile
      });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
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
    const res = await api.customer.createNew(data);

    if (res.status === 200) {
      showMessage("Saved successfully");
      clearForm();
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  const update = async data => {
    const res = await api.customer.update(id, data);

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

  const displayMessage = message => {
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

  const validate = () => {
    let validationErrors = isValueExists(data);

    if (data.mobile.length !== 10) {
      validationErrors = {
        ...validationErrors,
        mobile: "Invalid mobile number."
      };
    }

    if (!isValidEmail(data.email)) {
      validationErrors = {
        ...validationErrors,
        email: "Invalid email id."
      };
    }

    return validationErrors;
  };

  const onCancelClick = () => {
    const isDirty = !equal(initialData, data);

    if (isDirty && !isEdit) {
      clearForm();
      return;
    }

    navigate(-1);
  };

  return (
    <Container title={isEdit ? "Edit customer" : "New customer"}>
      <Prompt
        message="The customer you entered was saved successfully."
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

      <Form id="customer" onSubmit={onSubmit} onCancel={onCancelClick}>
        <CustomTextField
          error={!!errors.id}
          name="id"
          value={data.id}
          label="Customer Id"
          helperText="This should be unique (can give mobile number)"
          onChange={onChange}
          disabled={isEdit}
          inputRef={idRef}
        />
        <br />
        <CustomTextField
          error={!!errors.name}
          name="name"
          value={data.name}
          label="Customer Name"
          margin="normal"
          onChange={onChange}
        />
        <CustomTextField
          name="description"
          value={data.description}
          label="Description"
          margin="normal"
          onChange={onChange}
        />
        <CustomTextField
          error={!!errors.address}
          name="address"
          value={data.address}
          label="Address"
          margin="normal"
          onChange={onChange}
        />
        <CustomTextField
          error={!!errors.mobile}
          name="mobile"
          value={data.mobile}
          label="Mobile"
          margin="normal"
          onChange={onMobileInputChange}
        />
        <CustomTextField
          error={!!errors.email}
          name="email"
          value={data.email}
          label="Email Id"
          margin="normal"
          onChange={onChange}
        />
      </Form>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(AddNew);
