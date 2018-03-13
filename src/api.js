import Axios from "axios"
import { BASE_URL } from "./constants"

export const API = (api_key, url) =>
  Axios.create({
    baseURL: url || BASE_URL,
    headers: {
      Authorization: `Authorization: ${api_key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

export const canUpdateDelivery = (API, { id, fields }) =>
  API.get(`/deliveries/can_update_delivery/${id}`, { params: fields })
export const updateDelivery = (API, { id, ...data }) =>
  API.patch(`/deliveries/${id}`, data)

export const createDelivery = (API, data) => API.post(`/deliveries`, data)
export const getDeliveries = (API, params) => API.get(`/deliveries`, { params })
export const getDelivery = (API, { id, fields }) =>
  API.get(`/deliveries/${id}`, { params: fields })
export const cancelDelivery = (API, { id }) => API.delete(`/deliveries/${id}`)
