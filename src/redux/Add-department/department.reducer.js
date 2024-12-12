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

import { ADD_DEPARTMENT_RES } from "./department.types";

const INITIAL_STATE = {
  addDepartmentResponse: null
}

const addDepartmentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEPARTMENT_RES: {
      return { ...state, ...{ addDepartmentResponse: action.payload } };
    }
    default:
      return state;
  }
};
export default addDepartmentReducer;