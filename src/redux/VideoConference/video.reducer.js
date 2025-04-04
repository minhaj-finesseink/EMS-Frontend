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

import { GET_CALENDAR_MEETING_RES, JOIN_MEETING_RES, SCHEDULE_MEETING_RES, SEND_MEETING_INVITE_RES, START_INSTANT_MEETING_RES, UPDATE_HOST_CONTROL_RES, UPDATE_MEET_SETTINGS_RES } from "./video.types";

const INITIAL_STATE = {
  startInstantMeetingResponse: null,
  sendMeetingInviteResponse: null,
  joinMeetingResponse: null,
  updateHostControlResponse: null,
  updateMeetSettingsResponse: null,
  scheduleMeetingResponse: null,
  getCalendarMeetingResponse: null,
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
    case UPDATE_MEET_SETTINGS_RES: {
      return { ...state, ...{ updateMeetSettingsResponse: action.payload } }
    }
    case SCHEDULE_MEETING_RES: {
      return { ...state, ...{ scheduleMeetingResponse: action.payload } }
    }
    case GET_CALENDAR_MEETING_RES: {
      return { ...state, ...{ getCalendarMeetingResponse: action.payload } }
    }
    default:
      return state;
  }
}

export default videoConferenceReducer