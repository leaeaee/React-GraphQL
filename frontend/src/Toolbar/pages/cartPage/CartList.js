import React from 'react';

import './CartList.css';

const cartList = props => {
  return (
    <div className="cart__list">
      <ul>
      <div className="cart__title"><strong>Cart list:</strong></div>
        {props.cartList.map(cart => {
          return (
            <li className="cart__item" key={cart._id}>
              <div className="cart__list-data">
                {cart.product.title} - ${cart.product.price}
              </div>
              <div>
                <button className="btn" onClick={() => props.onDelete(cart._id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
        {(props.cartList.length > 0) && (
        <button className="btn" onClick={() => props.handleOrderAll()}>
          ORDER ALL
        </button>)}
        <span><strong>{(props.orderedProducts.length > 0) ? "Ordered!!" : ''}</strong></span>
        {/* <span><strong>{(props.orderedProducts.length > 0) ? (() => props.totalOrderPrice) : ''}</strong></span> */}
        
      </ul>
    </div>
  );
};

export default cartList;
