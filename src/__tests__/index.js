import CONFIG from "../../config"
import Bosta, { DELIVERY_TYPES, CITIES } from "../index"

// import { mockAllAPIs, removeAPIMock } from "./helper/api_mock"
// const { NODE_ENV, PORT } = process.env
jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000
// let url
process.env.BOSTA_API_KEY = process.env.BOSTA_API_KEY || CONFIG.API_KEY
process.env.NODE_ENV = "test"

describe("Bosta methods", () => {
  let cashCollection, createdDeliveries

  test("Bosta Generic request delivery method", async () => {
    let res
    try {
      res = await Bosta.requestDelivery({
        apiKey: CONFIG.API_KEY,
        type: DELIVERY_TYPES.CASH_COLLECTION.code,
        address: "7 Almaza square, Heliopolis, Cairo",
        amount: 40,
        city: CITIES.CAIRO.code,
        name: "Amr Draz",
        phone: "+200201020202",
      })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    // delivery1 = res.data
    expect(res.status).toBe(200)
    expect(res.data.message).toEqual("Delivery created successfully!")
  })
  test("Collect Cash", async () => {
    let res
    try {
      res = await Bosta.collect({
        amount: 50,
        city: CITIES.CAIRO.code,
        address: "7 Almaza square, Heliopolis, Cairo",
        name: "Amr Draz",
        phone: "+200201020202",
        notes: "test",
        businessReference: "asdas",
      })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    cashCollection = res.data
    expect(res.status).toBe(200)
  })
  test("Package Delivery", async () => {
    let res = await Bosta.deliver({
      name: "Amr Draz",
      phone: "+200201020202",
      city: CITIES.CAIRO.code,
      address: "7 Almaza square, Heliopolis, Cairo",
      pickupAddress: {
        firstLine: "25 street, Second District, 5th Settelment",
        floor: 1,
      },
    })
    expect(res.status).toBe(200)
  })
  test("get delivery data", async () => {
    expect(cashCollection).toBeDefined()
    let res
    try {
      res = await Bosta.getDelivery({
        id: cashCollection._id,
      })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    expect(res.status).toBe(200)
    expect(res.data.delivery._id).toEqual(cashCollection._id)
    cashCollection = res.data.delivery
  })
  test("check if can update delivery", async () => {
    expect(cashCollection).toBeDefined()
    let res
    try {
      res = await Bosta.canUpdate({
        id: cashCollection._id,
        fields: ["notes"],
      })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    expect(res.status).toBe(200)
    expect(res.data.canUpdate).toEqual(true)
    expect(res.data.reason).toBeUndefined()
  })
  test("check if can update state should fail", async () => {
    expect(cashCollection).toBeDefined()
    try {
      await Bosta.canUpdate({
        id: cashCollection._id,
        fields: ["state"],
      })
    } catch (e) {
      expect(e.response.status).toEqual(403)
    }
  })
  test("update delivery", async () => {
    expect(cashCollection).toBeDefined()
    let res
    const notes = "Don't do it"
    try {
      res = await Bosta.update({ id: cashCollection._id, notes })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    expect(res.status).toBe(200)
    expect(res.data._id).toEqual(cashCollection._id)
    expect(res.data.message).toEqual("Delivery updated successfully!")
  })
  test("cancel delivery", async () => {
    expect(cashCollection).toBeDefined()
    let res
    try {
      res = await Bosta.cancel({ id: cashCollection._id })
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    expect(res.status).toBe(200)
    expect(res.data._id).toEqual(cashCollection._id)
  })
  test("get deliveries", async () => {
    let res
    try {
      res = await Bosta.getDeliveries()
    } catch (e) {
      console.log(e.response.data)
      expect(e).toBeUndefined()
    }
    expect(res.status).toBe(200)
    expect(res.data.deliveries.length).toBeGreaterThan(1)
    createdDeliveries = res.data.deliveries
  })
})
