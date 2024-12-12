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

import { ADD_COMPANY, ADD_COMPANY_RES } from "./company.type";

export const addcompany = (data) => ({
    type: ADD_COMPANY,
    payload: data
})

export const addCompanyResponse = (data) => ({
    type: ADD_COMPANY_RES,
    payload: data
})