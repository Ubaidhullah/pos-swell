import React, { Component } from "react";
import currency from "currency.js";
import { connect } from "react-redux";
import { Table, Modal, Button } from "antd";
import * as cartActions from "../../../../actions/cart";
import { getCartItemsArraySelector } from "../../../../selectors";
import EditCartItem from "../editCartItem/EditCartItem";
import CartHeader from "./cartHeader";
import CartBody from "./cartBody";
import CartFooter from "./cartFooter";

class CartTable extends Component {
  state = {
    showConfirmDeleteDialog: false,
    showEditDialog: false,
    itemToEdit: {
      id: "",
      name: "",
      qty: "",
      price: "",
      discount: ""
    }
  };

  onChange = e => {
    const { itemToEdit } = this.state;
    const updatedItem = {
      ...itemToEdit,
      [e.target.name]: e.target.value
    };

    const { qty, discount } = updatedItem;

    const sellingPrice = currency(updatedItem.price).subtract(discount);
    const totalPrice = currency(sellingPrice).multiply(qty);

    this.setState({
      itemToEdit: {
        ...updatedItem,
        qty: qty === "" ? "" : Number(qty),
        discount: discount === "" ? "" : discount,
        sellingPrice: sellingPrice.toString(),
        totalPrice: totalPrice.toString()
      }
    });
  };

  onConfirmDeleteClick = () => {
    this.props.emptyCart();
    this.setState({ showConfirmDeleteDialog: false });
  };

  onDeleteAllClick = () => {
    this.setState({ showConfirmDeleteDialog: true });
  };

  onDeleteCartItemClick = row => {
    this.props.removeItemFromCart(row);
  };

  onCancelConfirmDeleteClick = () => {
    this.setState({ showConfirmDeleteDialog: false });
  };

  onProductItemClick = itemToEdit => {
    this.setState({ itemToEdit, showEditDialog: true });
  };

  onCancelEditItemClick = () => {
    this.setState({ showEditDialog: false, itemToEdit: this.initialCartItem });
  };

  onSaveItemClick = () => {
    const { itemToEdit } = this.state;
    this.props.updateCartItem(itemToEdit);
    this.setState({ showEditDialog: false, itemToEdit: this.initialCartItem });
  };

  render() {
    const { showConfirmDeleteDialog, showEditDialog, itemToEdit } = this.state;
    const { cartArray, cartObj } = this.props;

    const columns = [
      // Define your table columns here
    ];

    return (
      <>
        <Modal
          title="Confirm Deletion"
          visible={showConfirmDeleteDialog}
          onOk={this.onConfirmDeleteClick}
          onCancel={this.onCancelConfirmDeleteClick}
        >
          Are you sure you want to empty the cart?
        </Modal>

        <EditCartItem
          cartObj={cartObj}
          visible={showEditDialog}
          item={itemToEdit}
          onSave={this.onSaveItemClick}
          onCancel={this.onCancelEditItemClick}
          onChange={this.onChange}
        />

        <Table
          columns={columns}
          dataSource={cartArray}
          rowKey="id"
          footer={() => <CartFooter summary={cartObj.summary} />}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  cartArray: getCartItemsArraySelector(state),
  cartObj: state.cart
});

const mapDispatchToProps = {
  emptyCart: cartActions.emptyCart,
  removeItemFromCart: cartActions.removeItemFromCart,
  updateCartItem: cartActions.updateCartItem
};

export default connect(mapStateToProps, mapDispatchToProps)(CartTable);
