/**
 * @fileOverview Manages the response of action
 * @author Muhammed Minhaj <minhaj@finesseink.com>
 * @example switch (action.type) {
    case TYPE_NAME: {
      return {
        ...state,
        ...{INITIAL_STATE: action.payload },
      }
    }
    }
 */

import { REGISTER_RES } from "./register.types";

const INITIAL_STATE = {
  registerResponse: null,
}

/**
 *
 * @param state - global state management
 * @param action - contains type and payload
 * @returns {{loginResponse: {}, login: boolean, status: boolean}|{loginResponse: *, login: boolean, status: boolean}|{loginResponse: {}, login: boolean, status: *}}
 */

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_RES: {
      return { ...state, ...{ registerResponse: action.payload } };
    }
    default:
      return state;
  }
};
export default loginReducer;