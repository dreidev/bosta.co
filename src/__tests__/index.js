import CONFIG from "../../config"
import Bosta, { DELIVERY_TYPES, CITIES, DELIVERY_STATES } from "../index"
import { startTunnel, closeTunnel } from "./helper/localtunnel"
import { startServer, closeServer } from "./helper/util"

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000
process.env.BOSTA_API_KEY = process.env.BOSTA_API_KEY || CONFIG.API_KEY
process.env.NODE_ENV = "test"

describe("Bosta methods", () => {
  let cashCollection, host
  beforeAll(async () => {
    const PORT = 3209
    ;[{ url: host }] = await Promise.all([
      startTunnel(PORT),
      startServer({ PORT }),
    ])

    console.log(host)
    console.log(`started localtunnel at ${host}`)
  })

  afterAll(async () => {
    console.log("closing tunnel and server")
    closeTunnel()
    closeServer()
  })

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
      console.log(e)
      expect(e).toBeUndefined()
    }

    expect(res).toHaveProperty("trackingNumber")
    expect(res).toHaveProperty("_id")
    expect(res).toHaveProperty("state", DELIVERY_STATES.PENDING)
    expect(res.message).toEqual("Delivery created successfully!")
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
        webhookUrl: `${host}/bosta/webhook`,
      })
    } catch (e) {
      console.log(e)
      expect(e).toBeUndefined()
    }

    expect(res).toHaveProperty("trackingNumber")
    expect(res).toHaveProperty("_id")
    expect(res.message).toEqual("Delivery created successfully!")
    expect(res).toHaveProperty("state", DELIVERY_STATES.PENDING)
    cashCollection = res
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
    expect(res).toHaveProperty("trackingNumber")
    expect(res).toHaveProperty("_id")
    expect(res.message).toEqual("Delivery created successfully!")
    expect(res).toHaveProperty("state", DELIVERY_STATES.PENDING)
  })
  test("get delivery data", async () => {
    expect(cashCollection).toBeDefined()
    let res
    try {
      res = await Bosta.getDelivery({
        id: cashCollection._id,
      })
    } catch (e) {
      console.log(e)
      expect(e).toBeUndefined()
    }
    expect(res.delivery._id).toEqual(cashCollection._id)
    cashCollection = res.delivery
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
      console.log(e)
      expect(e).toBeUndefined()
    }
    expect(res.canUpdate).toEqual(true)
    expect(res.reason).toBeUndefined()
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
      console.log(e)
      expect(e).toBeUndefined()
    }
    expect(res._id).toEqual(cashCollection._id)
    expect(res.message).toEqual("Delivery updated successfully!")
  })
  test("cancel delivery", async () => {
    expect(cashCollection).toBeDefined()
    let res
    try {
      res = await Bosta.cancel({ id: cashCollection._id })
    } catch (e) {
      console.log(e)
      expect(e).toBeUndefined()
    }
    expect(res._id).toEqual(cashCollection._id)
  })
  test("get deliveries", async () => {
    let res
    try {
      res = await Bosta.getDeliveries()
    } catch (e) {
      console.log(e)
      expect(e).toBeUndefined()
    }
    expect(res.deliveries.length).toBeGreaterThan(1)
  })
})
