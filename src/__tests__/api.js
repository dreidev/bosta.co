import MockAdapter from "axios-mock-adapter"
import { mockAllAPIs, Delivery } from "./helper/api_mock"
import {
  API,
  createDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  canUpdateDelivery,
  cancelDelivery,
} from "../api"

const api = API("boo")
const mock = new MockAdapter()
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
  expect(res.data.message).toBe("Ok")
})

test("API getDeliveries", async () => {
  let delivery = Delivery()
  delivery.sameDay = false
  let res = await getDeliveries(api)
  expect(res.status).toEqual(200)
  expect(res.data).not.toBe(undefined)
  expect(res.data).toHaveLength(10)
})

test("API getDeliveries", async () => {
  let id = "hashashukadsi89"
  let res = await getDelivery(api, { id })
  expect(res.status).toEqual(200)
  expect(res.data._id).toEqual(id)
})

test("API getDeliveries", async () => {
  let id = "hashashukadsi89"
  let res = await updateDelivery(api, { id })
  expect(res.status).toEqual(200)
  expect(res.data._id).toEqual(id)
})

test("API getDeliveries", async () => {
  let id = "hashashukadsi89"
  let res = await cancelDelivery(api, { id })
  expect(res.status).toEqual(200)
  expect(res.data._id).toEqual(id)
})

test("API getDeliveries", async () => {
  let id = "hashashukadsi89"
  let fields = { status: 1 }
  let res = await canUpdateDelivery(api, { id, fields })
  expect(res.status).toEqual(200)
  expect(res.data.canUpdate).toBe(false)
  expect(res.data.reason).toEqual("Delivery has been made")
})
