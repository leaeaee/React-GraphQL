const favoriteWithoutItem = (favorite, product) => favorite.filter(favoriteItem => favoriteItem.id !== product.id )

const itemInFavorite = (favorite, product) => favorite.filter(favoriteItem => favoriteItem.id === product.id )[0]

const addToFavorite = (favorite, product) => {
const favoriteItem = itemInFavorite(favorite, product)
  return favoriteItem === undefined
  ? [ ...favoriteWithoutItem(favorite, product), { ...product}]
  : [ ...favoriteWithoutItem(favorite, product)]
}

const removeFromFavorite = (favorite, product) => {
  return [...favoriteWithoutItem(favorite, product)]
}


const favoriteReducer = (state=[], action) => {
  switch(action.type){
    case 'ADD_F':
      return addToFavorite(state, action.payload)

    case 'REMOVE_F':
      return removeFromFavorite(state, action.payload )

    default:
      return state;
  }
}

export default favoriteReducer;
