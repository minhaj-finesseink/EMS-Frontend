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

import { START_INSTANT_MEETING_RES } from "./video.types";

const INITIAL_STATE = {
    startInstantMeetingResponse: null,
}

const videoConferenceReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case START_INSTANT_MEETING_RES: {
            return { ...state, ...{ startInstantMeetingResponse: action.payload } }
        }
        default:
            return state;
    }
}

export default videoConferenceReducer