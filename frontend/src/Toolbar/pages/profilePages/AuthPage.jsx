import React, { Component } from 'react';
import '../../../App.css';
import AuthContext from '../../../context/auth-context';
import './OrdersList.css'

class AuthPage extends Component {
  state = {
    isLogin: true,
    ordersProducts: [],
    ordersList: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  componentDidMount() {
    this.fetchOrders();
  }

  switchModeHandler = () => {
    //samo formuliramo drugačiji state
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = this.state.isLogin
      ? {
          query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
              isAdmin
            }
          }
      `
        }
      : {
          query: `
          mutation {
            createUser(email: "${email}", password: "${password}") {
              email
              password
              isAdmin
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
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration,
            resData.data.login.isAdmin
          );
        }
      })
      .catch(err => console.log(err));
  };
  fetchOrders = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            orders {
             products {
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
        console.log('ORDERS on profile', resData.data);
        const ordersList = resData.data.orders.filter(order => order !== null);
        const ordersProducts = ordersList.map(order => order.products);
        this.setState({ ordersList: ordersList, isLoading: false, ordersProducts });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <AuthContext.Consumer>
        {context => {
          return (
            <div>
              {!context.token && (
                <form className="auth-form" onSubmit={this.submitHandler}>
                  <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl} />
                  </div>
                  <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                  </div>
                  <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>
                      Switch to {this.state.isLogin ? 'Signup' : 'Login'}
                      {/* ako je true zelimo switch to sign up, ako nismo u login modu onda zelimo switch to login. 
                      klikom na ovaj btn možemo promjeniti hoćemo li se Signup-at ili Login-at*/}
                    </button>
                  </div>
                </form>
              )}
              <div className="orders__list">
                {console.log('Iz AuthPage-a ordersList', this.state.ordersList)}
                <ul>
                {context.token && (
                  <div>
                    <div className="orders__title"><strong>Orders list:</strong></div>
                      {this.state.ordersList.map((order, id) =>
                        order.products.map(orderProduct => {
                          return (
                            <li className="orders__item" key={orderProduct.title}>
                              Order Number {id + 1}
                              <div className="orders__list-data" key={orderProduct.id}>
                                {orderProduct.title} - ${orderProduct.price}
                              </div>
                            </li>
                          );
                        })
                      )}
                  </div>
                )}
                </ul>
              </div>
            </div>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

export default AuthPage;
