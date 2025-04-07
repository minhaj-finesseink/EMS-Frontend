import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { ADD_DEPARTMENT, GET_DEPARTMENT } from './department.types';
import { addDepartmentResponse, getDepartmentResponse } from './department.action';
// import { baseUrl } from '../../environments/environment.dev';

const BaseUrl = import.meta.env.VITE_BACKEND_URL

const AddDepartmentEpic = {};

AddDepartmentEpic.addDepartment = (action$) =>
    action$.pipe(
        ofType(ADD_DEPARTMENT), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-department`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addDepartmentResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addDepartmentResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

AddDepartmentEpic.getDepartment = (action$) =>
    action$.pipe(
        ofType(GET_DEPARTMENT), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-department/${action.payload}`,
                method: 'GET',
            }).pipe(
                map((response) => getDepartmentResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getDepartmentResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default AddDepartmentEpic;