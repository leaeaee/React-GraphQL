import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

class ProductListItem extends Component {

  render(){
    return (
      <AuthContext.Consumer>
        {context => {
          return (
          <div className="product-div">
            <ul className="product__list">
                <li className="products__list-item">

                      <div className="item__image">
                            <img
                              alt="itemImg"
                              title={this.props.product.title}
                              src={`/products/${this.props.product.title}.jpg`}
                            />
                      </div>

                      <div className="item__detail">
                            <h4>{this.props.product.title}</h4>
                              <p><span>${this.props.product.price} </span><i
                                className={this.props.favoritesId === this.props.product._id ? 'material-icons selected' : 'material-icons'}
                                onClick={this.props.addToFavorites.bind(this, this.props.product._id)}>favorite</i>
                              </p>
                              
                            {context.token && (
                                <button className="btn" data-target="modal"
                                  onClick={this.props.onAddToCartTrigger.bind(this, this.props.product._id)}>Add to cart
                                </button>)}
                                {context.token && context.isAdmin && (
                                <button className="btn"
                                  onClick={this.props.deleteProduct.bind(this, this.props.product._id)}>Delete product
                                </button>
                            )}
                      </div>

                </li>
            </ul>
          </div>
          )
        }}
     </AuthContext.Consumer>
    )
  }
}

export default ProductListItem;
