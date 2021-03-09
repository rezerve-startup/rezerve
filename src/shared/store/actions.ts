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
} from './types';

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

export function updateBusinessName(
  newBusinessName: string,
): BusinessActionTypes {
  return {
    type: UPDATE_BUSINESS_NAME,
    payload: newBusinessName,
  };
}

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
