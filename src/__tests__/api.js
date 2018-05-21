import MockAdapter from "axios-mock-adapter"
import {
  mockAllAPIs,
  Delivery,
  CREATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "./helper/api_mock"
import {
  API,
  createDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  canUpdateDelivery,
  cancelDelivery,
} from "../api"
import CONFIG from "../../config.ignore"
import { STAGE_BASE_URL, BASE_URL } from "src/constants"

process.env.BOSTA_API_KEY = process.env.BOSTA_API_KEY || CONFIG.API_KEY
process.env.NODE_ENV = process.env.NODE_ENV || "test"
const FAKE_API = "fake_api"

describe("mock", () => {
  const api = API()
  const mock = new MockAdapter(api)

  beforeAll(async () => {
    mockAllAPIs(mock)
  })
  afterAll(async () => mock.restore())

  test("API createDelivery", async () => {
    let delivery = Delivery()
    delivery.sameDay = false
    let res = await createDelivery(api, delivery)
    expect(res.status).toEqual(200)
    expect(res.data._id).not.toBe(undefined)
    expect(res.data.message).toBe(CREATE_SUCCESS_MESSAGE)
  })

  test("API getDeliveries", async () => {
    let delivery = Delivery()
    delivery.sameDay = false
    let res = await getDeliveries(api)
    expect(res.status).toEqual(200)
    expect(res.data).not.toBe(undefined)
    expect(res.data).toHaveLength(10)
  })

  test("API getDelivery", async () => {
    let id = "hashashukadsi89"
    let res = await getDelivery(api, { id })
    expect(res.status).toEqual(200)
    expect(res.data._id).toEqual(id)
  })

  test("API updateDelivery", async () => {
    let id = "hashashukadsi89"
    let res = await updateDelivery(api, { id })
    expect(res.status).toEqual(200)
    expect(res.data._id).toEqual(id)
    expect(res.data.message).toBe(UPDATE_SUCCESS_MESSAGE)
  })

  test("API cancelDelivery", async () => {
    let id = "hashashukadsi89"
    let res = await cancelDelivery(api, { id })
    expect(res.status).toEqual(200)
    expect(res.data._id).toEqual(id)
    expect(res.data.message).toBe(DELETE_SUCCESS_MESSAGE)
  })

  test("API canUpdateDelivery", async () => {
    let id = "hashashukadsi89"
    let fields = { status: 1 }
    let res = await canUpdateDelivery(api, { id, fields })

    expect(res.status).toEqual(200)
    expect(res.data.canUpdate).toBe(false)
    expect(res.data.reason).toEqual("Delivery has been made")
  })
  test("API Factory defaults", () => {
    process.env.NODE_ENV = "production"
    let api = API({ apiKey: FAKE_API })
    expect(api.defaults.headers.Authorization).toEqual(FAKE_API)
    expect(api.defaults.baseURL).toEqual(BASE_URL)
    process.env.NODE_ENV = "test"
    api = API()
    expect(api.defaults.headers.Authorization).toEqual(CONFIG.API_KEY)
    expect(api.defaults.baseURL).toEqual(STAGE_BASE_URL)
  })
})
