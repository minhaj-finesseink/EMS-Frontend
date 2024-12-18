import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { baseUrl } from '../../environments/environment.dev';
import { ADD_USER_TIME_OFF } from './userTimeOff.types';
import { addUserTimeOffResponse } from './userTimeOff.action';

const BaseUrl = baseUrl

const userTimeOffEpic = {};

userTimeOffEpic.addUserTimeOff = (action$) =>
    action$.pipe(
        ofType(ADD_USER_TIME_OFF), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-userTimeOff`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addUserTimeOffResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addUserTimeOffResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default userTimeOffEpic;