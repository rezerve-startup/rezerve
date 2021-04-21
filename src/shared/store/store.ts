import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { businessReducer, customerReducer, signUpReducer, systemReducer } from './reducers';

const rootReducer = combineReducers({
  system: systemReducer,
  business: businessReducer,
  customer: customerReducer,
  signUp: signUpReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
