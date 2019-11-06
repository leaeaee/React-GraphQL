import React, { Component } from 'react';

import './App.css';
import Router from './Router';
import Toolbar from './Toolbar/Toolbar';
import Footer from './Footer';
import SideDrawer from './SideDrawer/SideDrawer';
import Backdrop from './Backdrop/Backdrop';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    sideDrawerOpen: false,
    token: null,
    userId: null,
    isAdmin: null
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => ({ sideDrawerOpen: !prevState.sideDrawerOpen }));
  };

  backdropClickHandler = () => this.setState({ sideDrawerOpen: false });

  login = (token, userId, tokenExpiration, isAdmin) => {
    this.setState({ token, userId, isAdmin });
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('userId', userId);
    window.localStorage.setItem('isAdmin', isAdmin);
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    window.localStorage.setItem('token', '');
    window.localStorage.setItem('userId', '');
    // window.localStorage.setItem("isAdmin", "")
  };

  componentDidMount() {

    const token = window.localStorage.getItem('token');
    if (token && token.length > 0) {
      const userId = window.localStorage.getItem('userId');
      const isAdmin = window.localStorage.getItem('isAdmin');
      this.setState({ token, userId, isAdmin });
    }
  }

  render() {
    let backdrop;

    if (this.state.sideDrawerOpen) backdrop = <Backdrop click={this.backdropClickHandler} />;

    return (
      <AuthContext.Provider
        value={{
          token: this.state.token,
          userId: this.state.userId,
          isAdmin: this.state.isAdmin,
          login: this.login,
          logout: this.logout
        }}
      >
        <div className="page-container">
          <div className="main-page">
            <Toolbar
              drawerClickHandler={this.drawerToggleClickHandler}
              handleInput={this.searchHandler}
              handleClick={this.filterClickHandler}
            />
            <SideDrawer show={this.state.sideDrawerOpen} />
            {backdrop}
            <Router />
          </div>
        </div>
        <Footer />
      </AuthContext.Provider>
    );
  }
}

export default App;
