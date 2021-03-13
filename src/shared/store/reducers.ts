import {
  SystemState,
  SystemActionTypes,
  UPDATE_SESSION,
  BusinessActionTypes,
  UPDATE_BUSINESS_NAME,
  BusinessState,
  UPDATE_USER,
  CustomerState,
  CustomerActionTypes,
  UPDATE_CUSTOMER_PAST_APPOINTMENTS,
  UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS,
  ADD_FOUND_BUSINESS,
  CLEAR_FOUND_BUSINESSES
} from './types';

const initialSystemState: SystemState = {
  loggedIn: false,
  session: '',
  user: undefined
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
    case UPDATE_USER: {
      return {
        ...state,
        user: action.payload
      }
    }
    default:
      return state;
  }
}

const initialBusinessState: BusinessState = {
  businessName: '',
};

export function businessReducer(
  state = initialBusinessState,
  action: BusinessActionTypes,
): BusinessState {
  switch (action.type) {
    case UPDATE_BUSINESS_NAME: {
      return {
        ...state,
        businessName: action.payload,
      };
    }
    default:
      return state;
  }
}

const initialCustomerState: CustomerState = {
  pastAppointments: [],
  upcomingAppointments: [],
  foundBusinesses: []
}

export function customerReducer(
  state = initialCustomerState,
  action: CustomerActionTypes
): CustomerState {
  switch(action.type) {
    case UPDATE_CUSTOMER_PAST_APPOINTMENTS: {
      return {
        ...state,
        pastAppointments: action.payload
      };
    }
    case UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS: {
      return {
        ...state,
        upcomingAppointments: action.payload
      };
    }
    case ADD_FOUND_BUSINESS: {
      return {
        ...state,
        foundBusinesses: [
          ...state.foundBusinesses,
          action.payload
        ]
      }
    }
    case CLEAR_FOUND_BUSINESSES: {
      return {
        ...state,
        foundBusinesses: []
      }
    }
    default:
      return state;
  }
}
