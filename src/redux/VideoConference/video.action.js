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

import { JOIN_MEETING, JOIN_MEETING_RES, SEND_MEETING_INVITE, SEND_MEETING_INVITE_RES, START_INSTANT_MEETING, START_INSTANT_MEETING_RES } from "./video.types"

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