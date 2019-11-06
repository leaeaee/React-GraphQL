import React, { Component } from 'react';

import Modal from '../modal/Modal';
import Backdrop from '../../Backdrop/Backdrop';
import AuthContext from '../../context/auth-context';
import './CreateProduct.css';

class ProductsPage extends Component {
  state = {
    creating: false,
    products: [],
    selectedProduct: null
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  startCreateProductHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const product = { title, price, date, description };
    console.log(product);

    const requestBody = {
      query: `
          mutation {
            createProduct(productInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
            }
          }
        `
    };

    const token = this.context.token;

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
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
          const updatedProducts = [...prevState.products]
          updatedProducts.push({
            _id: resData.data.createProduct._id,
            title: resData.data.createProduct.title,
            description: resData.data.createProduct.description,
            date: resData.data.createProduct.date,
            price: resData.data.createProduct.price,
            creator: {
              _id: this.context.userId
            }
          })
          return {products: updatedProducts}
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false});
  };


  render() {

    return (
      <React.Fragment>
      {this.state.creating && <Backdrop />}
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
                 <textarea
                   id="description"
                   rows="3"
                   ref={this.descriptionElRef}
                 />
               </div>
             </form>
          </Modal>
      )}
        {this.context.token && (
          <div className="products-control">
            <p>Share your own Products!</p>
            <button className="btn" onClick={this.startCreateProductHandler}>
              Create Product
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default CreateProduct;
