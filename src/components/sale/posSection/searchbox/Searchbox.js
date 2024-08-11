import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert, AutoComplete } from "antd";
import api from "../../../../api";
import { sleep } from "../../../../utils";
import { addItemToCart, updateCartItem } from "../../../../actions/cart";

class SearchBox extends Component {
  state = {
    showMessage: false,
    searchText: "",
    products: []
  };

  onChange = async value => {
    const searchText = value;

    if (!searchText || searchText.length < 3) {
      this.setState({ products: [], searchText });
      return;
    }

    this.setState({ searchText });

    try {
      const res = await api.product.searchByIdAndGetByPages(searchText);

      if (this.isExactMatch(searchText, res.data)) {
        await sleep(300);
        this.onSelected(res.data[0]);
      } else {
        this.setState({ products: res.data });
      }
    } catch (error) {
      this.setState({ showMessage: true });
    }
  };

  isExactMatch = (searchText, apiResults) => {
    if (apiResults.length === 0 || apiResults.length > 1) {
      return false;
    }
    const i = apiResults[0];
    return i.id === searchText || i.name === searchText;
  };

  onSelected = selectedItem => {
    this.setState({ searchText: "" });
    this.updateCart(selectedItem);
  };

  updateCart = item => {
    const { cart } = this.props;
    const existingItem = cart[item.id];

    if (existingItem) {
      const obj = this.constructCartObjForUpdate(existingItem);
      this.props.updateCartItem(obj);
    } else {
      const obj = this.constructCartObjForAddNew(item);
      this.props.addItemToCart(obj);
    }
  };

  constructCartObjForUpdate = obj => {
    return {
      ...obj,
      qty: obj.qty + 1
    };
  };

  constructCartObjForAddNew = obj => {
    return {
      ...obj,
      qty: 1,
      discount: 0,
      sellingPrice: obj.price,
      totalPrice: obj.price
    };
  };

  onMessageCloseClick = () => {
    this.setState({ showMessage: false });
  };

  render() {
    const { products, searchText, showMessage } = this.state;

    return (
      <Fragment>
        {showMessage && (
          <Alert
            message="Something went wrong. Please try again later"
            type="error"
            closable
            afterClose={this.onMessageCloseClick}
          />
        )}
        <AutoComplete
          value={searchText}
          options={products.map(product => ({ value: product.name }))}
          style={{ width: 450 }}
          onSelect={this.onSelected}
          onSearch={this.onChange}
          placeholder="Search products"
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  cart: cart.items
});

export default connect(mapStateToProps, { updateCartItem, addItemToCart })(SearchBox);
