// // src/redux/Login/login.reducer.js
// import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './login.types';

// const initialState = {
//   isLoading: false,
//   user: null,
//   error: null,
// };

// const loginReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN_REQUEST:
//       return {
//         ...state,
//         isLoading: true,
//       };
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         isLoading: false,
//         user: action.payload,
//         error: null,
//       };
//     case LOGIN_FAILURE:
//       return {
//         ...state,
//         isLoading: false,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default loginReducer;

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

import { LOGIN_RES } from "./login.types"

const INITIAL_STATE = {
  loginResponse: null,
}

/**
 *
 * @param state - global state management
 * @param action - contains type and payload
 * @returns {{loginResponse: {}, login: boolean, status: boolean}|{loginResponse: *, login: boolean, status: boolean}|{loginResponse: {}, login: boolean, status: *}}
 */

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_RES: {
      return { ...state, ...{ loginResponse: action.payload } };
    }
    default:
      return state;
  }
};
export default loginReducer;