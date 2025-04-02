/**
 * @fileOverview Manages the action w.r.t types in the redux
 * @author Muhammed Minhaj <minhaj@finesseink.com>com>

 * return(
 type and payload
 * )
 * @example export const actionName = (params) => ({
  type: Type of the action from login.type.js,
  payload: object - contains params,
})
 */

import {
    JOIN_MEETING,
    JOIN_MEETING_RES,
    SCHEDULE_MEETING,
    SCHEDULE_MEETING_RES,
    SEND_MEETING_INVITE,
    SEND_MEETING_INVITE_RES,
    START_INSTANT_MEETING,
    START_INSTANT_MEETING_RES,
    UPDATE_HOST_CONTROL,
    UPDATE_HOST_CONTROL_RES,
    UPDATE_MEET_SETTINGS,
    UPDATE_MEET_SETTINGS_RES
} from "./video.types"

export const startInstantMeeting = (data) => ({
    type: START_INSTANT_MEETING,
    payload: data
})

export const startInstantMeetingResponse = (res) => ({
    type: START_INSTANT_MEETING_RES,
    payload: res
})

export const sendMeetingInvite = (data) => ({
    type: SEND_MEETING_INVITE,
    payload: data
})

export const sendMeetingInviteResponse = (res) => ({
    type: SEND_MEETING_INVITE_RES,
    payload: res
})

export const joinMeeting = (data) => ({
    type: JOIN_MEETING,
    payload: data
})

export const joinMeetingResponse = (res) => ({
    type: JOIN_MEETING_RES,
    payload: res
})

export const updateHostControl = (data) => ({
    type: UPDATE_HOST_CONTROL,
    payload: data
})

export const updateHostControlResponse = (res) => ({
    type: UPDATE_HOST_CONTROL_RES,
    payload: res
})

export const updateMeetSettings = (data) => ({
    type: UPDATE_MEET_SETTINGS,
    payload: data
})

export const updateMeetSettingsResponse = (res) => ({
    type: UPDATE_MEET_SETTINGS_RES,
    payload: res
})

export const scheduleMeeting = (data) => ({
    type: SCHEDULE_MEETING,
    payload: data
})

export const scheduleMeetingResponse = (res) => ({
    type: SCHEDULE_MEETING_RES,
    payload: res
})