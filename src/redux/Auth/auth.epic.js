// src/redux/Login/login.epic.js
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { CREATE_VERIFICATION_CODE, FORGOT_PASSWORD, LOGIN, RESET_PASSWORD, SIGNUP, VERIFY_CODE } from './auth.types';
import { createVerificationCodeResponse, forgotPasswordResponse, loginResponse, resetPasswordResponse, signUpResponse, verifyCodeResponse } from './auth.action';
// import { baseUrl } from '../../environments/environment.dev';

const BaseUrl = import.meta.env.VITE_BACKEND_URL

const AuthEpic = {};

AuthEpic.login = (action$) =>
  action$.pipe(
    ofType(LOGIN), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/login`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => loginResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(loginResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

AuthEpic.forgotPassword = (action$) =>
  action$.pipe(
    ofType(FORGOT_PASSWORD), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/forgot-password`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => forgotPasswordResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(forgotPasswordResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

AuthEpic.resetPassword = (action$) =>
  action$.pipe(
    ofType(RESET_PASSWORD), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/reset-password`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => resetPasswordResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(resetPasswordResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

AuthEpic.createVerificationCode = (action$) =>
  action$.pipe(
    ofType(CREATE_VERIFICATION_CODE), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/create-verification-code`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => createVerificationCodeResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(createVerificationCodeResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

AuthEpic.verifyCode = (action$) =>
  action$.pipe(
    ofType(VERIFY_CODE), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/verify-code`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => verifyCodeResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(verifyCodeResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

AuthEpic.signUp = (action$) =>
  action$.pipe(
    ofType(SIGNUP), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/signup`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => signUpResponse(response.response)), // Extract and pass response data
        catchError((error) => {
          // Log the error and pass it in the action payload for error handling in the reducer
          return of(signUpResponse({ error: error.response ? error.response.message : error.message }));
        }))
    )
  );

export default AuthEpic;
