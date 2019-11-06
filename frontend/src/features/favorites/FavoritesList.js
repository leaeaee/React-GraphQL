import React, {Component} from 'react'

import './FavoritesList.css'

class favoritesList extends Component{
  render() {
    return (
      <div className="favorites__list">
       <ul>
       <div className="favorites__title"><strong>Favorites list:</strong></div>
       {this.props.favoritesList.map(favorites => {
           // if(favorites){
             return (
               <li className="favorites__item" key={favorites._id}>
                  <div className="favorites__list-data">
                    {favorites.product.title} - ${favorites.product.price}
                  </div>
                 <div>
                   <button className="btn" onClick={this.props.onDelete.bind(this, favorites._id)}>Delete</button>
                 </div>
               </li>
            )
          // }
           })
           }
       </ul>
    </div>
    )
  }
}

export default favoritesList;
