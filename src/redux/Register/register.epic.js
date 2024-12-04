import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { REGISTER } from './register.types';
import { registerResponse } from './register.action';
import { baseUrl } from '../../environments/environment.dev';

const BaseUrl = baseUrl

const RegisterEpic = {};

RegisterEpic.register = (action$) =>
  action$.pipe(
    ofType(REGISTER), // Listen for the LOGIN action type
    switchMap((action) =>
      ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${BaseUrl}/auth/register`,
        method: 'POST',
        body: action.payload, // Directly use action.payload, no need to stringify
      }).pipe(
        map((response) => registerResponse(response.response)), // Extract and pass response data
        catchError((error) => of(registerResponse({ error: error.message }))) // Graceful error handling
      )
    )
  );

export default RegisterEpic;