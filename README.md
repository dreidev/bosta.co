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
module.exports = {
  API_KEY: process.env.BOSTA_API_KEY || "-----------------"
}
```

Import the bosta.co instance and configure it

```js
import Bosta from "bosta.co"
// or in node < 10 you can
// const { Bosta } = require("bosta.co")
// const Bosta = require("bosta.co").default

Bosta.config(BOSTA_CONFIG)

//... later in your code

await Bosta.deliver({})

await Bosta.collect({})
```
 
See tests for the rest of the available functions.

This package has partial coverage of the bosta API requesting cash on delivery and cash collection.

The package is maintianed by DREIDEV and is not an offical bosta.co package

Licence MIT
