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
    payload: newUser
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

// ***** CUSTOMER ACTIONS *************

export function updateCustomerPastAppointments(customerPastAppointment: any): CustomerActionTypes {
  return {
    type: UPDATE_CUSTOMER_PAST_APPOINTMENTS,
    payload: customerPastAppointment
  }
} 

export function updateCustomerUpcomingAppointments(customerUpcomingAppointment: any): CustomerActionTypes {
  return {
    type: UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS,
    payload: customerUpcomingAppointment
  }
}

export function addBusinessFound(businessFound: any): CustomerActionTypes {
  return {
    type: ADD_FOUND_BUSINESS,
    payload: businessFound
  }
}

export function clearBusinessesFound(businessesFound: any[]): CustomerActionTypes {
  return {
    type: CLEAR_FOUND_BUSINESSES
  }
}
