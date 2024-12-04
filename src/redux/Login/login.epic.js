// src/redux/Login/login.epic.js
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { FORGOT_PASSWORD, LOGIN, RESET_PASSWORD } from './login.types';
import { forgotPasswordResponse, loginResponse, resetPasswordResponse } from './login.action';
import { baseUrl } from '../../environments/environment.dev';

const BaseUrl = baseUrl

const LoginEpic = {};

LoginEpic.login = (action$) =>
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

LoginEpic.forgotPassword = (action$) =>
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

LoginEpic.resetPassword = (action$) =>
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


export default LoginEpic;
