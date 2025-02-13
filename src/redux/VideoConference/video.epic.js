import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { baseUrl } from '../../environments/environment.dev';
import { START_INSTANT_MEETING } from './video.types';
import { startInstantMeetingResponse } from './video.action';

const BaseUrl = baseUrl;

const VideoConferenceEpic = {};

VideoConferenceEpic.startInstantMeeting = (action$) =>
    action$.pipe(
        ofType(START_INSTANT_MEETING),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/start-instant-meeting?username=${action.payload.username}`,
                method: 'GET',
                // body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => startInstantMeetingResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(startInstantMeetingResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

export default VideoConferenceEpic;
