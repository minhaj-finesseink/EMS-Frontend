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

import { ADD_EMPLOYEE, ADD_EMPLOYEE_RES, EMPLOYEE_PASS, EMPLOYEE_PASS_RES, GET_USER_BY_ID, GET_USER_BY_ID_RES, USER_UPDATE, USER_UPDATE_RES } from "./employee.types"



export const addEmployee = (data) => ({
    type: ADD_EMPLOYEE,
    payload: data
})

export const addEmployeeResponse = (data) => ({
    type: ADD_EMPLOYEE_RES,
    payload: data
})

export const employeePass = (data) => ({
    type: EMPLOYEE_PASS,
    payload: data
})

export const employeePassResponse = (res) => ({
    type: EMPLOYEE_PASS_RES,
    payload: res
})

export const getUserById = (data) => ({
    type: GET_USER_BY_ID,
    payload: data
})

export const getUserByIdResponse = (res) => ({
    type: GET_USER_BY_ID_RES,
    payload: res
})

export const userUpdate = (data) => ({
    type: USER_UPDATE,
    payload: data
})

export const userUpdateResponse = (res) => ({
    type: USER_UPDATE_RES,
    payload: res
})