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

import { ADD_USER, ADD_USER_RES, GET_USER_BY_ID, GET_USER_BY_ID_RES, USER_PASS, USER_PASS_RES, USER_UPDATE, USER_UPDATE_RES } from "./user.types"


export const addUser = (data) => ({
    type: ADD_USER,
    payload: data
})

export const addUserResponse = (data) => ({
    type: ADD_USER_RES,
    payload: data
})

export const userPassword = (data) => ({
    type: USER_PASS,
    payload: data
})

export const userPasswordResponse = (res) => ({
    type: USER_PASS_RES,
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