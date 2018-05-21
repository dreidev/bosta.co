const { Router } = require("express")

const DEFAULT_NOTIFICATION_ENDPOINT = `/bosta/webhook`

exports.DEFAULT_NOTIFICATION_ENDPOINT = DEFAULT_NOTIFICATION_ENDPOINT

function ConfigureBostaRouter({
  onNotification,
  notificationEndpoint = DEFAULT_NOTIFICATION_ENDPOINT,
}) {
  const router = Router()

  router.post(notificationEndpoint, hookWrapper(onNotification))

  return router
}

const DEFAULT_ACTION = async () => {}

function hookWrapper(customAction = DEFAULT_ACTION) {
  return async function(req, res, next) {
    try {
      const response = await customAction(req, res)
      if (!res.headersSent) {
        res.status(200).send(response)
      }
    } catch (error) {
      next(error)
    }
  }
}

exports.BostaRouter = ConfigureBostaRouter

exports.hookWrapper = hookWrapper
