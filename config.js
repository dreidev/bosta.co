require("dotenv").config()
module.exports = {
  API_KEY: process.env.BOSTA_API_KEY,
  notification_endpoint: process.env.BOSTA_NOTIFICATION_ENDPOINT,
}
