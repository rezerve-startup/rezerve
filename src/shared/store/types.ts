// ############# Store State ###############################
export interface StoreState {
  system: SystemState;
  business: BusinessState;
}

// ############# System Actions ###########################
export interface SystemState {
  loggedIn: boolean;
  session: string;
  userName: string;
}

export const UPDATE_SESSION = 'UPDATE_SESSION';

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: SystemState;
}

export type SystemActionTypes = UpdateSessionAction;

// ############ Business Actions ##########################
export interface BusinessState {
  businessName: string;
}

export const UPDATE_BUSINESS_NAME = 'UPDATE_BUSINESS_NAME';

interface UpdateBusinessNameAction {
  type: typeof UPDATE_BUSINESS_NAME;
  payload: string
}

export type BusinessActionTypes = UpdateBusinessNameAction;
