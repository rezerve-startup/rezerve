import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { businessReducer, systemReducer } from './reducers';

const rootReducer = combineReducers({
  system: systemReducer,
  business: businessReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
