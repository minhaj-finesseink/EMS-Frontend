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

import { JOIN_MEETING_RES, SEND_MEETING_INVITE_RES, START_INSTANT_MEETING_RES, UPDATE_HOST_CONTROL_RES } from "./video.types";

const INITIAL_STATE = {
  startInstantMeetingResponse: null,
  sendMeetingInviteResponse: null,
  joinMeetingResponse: null,
  updateHostControlResponse: null
}

const videoConferenceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_INSTANT_MEETING_RES: {
      return { ...state, ...{ startInstantMeetingResponse: action.payload } }
    }
    case SEND_MEETING_INVITE_RES: {
      return { ...state, ...{ sendMeetingInviteResponse: action.payload } }
    }
    case JOIN_MEETING_RES: {
      return { ...state, ...{ joinMeetingResponse: action.payload } }
    }
    case UPDATE_HOST_CONTROL_RES: {
      return { ...state, ...{ updateHostControlResponse: action.payload } }
    }
    default:
      return state;
  }
}

export default videoConferenceReducer