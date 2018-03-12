import Axios from "axios"
import { BASE_URL } from "./constants"

const API = Axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": null,
  },
})
export default API

