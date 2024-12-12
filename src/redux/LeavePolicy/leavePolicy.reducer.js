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

import { ADD_LEAVE_POLICY_RES, GET_LEAVE_POLICY_RES } from "./leavePolicy.types";

const INITIAL_STATE = {
    addLeavePolicyResponse: null,
    getLeavePolicyResponse: null
}

const leavePolicyReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_LEAVE_POLICY_RES: {
            return { ...state, ...{ addLeavePolicyResponse: action.payload } };
        }
        case GET_LEAVE_POLICY_RES: {
            return { ...state, ...{ getLeavePolicyResponse: action.payload } }
        }
        default:
            return state;
    }
};
export default leavePolicyReducer;