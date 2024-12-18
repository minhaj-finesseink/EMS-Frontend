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

import { ADD_USER_TIME_OFF, ADD_USER_TIME_OFF_RES } from "./userTimeOff.types"

export const addUserTimeOff = (data) => ({
    type: ADD_USER_TIME_OFF,
    payload: data
})

export const addUserTimeOffResponse = (data) => ({
    type: ADD_USER_TIME_OFF_RES,
    payload: data
})