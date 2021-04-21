import {
  SystemState,
  UPDATE_SESSION,
  UPDATE_BUSINESS_NAME,
  SystemActionTypes,
  BusinessActionTypes,
  UPDATE_USER,
  CustomerActionTypes,
  UPDATE_CUSTOMER_PAST_APPOINTMENTS,
  UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS,
  CLEAR_FOUND_BUSINESSES,
  ADD_FOUND_BUSINESS,
  ADD_EMPLOYEE_FOR_BUSINESS,
  CLEAR_EMPLOYEES_FOR_BUSINESS,
  SET_SELECTED_EMPLOYEE,
  SET_TO_DOS,
  SET_EMPLOYEE_PHONE,
  SET_EMPLOYEE_EMAIL,
  CLEAR_USER_INFO,
  SET_USER_EMPLOYEE_INFO,
  SET_USER_CUSTOMER_INFO,
  SET_BUSINESS_AVAILABILITY,
  ADD_SELECTED_EMPLOYEE_APPOINTMENT,
  SET_USER_EMPLOYEE_APPOINTMENTS,
  SET_EMPLOYEE_CLIENTS,
  SET_EMPLOYEE_REVIEWS,
  LOGOUT_USER,
  SET_USER_CUSTOMER_APPOINTMENTS,
  UPDATE_EMPLOYEE_APPOINTMENT_STATUS,
  UPDATE_CUSTOMER_APPOINTMENT_STATUS,
  SET_USER_EMPLOYEE_CONVERSATIONS,
  SET_USER_CUSTOMER_CONVERSATIONS,
  AUTH_CHANGING,
  SET_BOOK_DIALOG_STATUS,
  SET_EMPLOYEE_SERVICES,
  SignUpActionTypes,
  CREATE_NEW_BUSINESS,
  CREATE_NEW_CUSTOMER
} from './types';

// ****** SYSTEM ACTIONS ***************

export function updateSession(newSession: SystemState): SystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession,
  };
}

export function updateUser(newUser: SystemState): SystemActionTypes {
  return {
    type: UPDATE_USER,
    payload: newUser,
  };
}

export function clearUserInfo(): SystemActionTypes {
  return {
    type: CLEAR_USER_INFO
  }
}

export function setUserEmployeeInfo(userEmployeeInfo: any): SystemActionTypes {
  return {
    type: SET_USER_EMPLOYEE_INFO,
    payload: userEmployeeInfo
  }
}

export function setUserEmployeeAppointments(employeeAppointments: any[]): SystemActionTypes {
  return {
    type: SET_USER_EMPLOYEE_APPOINTMENTS,
    payload: employeeAppointments
  }
}

export function setUserEmployeeConversations(employeeConversations: any[]): SystemActionTypes {
  return {
    type: SET_USER_EMPLOYEE_CONVERSATIONS,
    payload: employeeConversations
  }
}

export function setEmployeeClients(employeeClients: any): SystemActionTypes {
  return {
    type: SET_EMPLOYEE_CLIENTS,
    payload: employeeClients
  }
}

export function setEmployeeReviews(employeeReviews: any[]): SystemActionTypes {
  return {
    type: SET_EMPLOYEE_REVIEWS,
    payload: employeeReviews
  }
}

export function setEmployeeServices(employeeServices: any[]): SystemActionTypes {
  return {
    type: SET_EMPLOYEE_SERVICES,
    payload: employeeServices
  }
}

export function setUserCustomerInfo(userCustomerInfo: any): SystemActionTypes {
  return {
    type: SET_USER_CUSTOMER_INFO,
    payload: userCustomerInfo
  }
}

export function setUserCustomerAppointments(customerAppointments: any[]): SystemActionTypes {
  return {
    type: SET_USER_CUSTOMER_APPOINTMENTS,
    payload: customerAppointments
  }
}

export function setUserCustomerConversations(customerConversations: any[]): SystemActionTypes {
  return {
    type: SET_USER_CUSTOMER_CONVERSATIONS,
    payload: customerConversations
  }
}

export function setToDos(todos: any[]): SystemActionTypes {
  return {
    type: SET_TO_DOS,
    payload: todos
  }
}

export function setEmployeePhone(phone: string): SystemActionTypes {
  return {
    type: SET_EMPLOYEE_PHONE,
    payload: phone
  }
}

export function setEmployeeEmail(email: string): SystemActionTypes {
  return {
    type: SET_EMPLOYEE_EMAIL,
    payload: email
  }
}

export function updateEmployeeAppointmentStatus(appointment: any): SystemActionTypes {
  return {
    type: UPDATE_EMPLOYEE_APPOINTMENT_STATUS,
    payload: appointment
  }
}

export function updateCustomerAppointmentStatus(appointment: any): SystemActionTypes {
  return {
    type: UPDATE_CUSTOMER_APPOINTMENT_STATUS,
    payload: appointment
  }
}

export function logoutUser(): SystemActionTypes {
  return {
    type: LOGOUT_USER
  }
}

export function setAuthChanging(authChangingValue: boolean): SystemActionTypes {
  return {
    type: AUTH_CHANGING,
    payload: authChangingValue
  }
}

export function setBookDialogStatus(bookDialogStatus: boolean): SystemActionTypes {
  return {
    type: SET_BOOK_DIALOG_STATUS,
    payload: bookDialogStatus
  }
}

// ****** BUSINESS ACTIONS **************

export function updateBusinessName(
  newBusinessName: string,
): BusinessActionTypes {
  return {
    type: UPDATE_BUSINESS_NAME,
    payload: newBusinessName,
  };
}

export function setBusinessAvailability(businessAvailability: any): BusinessActionTypes {
  return {
    type: SET_BUSINESS_AVAILABILITY,
    payload: businessAvailability
  }
}

// ***** CUSTOMER ACTIONS *************

export function addBusinessFound(businessFound: any): CustomerActionTypes {
  return {
    type: ADD_FOUND_BUSINESS,
    payload: businessFound,
  };
}

export function clearBusinessesFound(): CustomerActionTypes {
  return {
    type: CLEAR_FOUND_BUSINESSES,
  };
}

export function addEmployeeForBusiness(employeeToAdd: any): CustomerActionTypes {
  return {
    type: ADD_EMPLOYEE_FOR_BUSINESS,
    payload: employeeToAdd
  }
}

export function clearEmployeesForBusiness(): CustomerActionTypes {
  return {
    type: CLEAR_EMPLOYEES_FOR_BUSINESS
  }
}

export function setSelectedEmployee(selectedEmployee): CustomerActionTypes {
  return {
    type: SET_SELECTED_EMPLOYEE,
    payload: selectedEmployee
  }
}

export function addSelectedEmployeeAppointment(appointmentToAdd): CustomerActionTypes {
  return {
    type: ADD_SELECTED_EMPLOYEE_APPOINTMENT,
    payload: appointmentToAdd
  }
}
/* SIGN UP ACTIONS */
export function createNewCustomer(newCustomerId: string, newCustomer: any): SignUpActionTypes {
  return {
    type: CREATE_NEW_CUSTOMER,
    payload: {
      id: newCustomerId,
      data: newCustomer 
    }
  }
}

export function createNewBusiness(newBusiness: any): SignUpActionTypes {
  return {
    type: CREATE_NEW_BUSINESS,
    payload: newBusiness
  }
}