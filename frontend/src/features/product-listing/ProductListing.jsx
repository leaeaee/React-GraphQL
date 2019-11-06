import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductListItem from './product-list-item';

class ProductListing extends Component {
  render() {
    let items = this.props.products;

    if (this.props.searchTerm.length > 0) {
      items = items.filter(item => item.title.toLowerCase().includes(this.props.searchTerm.toLowerCase()));
    }

    if (this.props.filterName.length > 0) {
      console.log(this.props.filterName);
      items = items.filter(item => item.description.length === this.props.filterName.length);
    }

    if (this.props.reset.length > 0) {
      items = this.props.products;
    }
    
      return (
        <div className="product-listing">
          {items.map(product => (
            <ProductListItem
              product={product}
              key={product._id}
              userId={this.props.authUserId}
              onAddToCartTrigger={this.props.addToCartTrigger}
              addToFavorites={this.props.addToFavorites}
              deleteProduct={this.props.deleteProduct}
              favoritesId={this.props.favoritesId}
            />
          ))}
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    filterName: state.filter.filterName,
    searchTerm: state.filter.searchTerm,
    reset: state.filter.reset
  };
};

export default connect(
  mapStateToProps,
  null
)(ProductListing);
