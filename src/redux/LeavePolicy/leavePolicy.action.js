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

import { ADD_LEAVE_POLICY, ADD_LEAVE_POLICY_RES, GET_LEAVE_POLICY, GET_LEAVE_POLICY_RES } from "./leavePolicy.types"

export const addLeavePolicy = (data) => ({
    type: ADD_LEAVE_POLICY,
    payload: data
})

export const addLeavePolicyResponse = (data) => ({
    type: ADD_LEAVE_POLICY_RES,
    payload: data
})

export const getLeavePolicy = (data) => ({
    type: GET_LEAVE_POLICY,
    payload: data
})

export const getLeavePolicyResponse = (data) => ({
    type: GET_LEAVE_POLICY_RES,
    payload: data
})
