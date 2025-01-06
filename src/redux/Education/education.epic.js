import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { baseUrl } from '../../environments/environment.dev';
import { ADD_EDUCATION, GET_EDUCATION } from './education.type';
import { addEducationResponse, getEducationResponse } from './education.action';

const BaseUrl = baseUrl

const educationEpic = {};

educationEpic.addEducation = (action$) =>
    action$.pipe(
        ofType(ADD_EDUCATION), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-education`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addEducationResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addEducationResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

educationEpic.getEducation = (action$) =>
    action$.pipe(
        ofType(GET_EDUCATION), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/get-education/${action.payload.companyId}/${action.payload.userId}`,
                method: 'GET',
            }).pipe(
                map((response) => getEducationResponse(response.response)), // Extract and pass response data
                catchError((error) => of(getEducationResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default educationEpic;