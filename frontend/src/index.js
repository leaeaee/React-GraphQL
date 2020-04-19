import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import App from './App';
import store from './Toolbar/redux/store';

const app = <Provider store={store}>
  <BrowserRouter>
    <Switch>
      <App />
    </Switch>
  </BrowserRouter>
</Provider>

ReactDOM.render(app, document.getElementById('root'));
