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

import { CREATE_VERIFICATION_CODE, CREATE_VERIFICATION_CODE_RES, FORGOT_PASSWORD, FORGOT_PASSWORD_RES, LOGIN, LOGIN_RES, RESET_PASSWORD, RESET_PASSWORD_RES, SIGNUP, SIGNUP_RES, VERIFY_CODE, VERIFY_CODE_RES } from "./auth.types";

export const login = (data) => ({
  type: LOGIN,
  payload: data,
});

export const loginResponse = (res) => ({
  type: LOGIN_RES,
  payload: res,
});

export const forgotPassword = (data) => ({
  type: FORGOT_PASSWORD,
  payload: data,
});

export const forgotPasswordResponse = (res) => ({
  type: FORGOT_PASSWORD_RES,
  payload: res,
});

export const resetPassword = (data) => ({
  type: RESET_PASSWORD,
  payload: data,
});

export const resetPasswordResponse = (res) => ({
  type: RESET_PASSWORD_RES,
  payload: res,
});

export const createVerificationCode = (data) => ({
  type: CREATE_VERIFICATION_CODE,
  payload: data
})

export const createVerificationCodeResponse = (res) => ({
  type: CREATE_VERIFICATION_CODE_RES,
  payload: res
})

export const verifyCode = (data) => ({
  type: VERIFY_CODE,
  payload: data
})

export const verifyCodeResponse = (res) => ({
  type: VERIFY_CODE_RES,
  payload: res
})

export const signUp = (data) => ({
  type: SIGNUP,
  payload: data
})

export const signUpResponse = (res) => ({
  type: SIGNUP_RES,
  payload: res
})