import { stat } from 'fs';
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
  CLEAR_FOUND_BUSINESSES,
  ADD_EMPLOYEE_FOR_BUSINESS,
  CLEAR_EMPLOYEES_FOR_BUSINESS,
  SET_SELECTED_EMPLOYEE,
  SET_TO_DOS,
  SET_EMPLOYEE_PHONE,
  SET_EMPLOYEE_EMAIL
} from './types';

// ************** System Reducer ******************

const initialSystemState: SystemState = {
  loggedIn: false,
  session: '',
  user: undefined,
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
        user: action.payload,
      };
    }
    case SET_TO_DOS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            todos: action.payload
          }
        }
      }
    }
    case SET_EMPLOYEE_PHONE: {
      return {
        ...state,
        user: {
          ...state.user,
          phone: action.payload
        }
      }
    }
    case SET_EMPLOYEE_EMAIL: {
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload
        }
      }
    }
    default:
      return state;
  }
}

// ********** Business Reducer ****************

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

// ***************** Customer Reducer *************************

const initialCustomerState: CustomerState = {
  pastAppointments: [],
  upcomingAppointments: [],
  foundBusinesses: [],
  employeesForBusiness: [],
  selectedEmployee: null
}

export function customerReducer(
  state = initialCustomerState,
  action: CustomerActionTypes,
): CustomerState {
  switch (action.type) {
    case UPDATE_CUSTOMER_PAST_APPOINTMENTS: {
      return {
        ...state,
        pastAppointments: action.payload,
      };
    }
    case UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS: {
      return {
        ...state,
        upcomingAppointments: action.payload,
      };
    }
    case ADD_FOUND_BUSINESS: {
      return {
        ...state,
        foundBusinesses: [...state.foundBusinesses, action.payload],
      };
    }
    case CLEAR_FOUND_BUSINESSES: {
      return {
        ...state,
        foundBusinesses: [],
      };
    }
    case ADD_EMPLOYEE_FOR_BUSINESS: {
      return {
        ...state,
        employeesForBusiness: [
          ...state.employeesForBusiness,
          action.payload
        ]
      }
    }
    case CLEAR_EMPLOYEES_FOR_BUSINESS: {
      return {
        ...state,
        employeesForBusiness: []
      }
    }
    case SET_SELECTED_EMPLOYEE: {
      return {
        ...state,
        selectedEmployee: action.payload
      }
    }
    default:
      return state;
  }
}
