import { createStore, combineReducers } from 'redux';
import filterReducer from '../Toolbar/reducer';

 const rootReducer = combineReducers ({
    filter: filterReducer
   })

 const store = createStore(
   rootReducer,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 )

 export default store
