import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { baseUrl } from '../../../environments/environment.dev';
import { ADD_SHIFT, DELETE_SHIFT_BY_ID, GET_ALL_SHIFT, UPDATE_SHIFT_BY_ID } from './shift.types';
import { addShiftResponse, deleteShiftByIdResponse, getAllShiftResponse, updateShiftByIdResponse } from './shift.action';

const BaseUrl = baseUrl;

const ShiftEpic = {};

ShiftEpic.addShift = (action$) =>
    action$.pipe(
        ofType(ADD_SHIFT), // Listen for the ADD_SHIFT action type
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/shift/create-shift`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addShiftResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(addShiftResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

ShiftEpic.getAllShift = (action$) =>
    action$.pipe(
        ofType(GET_ALL_SHIFT), // Listen for the ADD_SHIFT action type
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/shift/get-all-shifts?format=${action.payload}`,
                method: 'GET',
                // body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => getAllShiftResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(getAllShiftResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

ShiftEpic.deleteShiftById = (action$) =>
    action$.pipe(
        ofType(DELETE_SHIFT_BY_ID), // Listen for the ADD_SHIFT action type
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/shift/delete-shift-by-id/${action.payload}`,
                method: 'DELETE',
                // body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => deleteShiftByIdResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(deleteShiftByIdResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

ShiftEpic.updateShiftById = (action$) =>
    action$.pipe(
        ofType(UPDATE_SHIFT_BY_ID), // Listen for the ADD_SHIFT action type
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/shift/update-shift-by-id/${action.payload.id}`,
                method: 'PUT',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => updateShiftByIdResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(updateShiftByIdResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

export default ShiftEpic;
