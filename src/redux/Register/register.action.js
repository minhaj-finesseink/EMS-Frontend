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

import { REGISTER, REGISTER_RES } from "./register.types";


export const register = (data) => ({
  type: REGISTER,
  payload: data,
});

export const registerResponse = (res) => ({
  type: REGISTER_RES,
  payload: res,
});