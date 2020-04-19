import React, { Component } from 'react';

import Modal from '../../../HomePage/modal/Modal';
import Backdrop from '../../../additions/backdrop/Backdrop';
import AuthContext from '../../../context/auth-context';
import Spinner from '../../../additions/spinner/Spinner';
import CartList from './CartList';

class Cart extends Component {
  state = {
    isLoading: false,
    cartList: [],
    productsList: [],
    selectedProduct: null,
    orderedProducts: [],
    orderPrice: ''
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchCartsItem();
  }
  modalCancelHandler = () => this.setState({ selectedProduct: null });

  fetchCartsItem = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            cart {
              _id
             createdAt
             size
             product {
               _id
               title
               price
               description
               date
             }
            }
          }
        `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        console.log('CART', resData.data.cart);
        const cartList = resData.data.cart.filter(item => item !== null);
        const productsList = cartList.map(cart => cart.product);
        this.setState({ cartList: cartList, isLoading: false, productsList });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  removeFromCart = cartId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation {
          removeFromCart(cartId: "${cartId}"){
            _id
          }
        }
        `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevStat => {
          const updatedCart = prevStat.cartList.filter(product => product._id !== cartId);
          return { cartList: updatedCart, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  handleOrderAll = () => {
    const productsForRequest = this.state.productsList.map(p => ({
      title: p.title,
      description: p.description,
      price: p.price,
      date: p.date
    }));

    const graphqlCompatibleArrayString =
      '[' +
      productsForRequest.map(
        p => `{
          title: "${p.title}",
          description: "${p.description}",
          price: ${p.price},
          date: "${p.date}",
        }`
      ) +
      ']';

    const requestBody = {
      query: `
      mutation {
        makeOrder(
          order: {
            products: ${graphqlCompatibleArrayString}
          } ) {
          products {
            title
            price
          }
        }
      }`
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        console.log('MAKE ORDER RESULT:', resData.data.makeOrder.products)
        const orderedProducts = resData.data.makeOrder.products.filter(item => item !== null);
        this.setState({ orderedProducts: orderedProducts });        
      })
      .catch(err => console.log(err));
  };

  // totalOrderPrice = () => {
  //   console.log('kod izračuna', this.state.orderedProducts.price)
  //   const res = this.state.orderedProducts.price.reduce((total,currentValue) => {
  //     return total + currentValue;
  //   });
  //   console.log('Rezultat naruđbe', res);
  //   return res;
  // };

  render() {
    return (
      <div>
        <p>
        </p>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <CartList
            cartList={this.state.cartList}
            onDelete={this.removeFromCart}
            handleOrderAll={this.handleOrderAll}
            orderedProducts={this.state.orderedProducts}
            totalOrderPrice={this.totalOrderPrice}
          />
        )}
        {console.log('Ordered products state', this.state.orderedProducts)}
        {this.state.selectedProduct && <Backdrop />}
        {this.state.selectedProduct && (
          <Modal
            title={this.state.selectedProduct.product.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.orderProductHandler}
            confirmText={this.context.token ? 'Order' : 'Confirm'}
            selectedSize={this.state.selectedSize}
          >
            <h1>{this.state.selectedProduct.product.title}</h1>
            <h2>${this.state.selectedProduct.product.price}</h2>
            {/* <p>{this.state.selectedProduct.description}</p> */}
          </Modal>
        )}
      </div>
    );
  }
}

export default Cart;
