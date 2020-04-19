import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import HomePage from './HomePage/HomePage';
import CartPage from './Toolbar/pages/cartPage/CartPage';
import FavoritePage from './Toolbar/pages/favoritesPage/FavoritesPage';
import AuthPage from './Toolbar/pages/profilePages/AuthPage';
import Man from './Toolbar/pages/filtersPages/Man';
import Woman from './Toolbar/pages/filtersPages/Woman';
import Kids from './Toolbar/pages/filtersPages/Kids';
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
