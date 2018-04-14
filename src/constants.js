export const STAGE_BASE_URL = "http://staging-api.bosta.co/api/v0"
export const BASE_URL = "http://api.bosta.co/api/v0"

export const DELIVERY_STATES = {
  PENDING: { value: "Pending", code: 10 }, // Delivery created and we will start working on it asap.
  IN_PROGRESS: { value: "In progress", code: 15 }, // Our operation team started working on your delivery.
  ON_ROUTE: { value: "Delivery on route", code: 16 }, // You delivery has been assigned for star.
  PICKING_UP: { value: "Picking up", code: 20 }, // Bosta Star is on his way to pick the delivery.
  PICKING_UP_FROM_WAREHOUSE: { value: "Picking up from warehouse", code: 21 }, // Bosta star is on his way to pick the scheduled delivery from warehouse.
  ARRIVED_AT_WAREHOUSE: { value: "Arrived at warehouse", code: 22 }, // Bosta star has arrived to warehouse with your scheduled delivery.
  ARRIVED_AT_BUSINESS: { value: "Arrived at business", code: 25 }, // Bosta star arrived at pickup location.
  PICKED_UP: { value: "Picked up", code: 30 }, // Bosta star is already picked up your delivery.
  DELIVERING: { value: "Delivering", code: 35 }, // Bosta star is on his way to deliver your package to its destination.
  DELIVERING_TO_WAREHOUSE: { value: "Delivering to warehouse", code: 36 }, // Bosta star is on his way to warehouse after picking up the scheduled delivery from you.
  ARRIVED_AT_CUSTOMER: { value: "Arrived at customer", code: 40 }, // Bosta star arrived to the receiver.
  DELIVERED: { value: "Delivered", code: 45 }, // Delivery has been delivered.
  CANCELED: { value: "Canceled", code: 50 }, // Delivery has been cancelled.
  FAILED: { value: "Failed", code: 55 }, // An exception happened to the delivery (e.g. Customer not answering his phone).
  PICKUP_FAILED: { value: "Failed", code: 80 }, // An exception happened to the delivery (e.g. Customer not answering his phone).
}

export const DELIVERY_TYPES = {
  PACKAGE_DELIVERY: { value: "Package Delivery", code: 10 }, // Delivery that has two endpoints (pickup and dropoff)
  CASH_COLLECTION: { value: "Cash Collection", code: 15 },
}

export const CITIES = {
  CAIRO: { value: "Cairo", code: "EG-01" },
  ALEXANDRIA: { value: "Alexandria", code: "EG-02" },
}

export const AREAS = {
  Cairo: {
    _id: "TcS2HcvPoujEHpctW",
    name: "Cairo",
    zones: {
      "New Cities": {
        _id: "nDmPGDNxERXg8Wa7F",
        name: "New Cities",
        districts: ["Obour", "El Shorouk", "Madinaty", "Future City"],
      },
      "New Cairo": {
        _id: "8fJB8SW6YhtYX2YKE",
        name: "New Cairo",
        districts: [
          "1st Settlement",
          "3rd Settlement",
          "5th Settlement",
          "Al Rehab",
          "Al Narges",
          "El Yasmeen",
          "El-Banafseg",
          "Katameya",
        ],
      },
      Cairo: {
        _id: "yn2X6MMsHSPTn8igP",
        name: "Cairo",
        districts: [
          "Masr Al Jadidah",
          "Heliopolis",
          "Nasr City",
          "Ain Shams",
          "Al Marj",
          "El Matareya",
          "Sheraton",
          "El-Zaytoun",
          "Gesr elswes",
          "Al Wayli",
          "El Qobbah",
          "Abbassia",
          "Shubra El Kheima",
          "Shubra",
          "Downtown Cairo",
          "Abdeen",
          "Bulaq",
          "Road El Farag",
          "Masr El Kadema",
          "Garden City",
          "Al Manial",
          "Zamalek",
        ],
      },
      "Maadi & Muqattam": {
        _id: "ud37sDCqLasy3Bvkw",
        name: "Maadi & Muqattam",
        districts: [
          "Al Muqattam",
          "Uptown Cairo",
          "El-Hadaba El-Wosta",
          "Maadi",
          "Helwan",
        ],
      },
      "Giza & Haram": {
        _id: "NdNkCr6BD6tENBJCn",
        name: "Giza & Haram",
        districts: [
          "Giza",
          "Agouza",
          "Faisal",
          "Haram",
          "Dokki",
          "Mohandeseen",
          "Imbaba",
          "Ard El Lewa",
          "Mit Akaba",
        ],
      },
      October: {
        _id: "sTYQ7QxGTyPES28JA",
        name: "October",
        districts: [
          "Pyramids Gardens (Hadayek al-Ahram)",
          "Dream Land",
          "New Giza",
          "6th of October City",
          "Sheikh Zayed City",
          "Smart Village",
          "Abu Rawash",
        ],
      },
    },
  },
  Alexandria: {
    _id: "S8TSdbKTFYZJvu9w4",
    name: "Alexandria",
    zones: {
      Roshdy: {
        _id: "KqLmAYYGNcXsuZjxb",
        name: "Roshdy",
        districts: ["Roshdy"],
      },
    },
  },
}
