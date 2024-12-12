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

import { ADD_VISA, ADD_VISA_RES, GET_VISA, GET_VISA_RES } from "./visa.type"

export const addVisa = (data) => ({
    type: ADD_VISA,
    payload: data
})

export const addVisaResponse = (data) => ({
    type: ADD_VISA_RES,
    payload: data
})

export const getVisa = (data) => ({
    type: GET_VISA,
    payload: data
})

export const getVisaResponse = (data) => ({
    type: GET_VISA_RES,
    payload: data
})