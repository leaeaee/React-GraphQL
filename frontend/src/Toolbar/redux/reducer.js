import * as actionTypes from './actions';

const initialState = {
  filterName: '',
  searchTerm: '',
  reset: ''
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_NAME:
      return {
        ...state,
        filterName: action.name
      };
    case actionTypes.ADD_TERM:
      return {
        ...state,
        searchTerm: action.term
      };
    case actionTypes.RESET:
      return {
        ...state,
        filterName: action.reset,
        searchTerm: action.reset
      }
    default:
      return state;
  }
};

export default filterReducer;
