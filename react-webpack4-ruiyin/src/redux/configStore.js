import { createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import Index from './modules/index.js'
// import user from './modules/user.js'

const reducer = combineReducers({
  Index,
  // user,
})

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore); 

const configureStore = (initialState) =>compose(createStoreWithMiddleware(reducer, initialState)); 

export default configureStore;