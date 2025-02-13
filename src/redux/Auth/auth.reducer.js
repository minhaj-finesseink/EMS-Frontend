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

import { CREATE_VERIFICATION_CODE_RES, FORGOT_PASSWORD_RES, LOGIN_RES, RESET_PASSWORD_RES, SIGNUP_RES, VERIFY_CODE_RES } from "./auth.types"

const INITIAL_STATE = {
  loginResponse: null,
  forgotPassword: null,
  resetPassword: null,
  createVerificationCodeResponse: null,
  verifyCodeResponse: null,
  signupResponse: null,
}

/**
 *
 * @param state - global state management
 * @param action - contains type and payload
 * @returns {{loginResponse: {}, login: boolean, status: boolean}|{loginResponse: *, login: boolean, status: boolean}|{loginResponse: {}, login: boolean, status: *}}
 */

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_RES: {
      return { ...state, ...{ loginResponse: action.payload } };
    }
    case FORGOT_PASSWORD_RES: {
      return { ...state, ...{ forgotPassword: action.payload } }
    }
    case RESET_PASSWORD_RES: {
      return { ...state, ...{ resetPassword: action.payload } }
    }
    case CREATE_VERIFICATION_CODE_RES: {
      return { ...state, ...{ createVerificationCodeResponse: action.payload } }
    }
    case VERIFY_CODE_RES: {
      return { ...state, ...{ verifyCodeResponse: action.payload } }
    }
    case SIGNUP_RES: {
      return { ...state, ...{ signupResponse: action.payload } }
    }
    default:
      return state;
  }
};

export default authReducer;