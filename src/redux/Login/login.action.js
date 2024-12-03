// // src/redux/Login/login.actions.js
// import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './login.types';

// // Action for login request
// export const loginRequest = (credentials) => ({
//   type: LOGIN_REQUEST,
//   payload: credentials,
// });

// // Action for successful login
// export const loginSuccess = (user) => ({
//   type: LOGIN_SUCCESS,
//   payload: user,
// });

// // Action for login failure
// export const loginFailure = (error) => ({
//   type: LOGIN_FAILURE,
//   payload: error,
// });

/**
 * @fileOverview Manages the action w.r.t types in the redux
 * @author Muhammed Minhaj <minhaj@finesseink.com>com>

 * return(
 type and payload
 * )
 * @example export const actionName = (params) => ({
  type: Type of the action from login.type.js,
  payload: object - contains params,
})
 */

import { LOGIN, LOGIN_RES } from "./login.types";


export const login = (data) => ({
  type: LOGIN,
  payload: data,
});

export const loginResponse = (res) => ({
  type: LOGIN_RES,
  payload: res,
});