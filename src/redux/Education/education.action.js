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

import { ADD_EDUCATION, ADD_EDUCATION_RES, GET_EDUCATION, GET_EDUCATION_RES } from "./education.type"

export const addEducation = (data) => ({
    type: ADD_EDUCATION,
    payload: data
})

export const addEducationResponse = (data) => ({
    type: ADD_EDUCATION_RES,
    payload: data
})

export const getEducation = (data) => ({
    type: GET_EDUCATION,
    payload: data
})

export const getEducationResponse = (data) => ({
    type: GET_EDUCATION_RES,
    payload: data
})