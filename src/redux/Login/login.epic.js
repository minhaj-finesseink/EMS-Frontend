// src/redux/Login/login.epic.js
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { LOGIN } from './login.types';
import { loginResponse } from './login.action';

// const BaseUrl = 'http://localhost:5000/api';
const BaseUrl = 'https://ems-backend-c517.onrender.com/api';

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

export default LoginEpic;
