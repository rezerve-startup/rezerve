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
  SET_EMPLOYEE_EMAIL,
  SET_BUSINESS_AVAILABILITY,
  ADD_SELECTED_EMPLOYEE_APPOINTMENT,
  CLEAR_USER_INFO,
  SET_USER_EMPLOYEE_INFO,
  SET_USER_CUSTOMER_INFO,
  SET_USER_EMPLOYEE_APPOINTMENTS,
  SET_EMPLOYEE_CLIENTS,
  SET_EMPLOYEE_REVIEWS,
  LOGOUT_USER,
  SET_USER_CUSTOMER_APPOINTMENTS,
  UPDATE_EMPLOYEE_APPOINTMENT_STATUS,
  UPDATE_CUSTOMER_APPOINTMENT_STATUS,
  SET_USER_CUSTOMER_CONVERSATIONS,
  SET_USER_EMPLOYEE_CONVERSATIONS
} from './types';

// ************** System Reducer ******************

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
        user: action.payload,
      };
    }
    case CLEAR_USER_INFO: {
      return {
        ...state,
        user: undefined
      }
    }
    case SET_USER_EMPLOYEE_INFO: {
      return {
        ...state,
        user: action.payload
      }
    }
    case SET_USER_EMPLOYEE_APPOINTMENTS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            appointments: action.payload
          }
        }
      }
    }
    case SET_USER_EMPLOYEE_CONVERSATIONS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            conversations: action.payload
          }
        }
      }
    }
    case SET_EMPLOYEE_CLIENTS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            clients: action.payload
          }
        }
      }
    }
    case SET_EMPLOYEE_REVIEWS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            reviews: action.payload
          }
        }
      }
    }
    case SET_USER_CUSTOMER_INFO: {
      return {
        ...state,
        user: action.payload
      }
    }
    case SET_USER_CUSTOMER_APPOINTMENTS: {
      return {
        ...state,
        user: {
          ...state.user,
          customerInfo: {
            ...state.user.customerInfo,
            appointments: action.payload
          }
        }
      }
    }
    case SET_USER_CUSTOMER_CONVERSATIONS: {
      return {
        ...state,
        user: {
          ...state.user,
          customerInfo: {
            ...state.user.customerInfo,
            conversations: action.payload
          }
        }
      }
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
    case UPDATE_EMPLOYEE_APPOINTMENT_STATUS: {
      return {
        ...state,
        user: {
          ...state.user,
          employeeInfo: {
            ...state.user.employeeInfo,
            appointments: state.user.employeeInfo.appointments.map(
              (appt) => appt.appointmentId === action.payload.appointmentId ? {...appt, status: action.payload.status} : appt
            )
          }
        }
      }
    }
    case UPDATE_CUSTOMER_APPOINTMENT_STATUS: {
      return {
        ...state,
        user: {
          ...state.user,
          customerInfo: {
            ...state.user.customerInfo,
            appointments: state.user.customerInfo.appointments.map(
              (appt) => appt.appointmentId === action.payload.appointmentId ? {...appt, status: action.payload.status} : appt
            )
          }
        }
      }
    }
    case LOGOUT_USER: {
      return {
        ...state,
        user: undefined
      }
    }
    default:
      return state;
  }
}

// ********** Business Reducer ****************

const initialBusinessState: BusinessState = {
  businessName: '',
  businessAvailability: {
    daysOpen: [],
    openingTime: '',
    closingTime: ''
  }
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
    case SET_BUSINESS_AVAILABILITY: {
      return {
        ...state,
        businessAvailability: action.payload
      }
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
    case ADD_SELECTED_EMPLOYEE_APPOINTMENT: {
      return {
        ...state,
        selectedEmployee: {
          ...state.selectedEmployee,
          appointments: [
            ...state.selectedEmployee.appointments,
            action.payload
          ]
        }
      }
    }
    default:
      return state;
  }
}
