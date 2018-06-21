# Bosta.co

A Package for managing integration with the bosta.co courier and cash on delivery provided by bost.co for lack of an official one.

[![Build Status](https://travis-ci.org/dreidev/bosta.co.png?branch=master)](https://travis-ci.org/dreidev/bosta.co) [![Coverage Status](https://coveralls.io/repos/github/dreidev/bosta.co/badge.svg?branch=master)](https://coveralls.io/github/dreidev/bosta.co?branch=master) [![NSP Status](https://nodesecurity.io/orgs/dreidev/projects/7c551c3c-8957-4bcd-b0f5-9ddc5e9173bf/badge)](https://nodesecurity.io/orgs/dreidev/projects/7c551c3c-8957-4bcd-b0f5-9ddc5e9173bf)

## Getting Started

```sh
npm install bosta.co
```

Include your paymob accept credentials in a gitingnored `.env` or configuration file

```js
// config.js
require("dotenv").config()
module.exports = {
  API_KEY: process.env.BOSTA_API_KEY,
  notification_endpoint: process.env.BOSTA_NOTIFICATION_ENDPOINT,
}

```

Import the bosta.co instance and configure it

```js
import Bosta, { DELIVERY_STATES, DELIVERY_TYPES, CITIES } from "bosta.co"
// or in node < 10 you can
// const { Bosta } = require("bosta.co")
// const Bosta = require("bosta.co").default

//... later in your code
/**
requestDelivery({
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
   *  webhookUrl?: String, // a url that will recieve a wehookStateUpdate post request
   * })
   * 
   */
await Bosta.requestDelivery({
  apiKey: process.env.BOSTA_API_KEY, // this is the default
  type: DELIVERY_TYPES.CASH_COLLECTION.code,
  address: "7 Almaza square, Heliopolis, Cairo",
  amount: 40,
  city: CITIES.CAIRO.code,
  name: "Amr Draz",
  phone: "+200201020202",
})

await Bosta.collect({...}) // same as requestDelivery but sets type to CASH_COLLECTION,
await Bosta.deliver({...}) // same as requestDelivery but sets type to PACAKGE_DELIVERY,

```

### webhook

Package includes a router and middelware functions to handel webhooks

Bosta does not include an hamc or any secret to authenticate the webhook, but, since each webhook is assocaited with the delivery request, you can set an extra parameter in the url as a secret to be validated

```js
// app.js
const express = require("express")
const { BostaRouter } = require("accept-admin")
// or
// const { BostaRouter } = require("accept-admin/lib/express_router")

const app = express()

app.use(BostaRouter({
  notificationEndpoint: '/bosta/webhook/:secret', // default
  onNotification(req, res) {
    // validate req.params.secret is what you expect either from the model or a hash on your end
    if (req.params.secret===req.body._id) {
      console.log("Notification", req.body)
    }
  },
}))
```

and when making a request you simply make sure to include it in the webhook

```js
await Bosta.requestDelivery({
  apiKey: process.env.BOSTA_API_KEY, // this is the default
  ...,
  webHook: "http:/.../supersecrethash"
})
```

otherwise you can just leave the notificationEndpoint url unprotected `/bosta/webhook`

 
See tests for the rest of the available functions.

This package has partial coverage of the bosta API requesting cash on delivery and cash collection.

The package is maintianed by [DREIDEV](https://dreidev.com) and is not an offical bosta.co package

Licence MIT
