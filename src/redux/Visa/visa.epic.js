import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { baseUrl } from '../../environments/environment.dev';
import { ADD_VISA, GET_VISA } from './visa.type';
import { addVisaResponse, getVisaResponse } from './visa.action';

const BaseUrl = baseUrl

const visaEpic = {};

visaEpic.addVisa = (action$) =>
    action$.pipe(
        ofType(ADD_VISA), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-visa`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addVisaResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addVisaResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

visaEpic.getVisa = (action$) =>
    action$.pipe(
        ofType(GET_VISA), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-visa/${action.payload.accountId}/${action.payload.userId}`,
                method: 'GET',
            }).pipe(
                map((response) => getVisaResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getVisaResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default visaEpic;