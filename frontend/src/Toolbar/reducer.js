const initialState = {
  filterName: '',
  searchTerm: '',
  reset: ''
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NAME':
      return {
        ...state,
        filterName: action.name
      };
    case 'ADD_TERM':
      return {
        ...state,
        searchTerm: action.term
      };
    case 'RESET':
      return {
        ...state,
        reset: action.reset
      }
    default:
      return state;
  }
};

export default filterReducer;
