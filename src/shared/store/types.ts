// ############# Store State ###############################
export interface StoreState {
  system: SystemState;
  business: BusinessState;
  customer: CustomerState;
}

// ############# System Types ###########################
export interface SystemState {
  loggedIn: boolean;
  session: string;
  user: any;
}

export const UPDATE_SESSION = 'UPDATE_SESSION';
export const UPDATE_USER = 'UPDATE_USER';
export const CLEAR_USER_INFO = 'CLEAR_USER_INFO';
export const SET_USER_EMPLOYEE_INFO = 'SET_USER_EMPLOYEE_INFO';
export const SET_USER_EMPLOYEE_APPOINTMENTS = 'SET_USER_EMPLOYEE_APPOINTMENTS';
export const SET_EMPLOYEE_CLIENTS = 'SET_EMPLOYEE_CLIENTS';
export const SET_EMPLOYEE_REVIEWS = 'SET_EMPLOYEE_REVIEWS';
export const SET_USER_CUSTOMER_INFO = 'SET_USER_CUSTOMER_INFO';
export const SET_TO_DOS = 'SET_TO_DOS';
export const SET_EMPLOYEE_PHONE = 'SET_EMPLOYEE_PHONE';
export const SET_EMPLOYEE_EMAIL = 'SET_EMPLOYEE_EMAIL';
export const UPDATE_APPOINTMENT_STATUS = 'UPDATE_APPOINTMENT_STATUS';

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: SystemState;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: any;
}

interface ClearUserInfoAction {
  type: typeof CLEAR_USER_INFO;
}

interface SetUserEmployeeInfoAction {
  type: typeof SET_USER_EMPLOYEE_INFO;
  payload: any;
}

interface SetUserEmployeeAppointmentsAction {
  type: typeof SET_USER_EMPLOYEE_APPOINTMENTS;
  payload: any;
}

interface SetEmployeeClientsAction {
  type: typeof SET_EMPLOYEE_CLIENTS,
  payload: any;
}

interface SetEmployeeReviewsAction {
  type: typeof SET_EMPLOYEE_REVIEWS,
  payload: any[];
}

interface SetUserCustomerInfoAction {
  type: typeof SET_USER_CUSTOMER_INFO;
  payload: any;
}

interface SetToDosAction {
  type: typeof SET_TO_DOS;
  payload: any;
}

interface SetEmployeePhoneAction {
  type: typeof SET_EMPLOYEE_PHONE;
  payload: any;
}

interface SetEmployeeEmailAction {
  type: typeof SET_EMPLOYEE_EMAIL;
  payload: any;
}

interface updateAppointmentStatusAction {
  type: typeof UPDATE_APPOINTMENT_STATUS,
  payload: any;
}

export type SystemActionTypes = 
  UpdateSessionAction |
  UpdateUserAction |
  ClearUserInfoAction |
  SetUserEmployeeInfoAction |
  SetUserEmployeeAppointmentsAction |
  SetEmployeeClientsAction |
  SetEmployeeReviewsAction |
  SetUserCustomerInfoAction |
  SetToDosAction |
  SetEmployeePhoneAction |
  SetEmployeeEmailAction |
  updateAppointmentStatusAction;

// ############ Business Types ##########################
export interface BusinessState {
  businessName: string;
  businessAvailability: {
    daysOpen: any[];
    openingTime: string;
    closingTime: string;
  }
}

export const UPDATE_BUSINESS_NAME = 'UPDATE_BUSINESS_NAME';
export const SET_BUSINESS_AVAILABILITY = 'SET_BUSINESS_AVAILABILITY';

interface UpdateBusinessNameAction {
  type: typeof UPDATE_BUSINESS_NAME;
  payload: string;
}

interface SetBusinessAvailabilityAction {
  type: typeof SET_BUSINESS_AVAILABILITY,
  payload: any
}

export type BusinessActionTypes = UpdateBusinessNameAction |
  SetBusinessAvailabilityAction;

// ############ Customer Types ##########################
export interface CustomerState {
  pastAppointments: any[];
  upcomingAppointments: any[];
  foundBusinesses: any[];
  employeesForBusiness: any[];
  selectedEmployee: any;
}

export const UPDATE_CUSTOMER_PAST_APPOINTMENTS = 'UPDATE_CUSTOMER_PAST_APPOINTMENTS';
export const UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS = 'UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS';
export const ADD_FOUND_BUSINESS = 'ADD_FOUND_BUSINESS';
export const CLEAR_FOUND_BUSINESSES = 'CLEAR_FOUND_BUSINESSES';
export const ADD_EMPLOYEE_FOR_BUSINESS = 'ADD_EMPLOYEE_FOR_BUSINESS';
export const CLEAR_EMPLOYEES_FOR_BUSINESS = 'CLEAR_EMPLOYEES_FOR_BUSINESS';
export const SET_SELECTED_EMPLOYEE = 'SET_SELECTED_EMPLOYEE';
export const ADD_SELECTED_EMPLOYEE_APPOINTMENT = 'ADD_SELECTED_EMPLOYEE_APPOINTMENT';

interface UpdateCustomerPastAppointsmentsAction {
  type: typeof UPDATE_CUSTOMER_PAST_APPOINTMENTS;
  payload: any[];
}

interface UpdateCustomerUpcomingAppointsmentsAction {
  type: typeof UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS;
  payload: any[];
}

interface AddFoundBusinessAction {
  type: typeof ADD_FOUND_BUSINESS;
  payload: any;
}

interface ClearFoundBusinessesAction {
  type: typeof CLEAR_FOUND_BUSINESSES;
}

interface AddEmployeeForBusinessAction {
  type: typeof ADD_EMPLOYEE_FOR_BUSINESS;
  payload: any;
}

interface ClearEmployeesForBusinessAction {
  type: typeof CLEAR_EMPLOYEES_FOR_BUSINESS;
}

interface SetSelectedEmployeeAction {
  type: typeof SET_SELECTED_EMPLOYEE;
  payload: any;
}

interface AddSelectedEmployeeAppointmentAction {
  type: typeof ADD_SELECTED_EMPLOYEE_APPOINTMENT;
  payload: any;
}

export type CustomerActionTypes = 
  UpdateCustomerPastAppointsmentsAction |
  UpdateCustomerUpcomingAppointsmentsAction |
  AddFoundBusinessAction |
  ClearFoundBusinessesAction |
  AddEmployeeForBusinessAction |
  ClearEmployeesForBusinessAction |
  SetSelectedEmployeeAction |
  AddSelectedEmployeeAppointmentAction;
