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


import { ADD_COMPANY_RES } from "./company.type";

const INITIAL_STATE = {
    addCompanyResponse: null
}

const addCompanyReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case ADD_COMPANY_RES: {
        return { ...state, ...{ addCompanyResponse: action.payload } };
      }
      default:
        return state;
    }
  };
  export default addCompanyReducer;