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

import { ADD_SHIFT_RES, DELETE_SHIFT_BY_ID_RES, GET_ALL_SHIFT_RES, UPDATE_SHIFT_BY_ID_RES } from "./shift.types";

const INITIAL_STATE = {
  addShiftResponse: null,
  getAllShiftResponse: null,
  deleteShiftByIdResponse: null,
  updateShiftByIdResponse: null,
}

const shiftReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SHIFT_RES: {
      return { ...state, ...{ addShiftResponse: action.payload } }
    }
    case GET_ALL_SHIFT_RES: {
      return { ...state, ...{ getAllShiftResponse: action.payload } }
    }
    case DELETE_SHIFT_BY_ID_RES: {
      return { ...state, ...{ deleteShiftByIdResponse: action.payload } }
    }
    case UPDATE_SHIFT_BY_ID_RES: {
      return { ...state, ...{ updateShiftByIdResponse: action.payload } }
    }
    default:
      return state;
  }
}

export default shiftReducer