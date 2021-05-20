import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { businessReducer, customerReducer, signUpReducer, systemReducer } from './reducers';
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
  system: systemReducer,
  business: businessReducer,
  customer: customerReducer,
  signUp: signUpReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
