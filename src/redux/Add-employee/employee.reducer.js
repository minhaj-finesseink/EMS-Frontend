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

import { ADD_EMPLOYEE_RES, EMPLOYEE_PASS_RES, GET_USER_BY_ID_RES, USER_UPDATE_RES } from "./employee.types";

const INITIAL_STATE = {
  addEmployeeResponse: null,
  employeePass: null,
  getUserByIdResponse: null,
  userUpdateResponse: null
}

const addEmployeeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_EMPLOYEE_RES: {
      return { ...state, ...{ addEmployeeResponse: action.payload } };
    }
    case EMPLOYEE_PASS_RES: {
      return { ...state, ...{ employeePass: action.payload } }
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
export default addEmployeeReducer;