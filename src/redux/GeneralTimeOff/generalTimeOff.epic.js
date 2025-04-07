import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
// import { baseUrl } from '../../environments/environment.dev';
import { ADD_GENERAL_TIME_OFF, GET_GENERAL_TIME_OFF } from './generalTimeOff.types';
import { addGeneralTimeOffResponse, getGeneralTimeOffResponse } from './generalTimeOff.action';

const BaseUrl = import.meta.env.VITE_BACKEND_URL

const generalTimeOffEpic = {};

generalTimeOffEpic.addGeneralTimeOff = (action$) =>
    action$.pipe(
        ofType(ADD_GENERAL_TIME_OFF), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-generalTimeOff`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addGeneralTimeOffResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addGeneralTimeOffResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

generalTimeOffEpic.getGeneralTimeOff = (action$) =>
    action$.pipe(
        ofType(GET_GENERAL_TIME_OFF), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-generalTimeOff/${action.payload}`,
                method: 'GET',
            }).pipe(
                map((response) => getGeneralTimeOffResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getGeneralTimeOffResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default generalTimeOffEpic;