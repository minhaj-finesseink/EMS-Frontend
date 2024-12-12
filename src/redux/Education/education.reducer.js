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

import { ADD_EDUCATION_RES, GET_EDUCATION_RES } from "./education.type";

const INITIAL_STATE = {
  addEducationResponse: null,
  getEducationResponse: null
}

const educationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_EDUCATION_RES: {
      return { ...state, ...{ addEducationResponse: action.payload } };
    }
    case GET_EDUCATION_RES: {
      return { ...state, ...{ getEducationResponse: action.payload } }
    }
    default:
      return state;
  }
};
export default educationReducer;