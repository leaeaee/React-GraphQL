import React, { Component } from 'react';

import ProductListing from './ProductListing';
import Modal from './modal/Modal';
import Backdrop from '../additions/backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import Spinner from '../additions/spinner/Spinner';
import './HomePage.css';

class HomePage extends Component {
  state = {
    creating: false,
    isLoading: false,
    products: [],
    selectedProduct: null,
    size: ['S', 'M', 'L', 'XL'],
    selectedSize: '',
    clickedProduct: '',
    favoritesId: ''
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchProducts();
  }

  handleClick(size) {
    let newSize = '';
    if (this.state.selectedSize !== size) newSize = size;
    this.setState({ selectedSize: newSize });
  }

  modalCancelHandler = () => this.setState({ selectedProduct: null, creating: false });

  addToCartHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedProduct: null });
      return;
    }
    if (this.state.selectedSize === '') {
      alert('Select size!!');
      return;
    }
    console.log('selectedProduct', this.state.selectedProduct);
    const requestBody = {
      query: `
          mutation {
            addToCart(productId: "${this.state.selectedProduct._id}", size: "${this.state.selectedSize}"){
              _id
              product {
                title
                description
                price
              }
              user {
                email
                password
                isAdmin
              }
              size
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
        if (res.status !== 200 && res.status !== 201)
          throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        console.log('Add to cart data:', resData);
        this.setState({ selectedProduct: false, selectedSize: '' });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  fetchProducts() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            products {
              _id
              title
              description
              date
              price
            }
          }
        `
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        let products;
        if (resData.data && resData.data.products) products = resData.data.products;

        products && this.isActive
          ? this.setState({ products: products, isLoading: false })
          : this.setState({ isLoading: true });
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) this.setState({ isLoading: false });
      });
  }

  startCreateProductHandler = () => this.setState({ creating: true });

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) return;

    const requestBody = {
      query: `
        mutation {
          createProduct(productData: { 
            title: "${title}",
            description: "${description}",
            price: ${price},
            date: "${date}"
          }) {
              _id
              title
              description
              price
              date
            }
        }`
    };

    const token = this.context.token;

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedProducts = [...prevState.products];
          updatedProducts.push({
            _id: resData.data.createProduct._id,
            title: resData.data.createProduct.title,
            description: resData.data.createProduct.description,
            date: resData.data.createProduct.date,
            price: resData.data.createProduct.price,
            creator: {
              _id: this.context.userId
            }
          });
          return { products: updatedProducts };
        });
      })
      .catch(err => console.log(err));
  };

  deleteProduct = productId => {
    console.log('delete product HomePage', productId);    
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation {
            deleteProduct(productId: "${productId}"){
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
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        this.setState(prevStat => {
          const updatedProducts = prevStat.products.filter(product => product._id !== productId);
          return { products: updatedProducts, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  addToCartTrigger = productId => {
    this.setState(prevState => {
      const selectedProduct = prevState.products.find(p => p._id === productId);
      return { selectedProduct: selectedProduct };
    });
  };

  addToFavoritesHandler = productId => {
    if (!this.context.token) return;
    const requestBody = {
      query: `
          mutation {
            addToFavorites(productId: "${productId}"){
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
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {this.setState({ favoritesId: productId })
    console.log('Favorites', resData)})
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <div>
        {this.context.token && this.context.isAdmin && (
          <div className="products-control">
            <p>Share your own Products!</p>
            <button className="btn" onClick={this.startCreateProductHandler}>
              Create Product
            </button>
          </div>
        )}
        {this.state.creating && <Backdrop   />}
        {this.state.creating && (
          <Modal
            title="Add Product"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="3" ref={this.descriptionElRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedProduct && <Backdrop />}
        {this.state.selectedProduct && (
          <Modal
            title={this.state.selectedProduct.title}
            canCancel
            canConfirm={this.state.selectedSize.length > 0 ? true : false}
            onCancel={this.modalCancelHandler}
            onConfirm={this.addToCartHandler}
            confirmText={this.context.token ? 'Add to Cart' : 'Confirm'}
            selectedSize={this.state.selectedSize}
          >
            <h3>Select a size:</h3>
            <ul className="size">
              {this.state.size.map(oneSize => (
                <li
                  className={this.state.selectedSize === oneSize ? 'size-selected' : ''}
                  key={oneSize}
                  onClick={() => this.handleClick(oneSize)}
                >
                  <strong>{oneSize}</strong>
                </li>
              ))}
            </ul>
            <h5>${this.state.selectedProduct.price}</h5>
            <p>{this.state.selectedProduct.description}</p>
          </Modal>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ProductListing
            products={this.state.products}
            authUserId={this.context.userId}
            addToCartTrigger={this.addToCartTrigger}
            deleteProduct={this.deleteProduct}
            addToFavorites={this.addToFavoritesHandler}
            favoritesId={this.state.favoritesId}
          />
        )}
      </div>
    );
  }
}

export default HomePage;
