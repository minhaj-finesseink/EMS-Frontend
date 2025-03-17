import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { baseUrl } from '../../environments/environment.dev';
import { JOIN_MEETING, SEND_MEETING_INVITE, START_INSTANT_MEETING, UPDATE_HOST_CONTROL } from './video.types';
import { joinMeetingResponse, sendMeetingInviteResponse, startInstantMeetingResponse, updateHostControlResponse } from './video.action';

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

VideoConferenceEpic.sendMeetingInvite = (action$) =>
    action$.pipe(
        ofType(SEND_MEETING_INVITE),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/send-meeting-invite?recipientEmail=${action.payload.email}&meetingId=${action.payload.meetingId}`,
                method: 'GET',
            }).pipe(
                map((response) => sendMeetingInviteResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(sendMeetingInviteResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

VideoConferenceEpic.joinMeeting = (action$) =>
    action$.pipe(
        ofType(JOIN_MEETING),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/join-meeting`,
                method: 'POST',
                body: action.payload,
            }).pipe(
                map((response) => joinMeetingResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(joinMeetingResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

VideoConferenceEpic.updateHostControl = (action$) =>
    action$.pipe(
        ofType(UPDATE_HOST_CONTROL),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/update-host-control?meetingId=${action.payload.meetingId}`,
                method: 'PATCH',
                body: action.payload,
            }).pipe(
                map((response) => updateHostControlResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(updateHostControlResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

export default VideoConferenceEpic;
