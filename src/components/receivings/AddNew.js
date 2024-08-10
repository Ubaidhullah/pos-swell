import React, { useState, useEffect, useRef } from "react";
import * as equal from "fast-deep-equal";
import { useNavigate, useParams } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Container from "../controls/Container";
import Form from "../controls/Form";
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

const AddNew = ({ classes }) => {
  const initialData = {
    productId: "pen",
    vendorId: "mrlabs",
    qty: "1",
    price: "100",
    paid: "100",
    date: new Date()
  };

  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [vendorIds, setVendorIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const idRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const productPromise = await api.product.fetchAll();
        const productIds = productPromise.data.map(d => ({
          value: d.id,
          label: d.id
        }));

        const vendorPromise = await api.vendor.fetchAll();
        const vendorIds = vendorPromise.data.map(d => ({
          value: d.id,
          label: d.id
        }));

        setProductIds(productIds);
        setVendorIds(vendorIds);

        if (id) {
          const receivingPromise = await api.receiving.fetchById(id);
          const toEdit = receivingPromise.data;
          setData(toEdit);
          setIsEdit(true);
        }
      } catch (error) {
        displayMessage(error.message, true);
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

  const onProductIdDropdownChange = value => {
    const productId = value === null ? "" : value;
    setData({ ...data, productId });
    setErrors({ ...errors, productId: "" });
  };

  const onVendorIdDropdownChange = value => {
    const vendorId = value === null ? "" : value;
    setData({ ...data, vendorId });
    setErrors({ ...errors, vendorId: "" });
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
      data.price = Number(data.price);
      data.paid = Number(data.paid);
      data.qty = Number(data.qty);

      if (!isEdit) {
        await createNew(data);
      } else {
        await update(data);
      }
    } catch (error) {
      displayError(error);
    }
  };

  const createNew = async data => {
    const res = await api.receiving.createNew(data);

    if (res.status === 200) {
      displayMessage("Saved successfully");
      clearForm();
    } else {
      throw new Error(`Unable to create the record. The status code is ${res.status}`);
    }
  };

  const update = async data => {
    const res = await api.receiving.update(id, data);

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
    setIsMessageVisible(false);
    setMessage("");
    setIsError(false);
  };

  const displayMessage = (message, isError = false) => {
    setIsMessageVisible(true);
    setMessage(message);
    setIsError(isError);
    setIsLoading(false);
  };

  const displayError = error => {
    setIsMessageVisible(true);
    setMessage(error.message);
    setIsError(true);
    setIsLoading(false);
  };

  const onMessageDialogCloseClick = () => {
    setShowMessageDialog(false);
    navigate(-1);
  };

  return (
    <Container title={isEdit ? "Edit Receiving" : "Add new receiving"}>
      <Prompt
        message="The item you entered was saved successfully."
        open={showMessageDialog}
        handleClose={onMessageDialogCloseClick}
      />
      <CircularLoader isLoading={isLoading} />
      <Message
        title="Message"
        message={message}
        show={isMessageVisible}
        isError={isError}
        onCloseClick={onMessageCloseClick}
        autoClose={!isError}
      />
      <Form
        id="AddNew"
        onSubmit={onSubmit}
        onCancel={onCancelClick}
        className={classes.form}
      >
        <Dropdown
          name="productId"
          value={data.productId}
          error={!!errors.productId}
          datasource={productIds}
          onChange={onProductIdDropdownChange}
          placeholder=""
          label="Products"
        />

        <Dropdown
          name="vendorId"
          value={data.vendorId}
          error={!!errors.vendorId}
          datasource={vendorIds}
          onChange={onVendorIdDropdownChange}
          placeholder=""
          label="Vendors"
        />

        <NumberTextField
          error={!!errors.qty}
          name="qty"
          value={data.qty}
          label="Qty"
          onChange={onChange}
        />

        <NumberTextField
          error={!!errors.price}
          name="price"
          value={data.price}
          label="Price"
          onChange={onChange}
        />

        <NumberTextField
          error={!!errors.paid}
          name="paid"
          value={data.paid}
          label="Enter amount Paid"
          onChange={onChange}
        />

        {/* <CustomDatePicker
          error={!!errors.date}
          name="date"
          value={data.date}
          label="Received At"
          showTodayButton={true}
          handleDateChange={onChange}
        /> */}
      </Form>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(AddNew);
