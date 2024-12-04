import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { addCompanyResponse } from './company.action';
import { ADD_COMPANY } from './company.type';
import { baseUrl } from '../../../environments/environment.dev';

const BaseUrl = baseUrl

const AddCompanyEpic = {};

AddCompanyEpic.addCompany = (action$) =>
    action$.pipe(
        ofType(ADD_COMPANY), // Listen for the LOGIN action type
        switchMap((action) =>
            ajax({
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `${BaseUrl}/add-company`,
                method: 'POST',
                body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => addCompanyResponse(response.response)), // Extract and pass response data
                catchError((error) => of(addCompanyResponse({ error: error.message }))) // Graceful error handling
            )
        )
    );

export default AddCompanyEpic;