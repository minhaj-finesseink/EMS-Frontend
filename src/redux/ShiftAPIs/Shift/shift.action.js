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

import { ADD_SHIFT, ADD_SHIFT_BULK_USER, ADD_SHIFT_BULK_USER_RES, ADD_SHIFT_RES, ADD_SHIFT_USER_FROM_HR, ADD_SHIFT_USER_FROM_HR_RES, DELETE_SHIFT_BY_ID, DELETE_SHIFT_BY_ID_RES, GET_ALL_SHIFT, GET_ALL_SHIFT_RES, GET_USER_BY_USITIVE_HR, GET_USER_BY_USITIVE_HR_RES, UPDATE_SHIFT_BY_ID, UPDATE_SHIFT_BY_ID_RES } from "./shift.types";

export const addShift = (data) => ({
    type: ADD_SHIFT,
    payload: data
})

export const addShiftResponse = (res) => ({
    type: ADD_SHIFT_RES,
    payload: res
})

export const getAllShift = (data) => ({
    type: GET_ALL_SHIFT,
    payload: data
})

export const getAllShiftResponse = (res) => ({
    type: GET_ALL_SHIFT_RES,
    payload: res
})

export const deleteShiftById = (data) => ({
    type: DELETE_SHIFT_BY_ID,
    payload: data
})

export const deleteShiftByIdResponse = (res) => ({
    type: DELETE_SHIFT_BY_ID_RES,
    payload: res
})

export const updateShiftById = (data) => ({
    type: UPDATE_SHIFT_BY_ID,
    payload: data
})

export const updateShiftByIdResponse = (res) => ({
    type: UPDATE_SHIFT_BY_ID_RES,
    payload: res
})

export const getUserByUsitiveHr = (data) => ({
    type: GET_USER_BY_USITIVE_HR,
    payload: data
})

export const getUserByUsitiveHrResponse = (res) => ({
    type: GET_USER_BY_USITIVE_HR_RES,
    payload: res
})

export const addShiftBulkUser = (data) => ({
    type: ADD_SHIFT_BULK_USER,
    payload: data
})

export const addShiftBulkUserResponse = (res) => ({
    type: ADD_SHIFT_BULK_USER_RES,
    payload: res
})

export const addShiftUserFromHr = (data) => ({
    type: ADD_SHIFT_USER_FROM_HR,
    payload: data
})

export const addShiftUserFromHrResponse = (res) => ({
    type: ADD_SHIFT_USER_FROM_HR_RES,
    payload: res
})