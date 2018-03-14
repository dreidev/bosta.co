import {
  API,
  createDelivery,
  cancelDelivery,
  updateDelivery,
  canUpdateDelivery,
  getDelivery,
  getDeliveries,
} from "./api"

import { DELIVERY_TYPES, DELIVERY_STATES, CITIES } from "./constants"

export { DELIVERY_TYPES, DELIVERY_STATES, CITIES }

export class Bosta {
  /**
   * request delivery from bosta's api
   * ```
   * requestDelivery({
   *  apiKey: String, // don't need to include if  process.env.BOSTA_API_KEY is set
   *  amount: Number, // the amount to be picked up (includes bosta's fee) optional in case of package delivery
   *  city: String, // Bosta enum for suported cities required if using address as string
   *  address: String | Address, // string of addressline or address object of the form { firstLine: String, city: String, geoLocation?: { lat: Number, lng: Number}, secondLine?: String, floor?: Number, appartment?: Number, zone?: String, District?: String } with firstLine being
   *  pickupAddress?: Address, // where the package is to be picked up from or cash to be collected from depending on delivery type
   *  deliveryAddress?: Address, // where package is to be delivered
   *  receiver: receiver, // who the delivery is ment for, object of the form { firstName: String, lastName: String, phone: String, email?: String } optional if name, phone is set
   *  name: String, // reciever first and last name required in case reciever object not set
   *  phone: String, // reciever phone required in case reciever object not set
   *  notes?: String, // A note for the courrier
   *  businessReference?: String, // an id for your personal use in your system
   * })
   * ```
   * @param {DeliveryRequestObject} delivery
   */
  static async requestDelivery({ apiKey, ...delivery }) {
    delivery = isSameDayFacade(
      receiverFacade(addressFacade(amountFacade(delivery)))
    )

    return createDelivery(API({ apiKey }), delivery)
  }

  /**
   * facade for requestDelivery function that sets delivery type to cash on delivery
   * @param {DeliveryRequestObject} delivery
   */
  static async collect(delivery) {
    delivery.type = DELIVERY_TYPES.CASH_COLLECTION.code
    return Bosta.requestDelivery(delivery)
  }

  /**
   * facade for requestDelivery function that sets delivery type to package delivery
   * @param {DeliveryRequestObject} delivery
   */
  static async deliver(delivery) {
    delivery.type = DELIVERY_TYPES.PACKAGE_DELIVERY.code
    return Bosta.requestDelivery(delivery)
  }

  /**
   * get data about one delivery
   * @param {Object} object containing apiKey, id of delivery, and optionally fields to limit returned results
   * @returns DeliveryRequestObject
   */
  static async getDelivery({ apiKey, id, fields }) {
    fields = convertToQueryParamsFlags(fields)
    return getDelivery(API({ apiKey }), { id, fields })
  }

  /**
   * get list of submited deliveris
   * @param {Object} object containing apiKey, params for filtering such as page and perPage for pagination
   * @returns [DeliveryRequestObject]
   */
  static async getDeliveries({ apiKey, query } = {}) {
    return getDeliveries(API({ apiKey }), query)
  }

  /**
   * update part of delivery if possible depending on status
   * @param {DeliveryRequestObject} delivery
   */
  static async update({ apiKey, ...delivery }) {
    return updateDelivery(API({ apiKey }), delivery)
  }

  /**
   * check if a list of fields can be updated example canUpdate({ id: 2, fields: ["pickupAddress"]})
   * @param {Object} object containing apiKey, id of delivery, and fields to check
   * @returns DeliveryRequestObject
   */
  static async canUpdate({ apiKey, id, fields }) {
    fields = convertToQueryParamsFlags(fields)
    return canUpdateDelivery(API({ apiKey }), { id, fields })
  }

  /**
   * delete delivery record if status has not moved to delivered
   * @param {Object} object containing apiKey and id of delivery
   * @returns DeliveryRequestObject
   */
  static async cancel({ apiKey, id }) {
    return cancelDelivery(API({ apiKey }), { id })
  }
}

export default Bosta

/**
 * converts isSameDay if present to number 1 in case a boolean flag was passed
 * @param {DeliveryRequestObject} delivery
 * @returns DeliveryRequestObject
 */
function isSameDayFacade({ isSameDay, ...delivery }) {
  delivery.isSameDay = isSameDay ? 1 : 0
  return delivery
}

/**
 * converts field amount cod to match the api spcification of bosta
 * @param {DeliveryRequestObject} delivery
 * @returns DeliveryRequestObject
 */
function amountFacade({ amount, ...delivery }) {
  delivery.cod = delivery.cod || amount
  return delivery
}

/**
 * converts field name, phone, email to a receiver object to match the api spcification of bosta
 * @param {DeliveryRequestObject} delivery
 * @returns DeliveryRequestObject
 */
function receiverFacade({ name, phone, ...delivery }) {
  if (!delivery.receiver) {
    if (!name) throw new Error("name is required in absance of receiver object")
    if (!phone)
      throw new Error("phone is required in absance of receiver object")
    let [firstName, lastName] = name.split(" ")
    delivery.receiver = {
      firstName,
      lastName,
      phone,
    }
  }
  return delivery
}

/**
 * converts field address to either pickupAddress or dropOffAddress depending on the delivery type
 * @param {DeliveryRequestObject} delivery
 * @returns DeliveryRequestObject
 */
function addressFacade({ address, city, ...delivery }) {
  if (!address) {
    return delivery
  } else {
    if (typeof address === "string") {
      address = { firstLine: address, city }
    }
    address.firstLine = address.firstLine || address.line1 || address.firstLine
    address.secondLine = address.secondLine || address.line2
    if (isCashCollection(delivery)) {
      delivery.pickupAddress = address
    } else {
      // if pickupAddress is not included in package delviery the buisness address is used
      delivery.dropOffAddress = address
    }
  }
  return delivery
}

/**
 * check that delivery is of type cash collection
 * @param {DeliveryRequestObject}
 * @returns Bool
 */
function isCashCollection(delivery) {
  return delivery.type === DELIVERY_TYPES.CASH_COLLECTION.code
}

/**
 * convert array of strings that into an object with value 1 for each element in the array
 * @param {Array[String] | Object} fields
 * @return Object of the form { [field]: 1 }
 */
function convertToQueryParamsFlags(fields) {
  if (Array.isArray(fields)) {
    return fields.reduce((fields, field) => ({ ...fields, [field]: 1 }), {})
  }
  return fields
}
