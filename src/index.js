import {
  API,
  createDelivery,
  cancelDelivery,
  updateDelivery,
  canUpdateDelivery,
  getDelivery,
  getDeliveries,
} from "./api"

import { DELIVERY_TYPES, DELIVERY_STATES } from "./constants"

export { DELIVERY_TYPES, DELIVERY_STATES }

export class Bosta {
  /**
   * request delivery from bosta's api
   * ```
   * requestDelivery({
   *  api_key: String, // don't need to include if  process.env.BOSTA_API_KEY is set
   *  amount: Number, // the amount to be picked up (includes bosta's fee) optional in case of package delivery
   *  address: String | Address, // string of addressline or address object of the form { firstLine: String, geoLocation?: { lat: Number, lng: Number}, secondLine?: String, floor?: Number, appartment?: Number, zone?: String, District?: String } with firstLine being
   *  pickupAddress?: Address, // where the package is to be picked up from or cash to be collected from depending on delivery type
   *  deliveryAddress?: Address, // where package is to be delivered
   *  reciever: Reciever, // who the delivery is ment for, object of the form { firstName: String, lastName: String, phone: String, email?: String }
   *  notes: String, // A note for the courrier
   *  businessReference: String, // an id for your personal use in your system
   * })
   * ```
   * @param {DeliveryRequestObject} delivery
   */
  static async requestDelivery({
    api_key = process.env.BOSTA_API_KEY,
    ...delivery
  }) {
    delivery = isSameDayFacade(addressFacade(amountFacade(delivery)))
    return createDelivery(API(api_key), delivery)
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
   * @param {Object} object containing api_key, id of delivery, and optionally fields to limit returned results
   * @returns DeliveryRequestObject
   */
  static async getDelivery({
    api_key = process.env.BOSTA_API_KEY,
    id,
    fields,
  }) {
    fields = convertToQueryParamsFlags(fields)
    return getDelivery(API(api_key), { id, fields })
  }

  /**
   * get list of submited deliveris
   * @param {Object} object containing api_key, params for filtering such as page and perPage for pagination
   * @returns [DeliveryRequestObject]
   */
  static async getDeliveries(
    { api_key = process.env.BOSTA_API_KEY, query } = {}
  ) {
    return getDeliveries(API(api_key), query)
  }

  /**
   * update part of delivery if possible depending on status
   * @param {DeliveryRequestObject} delivery
   */
  static async update({ api_key = process.env.BOSTA_API_KEY, ...delivery }) {
    return updateDelivery(API(api_key), delivery)
  }

  /**
   * check if a list of fields can be updated example canUpdate({ id: 2, fields: ["pickupAddress"]})
   * @param {Object} object containing api_key, id of delivery, and fields to check
   * @returns DeliveryRequestObject
   */
  static async canUpdate({ api_key = process.env.BOSTA_API_KEY, id, fields }) {
    fields = convertToQueryParamsFlags(fields)
    return canUpdateDelivery(API(api_key), { id, fields })
  }

  /**
   * delete delivery record if status has not moved to delivered
   * @param {Object} object containing api_key and id of delivery
   * @returns DeliveryRequestObject
   */
  static async cancel({ api_key = process.env.BOSTA_API_KEY, id }) {
    return cancelDelivery(API(api_key), { id })
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
 * converts field address to either pickupAddress or dropOffAddress depending on the delivery type
 * @param {DeliveryRequestObject} delivery
 * @returns DeliveryRequestObject
 */
function addressFacade({ address, ...delivery }) {
  if (!address) {
    return delivery
  } else {
    if (typeof address === "string") {
      address = { firstLine: address }
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
