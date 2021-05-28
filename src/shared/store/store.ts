import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { businessReducer, customerReducer, locationReducer, signUpReducer, systemReducer } from './reducers';

const rootReducer = combineReducers({
  system: systemReducer,
  business: businessReducer,
  customer: customerReducer,
  signUp: signUpReducer,
  location: locationReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
