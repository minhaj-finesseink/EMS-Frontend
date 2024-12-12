import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { ADD_EMPLOYEE, EMPLOYEE_PASS, GET_USER_BY_ID, USER_UPDATE } from './employee.types';
import { addEmployeeResponse, employeePassResponse, getUserByIdResponse, userUpdateResponse } from './employee.action';
import { baseUrl } from '../../environments/environment.dev';

const BaseUrl = baseUrl

const AddEmployeeEpic = {};

AddEmployeeEpic.addEmployee = (action$) =>
    action$.pipe(
        ofType(ADD_EMPLOYEE), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-user`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addEmployeeResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addEmployeeResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

AddEmployeeEpic.employeePass = (action$) =>
    action$.pipe(
        ofType(EMPLOYEE_PASS), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/setup-password`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => employeePassResponse(response.response)), // Extract and pass response data
                catchError((error) => of(employeePassResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

AddEmployeeEpic.getUserById = (action$) =>
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

AddEmployeeEpic.userUpdate = (action$) =>
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

export default AddEmployeeEpic;