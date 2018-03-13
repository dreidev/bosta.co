import CONFIG from "../../config"
import Bosla, { DELIVERY_TYPES } from "../index"

// import { mockAllAPIs, removeAPIMock } from "./helper/api_mock"
// const { NODE_ENV, PORT } = process.env
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
// let url
process.env.BOSLA_API_KEY = CONFIG.API_KEY

describe("Bosla methods", () => {
  let cashCollection, packageDelivery
  test("Bosla Generic pickup method", async () => {
    let res = await Bosla.requestDelivery({
      api_key: CONFIG.API_KEY,
      type: DELIVERY_TYPES.CASH_COLLECTION.code,
      address: "7 Almaza square, Heliopolis, Cairo",
      amount: 40,
    })
    console.log(res.data)
    // delivery1 = res.data
    expect(res.status).toBe(200)
  })
  test("Collect Cash", async () => {
    let res = await Bosla.collect({
      address: "7 Almaza square, Heliopolis, Cairo",
      amount: 50,
    })
    cashCollection = res.data
    expect(res.status).toBe(200)
  })
  test("Package Delivery", async () => {
    let res = await Bosla.deliver({
      address: "7 Almaza square, Heliopolis, Cairo",
      pickupAddress: {
        firstLine: "25 street, Second District, 5th Settelment",
        floor: 1,
      },
    })
    packageDelivery = res.data
    expect(res.status).toBe(200)
  })
  test("get delivery data", async () => {
    expect(cashCollection).toBeDefined()
    let res = await Bosla.getDelivery({
      id: cashCollection._id,
    })
    expect(res.status).toBe(200)
    expect(res.data._id).toBe(cashCollection._id)
    cashCollection = res.data
  })
  test("get deliveries", async () => {
    let res = await Bosla.getDeliveries()
    expect(res.status).toBe(200)
    expect(res.data.length).toBeGreaterThan(2)
  })
  test("check if can update delivery", async () => {
    expect(cashCollection).toBeDefined()
    let res = await Bosla.canUpdate({
      id: cashCollection._id,
      fields: ["notes"],
    })
    expect(res.status).toBe(200)
    expect(res.data.canUpdate).toEqual(true)
  })
  test("update delivery", async () => {
    expect(cashCollection).toBeDefined()
    const notes = "Don't do it"
    let res = await Bosla.update({ id: cashCollection._id, notes })
    expect(res.status).toBe(200)
    expect(res.data.notes).toEqual(notes)
    cashCollection = res.data
  })
  test("cancel delivery", async () => {
    expect(packageDelivery).toBeDefined()
    let res = await Bosla.cancel({ id: packageDelivery._id })
    expect(res.status).toBe(200)
    expect(res.data._id).toEqual(packageDelivery._id)
  })
})
