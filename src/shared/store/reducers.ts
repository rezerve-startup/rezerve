import { SystemState, SystemActionTypes, UPDATE_SESSION, BusinessActionTypes, UPDATE_BUSINESS_NAME, BusinessState } from './types';

const initialSystemState: SystemState = {
  loggedIn: false,
  session: '',
  userName: '',
};

export function systemReducer(
  state = initialSystemState,
  action: SystemActionTypes,
): SystemState {
  switch (action.type) {
    case UPDATE_SESSION: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

const initialBusinessState: BusinessState = {
  businessName: '3cut Barbershop'
}

export function businessReducer(
  state = initialBusinessState,
  action: BusinessActionTypes
): BusinessState {
  switch (action.type) {
    case UPDATE_BUSINESS_NAME: {
      return {
        ...state,
        businessName: action.payload
      };
    }
    default:
      return state;
  }
}