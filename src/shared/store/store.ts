import { combineReducers } from 'redux';
import { systemReducer } from './reducers';

export const rootReducer = combineReducers({
  system: systemReducer,
});
