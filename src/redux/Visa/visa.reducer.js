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

import { ADD_VISA_RES, GET_VISA_RES } from "./visa.type";

const INITIAL_STATE = {
    addVisaResponse: null,
    getVisaResponse: null
  }
  
  const visaReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case ADD_VISA_RES: {
        return { ...state, ...{ addVisaResponse: action.payload } };
      }
      case GET_VISA_RES: {
        return { ...state, ...{ getVisaResponse: action.payload } }
      }
      default:
        return state;
    }
  };
  export default visaReducer;