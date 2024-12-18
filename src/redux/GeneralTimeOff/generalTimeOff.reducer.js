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

import { ADD_GENERAL_TIME_OFF_RES, GET_GENERAL_TIME_OFF_RES } from "./generalTimeOff.types";

const INITIAL_STATE = {
    addGeneralTimeOffResponse: null,
    getGeneralTimeOffResponse: null
}

const generalTimeOffReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_GENERAL_TIME_OFF_RES: {
            return { ...state, ...{ addGeneralTimeOffResponse: action.payload } };
        }
        case GET_GENERAL_TIME_OFF_RES: {
            return { ...state, ...{ getGeneralTimeOffResponse: action.payload } }
        }
        default:
            return state;
    }
};
export default generalTimeOffReducer;