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

import { START_INSTANT_MEETING, START_INSTANT_MEETING_RES } from "./video.types"

export const startInstantMeeting = (data) => ({
    type: START_INSTANT_MEETING,
    payload: data
})

export const startInstantMeetingResponse = (res) => ({
    type: START_INSTANT_MEETING_RES,
    payload: res
})