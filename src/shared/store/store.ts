import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { businessReducer, customerReducer, systemReducer } from './reducers';

const rootReducer = combineReducers({
  system: systemReducer,
  business: businessReducer,
  customer: customerReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
