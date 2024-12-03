import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { ADD_EMPLOYEE, EMPLOYEE_PASS } from './employee.types';
import { addEmployeeResponse, employeePassResponse } from './employee.action';

// const BaseUrl = 'http://localhost:5000/api';
const BaseUrl = 'https://ems-backend-c517.onrender.com/api';

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

export default AddEmployeeEpic;