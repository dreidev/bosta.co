import faker from "faker"
import { DELIVERY_STATES } from "src/constants"
import { DELIVERY_TYPES } from "../../constants"

export let mock

export function removeAPIMock() {
  mock.restore()
}
export function mockAllAPIs(mock) {
  api_mocks.forEach(({ method, url, response }) => {
    method =
      "on" +
      method.toLowerCase()[0].toUpperCase() +
      method.toLowerCase().substr(1)
    mock[method](url).reply(response)
  })
}

function optional(value) {
  return faker.helpers.randomize([value, undefined])
}

export const Reciever = () => ({
  firstName: faker.name.firstName(), // String Receiver’s first name.
  lastName: faker.name.lastName(), // String Receiver’s last name.
  phone: faker.phone.phoneNumber(), // String Receiver’s phone number started with country key e.g (+201000000000).
  email: optional(faker.internet.email()), // (optional)
})

export const Location = () => ({
  lat: faker.address.latitude(),
  lng: faker.address.longitude(),
})

export const Address = ({ isSameDay = 0 } = {}) => ({
  _id: faker.random.uuid(),
  geoLocation: isSameDay ? Location() : undefined, // (optional) required if same day delivery
  firstLine: faker.address.streetAddress(), // Human Readable Street Address
  secondLine: optional(faker.address.streetAddress()), // (optional) Address notes.
  floor: optional(faker.random.number(9)),
  apartment: optional(faker.random.number(100)),
  zone: optional(faker.helpers.randomize(["Cairo", "Alexandira"])),
  district: optional(
    faker.helpers.randomize([
      "Masr Al Jadidah",
      "Heliopolis",
      "Nasr City",
      "Ain Shams",
      "Al Marj",
      "El Matareya",
      "Sheraton",
    ])
  ),
})

export const Delivery = ({
  _id,
  isSameDay = 0,
  type = DELIVERY_TYPES.PACKAGE_DELIVERY.code,
  cod,
} = {}) => ({
  _id: _id || faker.random.uuid(),
  pickupAddress: Address(),
  dropOffAddress:
    type === DELIVERY_TYPES.PACKAGE_DELIVERY.code
      ? Address({ isSameDay })
      : undefined,
  receiver: Reciever(),
  state: faker.helpers.randomize(
    Object.values(DELIVERY_STATES).map(({ code }) => code)
  ),
  type: faker.helpers.randomize(
    Object.values(DELIVERY_TYPES).map(({ code }) => code)
  ),
  trackingNumber: faker.random.uuid(),
  notes: optional(faker.lorem.paragraph()),
  cod: cod || optional(faker.commerce.price()), // Cash On Delivery amount
  businessReference: optional(faker.random.uuid()),
})

const SUCCESS_MESSAGE = "Ok"
const api_mocks = [
  {
    method: "post",
    url: /\/deliveries/,
    response: (req, res) => {
      const { _id } = Delivery(req.data)
      return [
        200,
        {
          _id,
          message: SUCCESS_MESSAGE,
        },
      ]
    },
  },
  {
    method: "get",
    url: /\/deliveries/,
    response: (req, res) => {
      const perPage = req.params.perPage || 10
      const deliveries = Array.from(new Array(perPage)).map(_ => Delivery())
      return [200, deliveries]
    },
  },
  {
    method: "get",
    url: /\/deliveries\/([\d\w]+)/,
    response: (req, res) => {
      const _id = req.url.match(/\/deliveries\/([\d\w]+)/)[1]
      // const filter = req.params // specify which fields return if not present return all
      const delivery = Delivery({ ...req.data, _id })
      return [200, delivery]
    },
  },
  {
    method: "PATCH",
    url: /\/deliveries\/[\d\w]+/,
    response: (req, res) => {
      const _id = req.url.match(/\/deliveries\/([\d\w]+)/)[1]
      return [
        200,
        {
          _id,
          message: SUCCESS_MESSAGE,
        },
      ]
    },
  },
  {
    method: "delete",
    url: /\/deliveries\/[\d\w]+/,
    response: (req, res) => {
      const _id = req.url.match(/\/deliveries\/([\d\w]+)/)[1]
      return [
        200,
        {
          _id,
          message: SUCCESS_MESSAGE,
        },
      ]
    },
  },
  {
    method: "get",
    url: /\/deliveries\/can_update_delivery\/[\d\w]+/,
    response: (req, res) => {
      return [
        200,
        {
          canUpdate: false,
          reason: "Delivery has been made",
        },
      ]
    },
  },
]
export default api_mocks
