import React, { Component} from 'react';

import AuthContext from '../../context/auth-context'
import Spinner from '../../Spinner/Spinner'
import FavoritesList from './FavoritesList'

class Favorites extends Component{
  state = {
    isLoading: false,
    favoritesList: [],
  }

  static contextType = AuthContext;

  componentDidMount(){
    this.fetchFavoritesItem();
  }

  fetchFavoritesItem = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            favorites {
              _id
             createdAt
             product {
              _id
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const favoritesList = resData.data.favorites.filter(item => item !== null);
        this.setState({ favoritesList: favoritesList, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  removeFromFavorites = favoritesId => {
    console.log('removeFromFav', favoritesId);
    this.setState({isLoading: true})
    const requestBody = {
      query: `
          mutation{
            removeFromFavorites(favoritesId: "${favoritesId}"){
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
        'Authorization': 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!');
        return res.json();
      })
      .then(resData => {
        this.setState(prevStat => {
          const updatedFavorites = prevStat.favoritesList.filter(product => {
            return product._id !== favoritesId;
          })
          return {favoritesList: updatedFavorites, isLoading: false}
        })
      })
      .catch(err => {
        console.log(err);
        this.setState({isLoading: false})
      });
  }

  render(){
  return (
      <div>
        {this.state.isLoading
          ? <Spinner />
          : (<FavoritesList
            favoritesList={this.state.favoritesList}
            onDelete={this.removeFromFavorites}
          />)}
    </div>
    )
  }
}

export default Favorites;
