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

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: SystemState;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: any;
}

export type SystemActionTypes = 
  UpdateSessionAction |
  UpdateUserAction
;

// ############ Business Types ##########################
export interface BusinessState {
  businessName: string;
}

export const UPDATE_BUSINESS_NAME = 'UPDATE_BUSINESS_NAME';

interface UpdateBusinessNameAction {
  type: typeof UPDATE_BUSINESS_NAME;
  payload: string;
}

export type BusinessActionTypes = UpdateBusinessNameAction;

// ############ Customer Types ##########################
export interface CustomerState {
  pastAppointments: any[];
  upcomingAppointments: any[];
  foundBusinesses: any[];
}

export const UPDATE_CUSTOMER_PAST_APPOINTMENTS = 'UPDATE_CUSTOMER_PAST_APPOINTMENTS';
export const UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS = 'UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS';
export const ADD_FOUND_BUSINESS = 'ADD_FOUND_BUSINESS';
export const CLEAR_FOUND_BUSINESSES = 'CLEAR_FOUND_BUSINESSES';

interface UpdateCustomerPastAppointsmentsAction {
  type: typeof UPDATE_CUSTOMER_PAST_APPOINTMENTS;
  payload: any[]
}

interface UpdateCustomerUpcomingAppointsmentsAction {
  type: typeof UPDATE_CUSTOMER_UPCOMING_APPOINTMENTS;
  payload: any[]
}

interface AddFoundBusinessAction {
  type: typeof ADD_FOUND_BUSINESS;
  payload: any;
}

interface ClearFoundBusinessesAction {
  type: typeof CLEAR_FOUND_BUSINESSES;
}

export type CustomerActionTypes = 
  UpdateCustomerPastAppointsmentsAction |
  UpdateCustomerUpcomingAppointsmentsAction |
  AddFoundBusinessAction |
  ClearFoundBusinessesAction;
