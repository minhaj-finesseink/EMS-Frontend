import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
// import { baseUrl } from '../../environments/environment.dev';
import { GET_CALENDAR_MEETING, JOIN_MEETING, SCHEDULE_MEETING, SEND_MEETING_INVITE, START_INSTANT_MEETING, UPDATE_HOST_CONTROL, UPDATE_MEET_SETTINGS } from './video.types';
import { getCalendarMeetingResponse, joinMeetingResponse, scheduleMeetingResponse, sendMeetingInviteResponse, startInstantMeetingResponse, updateHostControlResponse, updateMeetSettingsResponse } from './video.action';

const BaseUrl = import.meta.env.VITE_BACKEND_URL;

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

VideoConferenceEpic.updateMeetSettings = (action$) =>
    action$.pipe(
        ofType(UPDATE_MEET_SETTINGS),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/meet-settings`,
                method: 'PATCH',
                body: action.payload,
            }).pipe(
                map((response) => updateMeetSettingsResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(updateMeetSettingsResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

VideoConferenceEpic.scheduleMeeting = (action$) =>
    action$.pipe(
        ofType(SCHEDULE_MEETING),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/schedule-meeting`,
                method: 'POST',
                body: action.payload,
            }).pipe(
                map((response) => scheduleMeetingResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(scheduleMeetingResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

VideoConferenceEpic.getCalendarMeeting = (action$) =>
    action$.pipe(
        ofType(GET_CALENDAR_MEETING),
        switchMap((action) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            return ajax({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add token to Authorization header
                },
                url: `${BaseUrl}/video-call/calender-meetings?startDate=${action.payload.startDate}&endDate=${action.payload.endDate}`,
                method: 'GET',
                // body: action.payload, // Directly use action.payload, no need to stringify
            }).pipe(
                map((response) => getCalendarMeetingResponse(response.response)), // Extract and pass response data
                catchError((error) =>
                    of(getCalendarMeetingResponse({ error: error.message })) // Graceful error handling
                )
            );
        })
    );

export default VideoConferenceEpic;
