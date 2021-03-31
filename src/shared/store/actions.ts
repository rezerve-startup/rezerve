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
  SET_USER_INFO,
  SET_BUSINESS_AVAILABILITY
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

export function setUserInfo(userInfo: any): SystemActionTypes {
  return {
    type: SET_USER_INFO,
    payload: userInfo
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

export function updateCustomerPastAppointments(
  customerPastAppointment: any,
): CustomerActionTypes {
  return {
    type: UPDATE_CUSTOMER_PAST_APPOINTMENTS,
    payload: customerPastAppointment,
  };
}

export function updateCustomerUpcomingAppointments(
  customerUpcomingAppointment: any,
): CustomerActionTypes {
  return {
    type: UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS,
    payload: customerUpcomingAppointment,
  };
}

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
