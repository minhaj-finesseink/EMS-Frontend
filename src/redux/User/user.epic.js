import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { baseUrl } from '../../environments/environment.dev';
import { ADD_USER, GET_USER_BY_COMPANY_ID, GET_USER_BY_ID, USER_PASS, USER_UPDATE } from './user.types';
import { addUserResponse, getUserByCompanyIdResponse, getUserByIdResponse, userPasswordResponse, userUpdateResponse } from './user.action';

const BaseUrl = baseUrl

const UserEpic = {};

UserEpic.addUser = (action$) =>
    action$.pipe(
        ofType(ADD_USER), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-user`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addUserResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addUserResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

UserEpic.userPass = (action$) =>
    action$.pipe(
        ofType(USER_PASS), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/setup-password`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => userPasswordResponse(response.response)), // Extract and pass response data
                catchError((error) => of(userPasswordResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

UserEpic.getUserById = (action$) =>
    action$.pipe(
        ofType(GET_USER_BY_ID), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-user/${action.payload}`,
                method: 'GET',
            }).pipe(
                map((response) => getUserByIdResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getUserByIdResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

UserEpic.userUpdate = (action$) =>
    action$.pipe(
        ofType(USER_UPDATE), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/update-user/${action.payload.userId}`,
                method: 'PUT',
                body: action.payload,
            }).pipe(
                map((response) => userUpdateResponse(response.response)), // Extract and pass response data
                catchError((error) => of(userUpdateResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

UserEpic.getUserByCompanyId = (action$) =>
    action$.pipe(
        ofType(GET_USER_BY_COMPANY_ID), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-user/company/${action.payload}`,
                method: 'GET',
            }).pipe(
                map((response) => getUserByCompanyIdResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getUserByCompanyIdResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default UserEpic;