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

// eslint-disable-next-line
const styles = theme => ({
  form: {
    marginLeft: 20
  },
  wrapper: {
    position: "relative"
  }
});

const AddNewProduct = ({ classes }) => {
  const initialData = {
    id: "",
    name: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    productTypeId: ""
  };

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [productTypeIds, setProductTypeIds] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    window.onbeforeunload = () => {
      sessionStorage.setItem("form", JSON.stringify(data));
    };

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
        showError(error);
      }
    };

    fetchData();
  }, [id]);

  const onChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onProductTypeDropdownChange = value => {
    const productTypeId = value === null ? "" : value;
    setData({ ...data, productTypeId });
    setErrors({ ...errors, productTypeId: "" });
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
      data.costPrice = Number(data.costPrice);
      data.sellingPrice = Number(data.sellingPrice);

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
    const res = await api.product.createNew(data);

    if (res.status === 200) {
      showMessageHandler("Saved successfully");
      clearForm();
    } else {
      throw new Error(`Unable to create the record. The status code is ${res.status}`);
    }
  };

  const update = async data => {
    const res = await api.product.update(id, data);

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

  return (
    <Container title={isEdit ? "Edit Product" : "New Product"}>
      <Prompt
        message="The product you entered was saved successfully."
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

      <Form
        id="product"
        onSubmit={onSubmit}
        onCancel={onCancelClick}
        className={classes.form}
      >
        <CustomTextField
          inputRef={idRef}
          error={!!errors.id}
          name="id"
          value={data.id}
          label="Product Id"
          helperText="This should be unique"
          onChange={onChange}
          disabled={isEdit}
        />

        <CustomTextField
          error={!!errors.name}
          name="name"
          value={data.name}
          label="Name"
          onChange={onChange}
        />

        <Dropdown
          name="productType"
          value={data.productTypeId}
          error={!!errors.productType}
          datasource={productTypeIds}
          onChange={onProductTypeDropdownChange}
          placeholder=""
          label="Product type"
        />

        <CustomTextField
          error={!!errors.description}
          name="description"
          value={data.description}
          label="Description"
          onChange={onChange}
        />

        <NumberTextField
          error={!!errors.costPrice}
          name="costPrice"
          value={data.costPrice}
          label="Cost price"
          onChange={onChange}
        />

        <NumberTextField
          error={!!errors.sellingPrice}
          name="sellingPrice"
          value={data.sellingPrice}
          label="Selling price"
          onChange={onChange}
        />
      </Form>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(AddNewProduct);
