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

import { ADD_USER_TIME_OFF_RES } from "./userTimeOff.types";

const INITIAL_STATE = {
    addUserTimeOffResponse: null,
}

const userTimeOffReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_USER_TIME_OFF_RES: {
            return { ...state, ...{ addUserTimeOffResponse: action.payload } };
        }
        default:
            return state;
    }
};
export default userTimeOffReducer;