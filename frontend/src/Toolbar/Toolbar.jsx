import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import './Toolbar.css';
import DrawerToggleButton from '../additions/sideDrawer/DrawerToggleButton';
import AuthContext from '../context/auth-context';
import * as actionTypes from './redux/actions';

class Toolbar extends React.Component {
  state = {
    filter: [{ name: 'Man', id: '1' }, { name: 'Woman', id: '2' }, { name: 'Kids', id: '3' }]
  };

  render() {
    return (
      <AuthContext.Consumer>
        {context => {
          return (
            <div>
              <header className="toolbar">
                <nav className="toolbar__navigation">
                  <div className="toolbar__toggle-button">
                    <DrawerToggleButton click={this.props.drawerClickHandler} />
                  </div>
                  <div className="toolbar__home">
                    <NavLink to="/home" onClick={() => this.props.resetFilters('')}>
                      Home
                    </NavLink>
                  </div>
                  <div className="tooolbar_navigation-items">
                    <ul>
                      {this.state.filter.map(f => (
                        <li key={f.id}>
                          <NavLink
                            to={f.name}
                            onClick={() => {
                              this.props.handleClick(f.name);
                              // this.props.resetFilters('');
                            }}
                          >
                            {f.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="spacer" />
                  <form className="toolbar__search-container" action="/action_page.php">
                    <input
                      type="text"
                      placeholder="Search..."
                      onChange={e => {
                        this.props.handleInput(e.target.value.toLowerCase());
                        // this.props.resetFilters(''); //--- još proucit, s ovim i bez ovoga
                        }
                      }
                      value={this.props.searchTerm}
                      name="search"
                    ></input>
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </form>
                  <div className="tooolbar_navigation-icons">
                    <ul>
                      {context.token && (
                        <li>
                          <i className="material-icons">
                            <NavLink to="/cart">shopping_cart</NavLink>
                          </i>
                        </li>
                      )}
                      <li>
                        <i className="material-icons">
                          <NavLink to="/favorite">favorite</NavLink>
                        </i>
                      </li>
                      <li>
                        <i className="material-icons">
                          <NavLink to="/profile">person</NavLink>
                        </i>
                      </li>
                      {context.token && (
                        <li>
                          <button onClick={context.logout}>Logout</button>
                        </li>
                      )}
                    </ul>
                  </div>
                </nav>
              </header>
            </div>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchTerm: state.filter.searchTerm
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetFilters: reset => dispatch({ type: actionTypes.RESET, reset }),
    handleClick: name => dispatch({ type: actionTypes.ADD_NAME, name }),
    handleInput: term => dispatch({ type: actionTypes.ADD_TERM, term })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
