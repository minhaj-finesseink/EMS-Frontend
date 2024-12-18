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

import { ADD_GENERAL_TIME_OFF, ADD_GENERAL_TIME_OFF_RES, GET_GENERAL_TIME_OFF, GET_GENERAL_TIME_OFF_RES } from "./generalTimeOff.types"


export const addGeneralTimeOff = (data) => ({
    type: ADD_GENERAL_TIME_OFF,
    payload: data
})

export const addGeneralTimeOffResponse = (data) => ({
    type: ADD_GENERAL_TIME_OFF_RES,
    payload: data
})

export const getGeneralTimeOff = (data) => ({
    type: GET_GENERAL_TIME_OFF,
    payload: data
})

export const getGeneralTimeOffResponse = (data) => ({
    type: GET_GENERAL_TIME_OFF_RES,
    payload: data
})
