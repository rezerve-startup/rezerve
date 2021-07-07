// ############# Store State ###############################
export interface StoreState {
  system: SystemState;
  business: BusinessState;
  customer: CustomerState;
  location: LocationState;
}

// ############# System Types ###########################
export interface SystemState {
  loggedIn: boolean;
  session: string;
  user: any;
  authChanging: boolean;
  bookDialogStatus: boolean;
}

export const UPDATE_SESSION = 'UPDATE_SESSION';
export const UPDATE_USER = 'UPDATE_USER';
export const CLEAR_USER_INFO = 'CLEAR_USER_INFO';
export const SET_USER_EMPLOYEE_INFO = 'SET_USER_EMPLOYEE_INFO';
export const SET_USER_EMPLOYEE_APPOINTMENTS = 'SET_USER_EMPLOYEE_APPOINTMENTS';
export const SET_USER_EMPLOYEE_CONVERSATIONS = 'SET_USER_EMPLOYEE_CONVERSATIONS';
export const SET_EMPLOYEE_CLIENTS = 'SET_EMPLOYEE_CLIENTS';
export const SET_EMPLOYEE_REVIEWS = 'SET_EMPLOYEE_REVIEWS';
export const SET_EMPLOYEE_SERVICES = 'SET_EMPLOYEE_SERVICES';

export const SET_EMPLOYEE_BUSINESS = 'SET_EMPLOYEE_BUSINESS';
export const SET_EMPLOYEE_POSITION = 'SET_EMPLOYEE_POSITION';
export const SET_EMPLOYEE_BUSINESS_NAME = 'SET_EMPLOYEE_BUSINESS_NAME';
export const SET_EMPLOYEE_BUSINESS_DESCRIPTION = 'SET_EMPLOYEE_BUSINESS_DESCRIPTION';
export const UPDATE_BUSINESS_SCHEDULE = 'SET_BUSINESS_SCHEDULE';

export const SET_USER_CUSTOMER_INFO = 'SET_USER_CUSTOMER_INFO';
export const SET_USER_CUSTOMER_APPOINTMENTS = 'SET_USER_CUSTOMER_APPOINTMENTS';
export const SET_USER_CUSTOMER_CONVERSATIONS = 'SET_USER_CUSTOMER_CONVERSATIONS';
export const SET_TO_DOS = 'SET_TO_DOS';
export const SET_EMPLOYEE_PHONE = 'SET_EMPLOYEE_PHONE';
export const SET_EMPLOYEE_EMAIL = 'SET_EMPLOYEE_EMAIL';
export const UPDATE_EMPLOYEE_APPOINTMENT_STATUS = 'UPDATE_EMPLOYEE_APPOINTMENT_STATUS';
export const UPDATE_CUSTOMER_APPOINTMENT_STATUS = 'UPDATE_CUSTOMER_APPOINTMENT_STATUS';
export const LOGOUT_USER = 'LOGOUT_USER';
export const AUTH_CHANGING = 'AUTH_CHANGING';
export const SET_BOOK_DIALOG_STATUS = 'SET_BOOK_DIALOG_STATUS';

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

interface SetUserEmployeeConversationsAction {
  type: typeof SET_USER_EMPLOYEE_CONVERSATIONS;
  payload: any[];
}

interface SetEmployeeClientsAction {
  type: typeof SET_EMPLOYEE_CLIENTS,
  payload: any;
}

interface SetEmployeeReviewsAction {
  type: typeof SET_EMPLOYEE_REVIEWS,
  payload: any[];
}

interface SetEmployeeServicesAction {
  type: typeof SET_EMPLOYEE_SERVICES,
  payload: any[]
}

interface SetEmployeeBusinessAction {
  type: typeof SET_EMPLOYEE_BUSINESS,
  payload: any[]
}

interface SetEmployeeBusinessNameAction {
  type: typeof SET_EMPLOYEE_BUSINESS_NAME,
  payload: string
}

interface SetEmployeeBusinessDescription {
  type: typeof SET_EMPLOYEE_BUSINESS_DESCRIPTION,
  payload: string
}

interface SetEmployeePosition {
  type: typeof SET_EMPLOYEE_POSITION,
  payload: string
}

interface UpdateBusinessScheduleAction {
  type: typeof UPDATE_BUSINESS_SCHEDULE,
  payload: any[]
}

interface SetUserCustomerInfoAction {
  type: typeof SET_USER_CUSTOMER_INFO;
  payload: any;
}

interface SetUserCustomerAppointmentsAction {
  type: typeof SET_USER_CUSTOMER_APPOINTMENTS,
  payload: any[];
}

