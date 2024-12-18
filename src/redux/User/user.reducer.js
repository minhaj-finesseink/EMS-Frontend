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

/**
*
* @param state - global state management
* @param action - contains type and payload
* @returns {{loginResponse: {}, login: boolean, status: boolean}|{loginResponse: *, login: boolean, status: boolean}|{loginResponse: {}, login: boolean, status: *}}
*/

import { ADD_USER_RES, USER_PASS_RES, GET_USER_BY_ID_RES, USER_UPDATE_RES } from "./user.types";

const INITIAL_STATE = {
  addUserResponse: null,
  userPasswordResponse: null,
  getUserByIdResponse: null,
  userUpdateResponse: null
}

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_USER_RES: {
      return { ...state, ...{ addUserResponse: action.payload } };
    }
    case USER_PASS_RES: {
      return { ...state, ...{ userPasswordResponse: action.payload } }
    }
    case GET_USER_BY_ID_RES: {
      return { ...state, ...{ getUserByIdResponse: action.payload } }
    }
    case USER_UPDATE_RES: {
      return { ...state, ...{ userUpdateResponse: action.payload } }
    }
    default:
      return state;
  }
};
export default userReducer;