import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs'; // To handle errors gracefully
import { addCompanyResponse } from './company.action';
import { ADD_COMPANY } from './company.type';

// const BaseUrl = 'http://localhost:5000/api';
const BaseUrl = 'https://ems-backend-c517.onrender.com/api';

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