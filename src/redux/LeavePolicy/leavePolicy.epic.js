import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { baseUrl } from '../../environments/environment.dev';
import { ADD_LEAVE_POLICY, GET_LEAVE_POLICY } from './leavePolicy.types';
import { addLeavePolicyResponse, getLeavePolicyResponse } from './leavePolicy.action';

const BaseUrl = baseUrl

const leavePolicyEpic = {};

leavePolicyEpic.addLeavePolicy = (action$) =>
    action$.pipe(
        ofType(ADD_LEAVE_POLICY), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-policy`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addLeavePolicyResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addLeavePolicyResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

leavePolicyEpic.getLeavePolicy = (action$) =>
    action$.pipe(
        ofType(GET_LEAVE_POLICY), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-policy/${action.payload.accountId}`,
                method: 'GET',
            }).pipe(
                map((response) => getLeavePolicyResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getLeavePolicyResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default leavePolicyEpic;