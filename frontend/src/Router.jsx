import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import FavoritePage from './pages/FavoritePage';
import AuthPage from './pages/AuthPage';
import Man from './pages/Man';
import Woman from './pages/Woman';
import Kids from './pages/Kids';
import AuthContext from './context/auth-context';

 const Router = props => (
   <AuthContext.Consumer>
    {context => {
      return (
        <div>
            <Route path='/home' component={HomePage}/>
            <Route path='/profile' component={AuthPage}/>
            {context.token && <Redirect from='/profile' to='/home'/>}
            <Route path='/cart' component={CartPage}/>
            <Route path='/favorite' component={FavoritePage}/>
            <Route path='/Man' component={Man}/>
            <Route path='/Woman' component={Woman}/>
            <Route path='/Kids' component={Kids}/>
        </div>
    )}}
    </AuthContext.Consumer>
  )
export default Router;
