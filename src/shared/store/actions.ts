import { SystemState, UPDATE_SESSION, UPDATE_BUSINESS_NAME, SystemActionTypes, BusinessActionTypes } from './types';

export function updateSession(newSession: SystemState): SystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession,
  };
}

export function updateBusinessName(newBusinessName: string): BusinessActionTypes {
  return {
    type: UPDATE_BUSINESS_NAME,
    payload: newBusinessName
  }
}