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

import { ADD_EMPLOYEE, ADD_EMPLOYEE_RES, EMPLOYEE_PASS, EMPLOYEE_PASS_RES } from "./employee.types"



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