interface SetUserCustomerConversationsAction {
  type: typeof SET_USER_CUSTOMER_CONVERSATIONS,
  payload: any[];
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

interface SetBookDialogStatus {
  type: typeof SET_BOOK_DIALOG_STATUS;
  payload: boolean;
}

interface UpdateEmployeeAppointmentStatusAction {
  type: typeof UPDATE_EMPLOYEE_APPOINTMENT_STATUS,
  payload: any;
}

interface UpdateCustomerAppointmentStatusAction {
  type: typeof UPDATE_CUSTOMER_APPOINTMENT_STATUS,
  payload: any;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER
}

interface AuthChangingAction {
  type: typeof AUTH_CHANGING;
  payload: boolean;
}

export type SystemActionTypes = 
  UpdateSessionAction |
  UpdateUserAction |
  ClearUserInfoAction |
  SetUserEmployeeInfoAction |
  SetUserEmployeeAppointmentsAction |
  SetUserEmployeeConversationsAction |
  SetEmployeeClientsAction |
  SetEmployeeReviewsAction |
  SetEmployeeServicesAction |
  SetEmployeeBusinessAction |
  SetEmployeeBusinessNameAction |
  SetEmployeeBusinessDescription |
  UpdateBusinessScheduleAction |
  SetUserCustomerInfoAction |
  SetUserCustomerAppointmentsAction |
  SetUserCustomerConversationsAction |
  SetToDosAction |
  SetEmployeePhoneAction |
  SetEmployeeEmailAction |
  SetEmployeePosition |
  UpdateEmployeeAppointmentStatusAction |
  UpdateCustomerAppointmentStatusAction |
  LogoutUserAction |
  AuthChangingAction |
  SetBookDialogStatus;

// ############ Business Types ##########################
export interface BusinessState {
  businessId: string;
  businessName: string;
  businessAvailability: {
    daysOpen: any[];
    openingTime: string;
    closingTime: string;
  }
}

export const UPDATE_BUSINESS_ID = 'UPDATE_BUSINESS_ID';
export const UPDATE_BUSINESS_NAME = 'UPDATE_BUSINESS_NAME';
export const SET_BUSINESS_AVAILABILITY = 'SET_BUSINESS_AVAILABILITY';

interface UpdateBusinessNameAction {
  type: typeof UPDATE_BUSINESS_NAME;
  payload: string;
}

interface UpdateBusinessIdAction {
  type: typeof UPDATE_BUSINESS_ID;
  payload: string;
}

interface SetBusinessAvailabilityAction {
  type: typeof SET_BUSINESS_AVAILABILITY,
  payload: any
}

export type BusinessActionTypes = UpdateBusinessNameAction |
  SetBusinessAvailabilityAction | UpdateBusinessIdAction;

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
  AddFoundBusinessAction |
  ClearFoundBusinessesAction |
  AddEmployeeForBusinessAction |
  ClearEmployeesForBusinessAction |
  SetSelectedEmployeeAction |
  AddSelectedEmployeeAppointmentAction |
  SetSelectedEmployeeAction;


// export interface NewCustomer {
//   name: string;
// }

// export interface NewBusiness {
//   name: string;
// }

export interface SignUpState {
  newUser: any
}

export const CREATE_NEW_CUSTOMER = 'CREATE_NEW_CUSTOMER'
export const CREATE_NEW_BUSINESS = 'CREATE_NEW_BUSINESS'

interface CreateNewCustomer {
  type: typeof CREATE_NEW_CUSTOMER;
  payload: any;
}

interface CreateNewBusiness {
  type: typeof CREATE_NEW_BUSINESS;
  payload: any;
}

export type SignUpActionTypes = CreateNewCustomer | CreateNewBusiness


// LOCATION
export interface LocationState {
  newLat: number,
  newLong: number,
  newStatus: boolean
}

export const UPDATE_CURRENT_LATITUDE = 'UPDATE_CURRENT_LATITUDE'
export const UPDATE_CURRENT_LONGITUDE = 'UPDATE_CURRENT_LONGITUDE'
export const UPDATE_LOCATION_STATUS = 'UPDATE_LOCATION_STATUS'

interface updateCurrentLatitude {
  type: typeof UPDATE_CURRENT_LATITUDE;
  payload: number;
}

interface updateCurrentLongitude {
  type: typeof UPDATE_CURRENT_LONGITUDE;
  payload: number;
}

interface locationStatus {
  type: typeof UPDATE_LOCATION_STATUS;
  payload: boolean;
}

export type LocationActionTypes = updateCurrentLatitude | updateCurrentLongitude | locationStatus