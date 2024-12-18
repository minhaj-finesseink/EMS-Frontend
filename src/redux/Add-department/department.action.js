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

import { ADD_DEPARTMENT, ADD_DEPARTMENT_RES, GET_DEPARTMENT, GET_DEPARTMENT_RES } from "./department.types"


export const addDepartment = (data) => ({
    type: ADD_DEPARTMENT,
    payload: data
})

export const addDepartmentResponse = (data) => ({
    type: ADD_DEPARTMENT_RES,
    payload: data
})

export const getDepartment = (data) => ({
    type: GET_DEPARTMENT,
    payload: data
})

export const getDepartmentResponse = (data) => ({
    type: GET_DEPARTMENT_RES,
    payload: data
})