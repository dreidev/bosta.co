// import { startTunnel, closeTunnel } from "./helper/localtunnel"
// import { startServer, closeServer, router } from "./helper/server"

import request from "supertest"

import BOSTA_CONFIG from "../../config"
import { BostaRouter } from "../express_router"
import { app, router } from "./helper/app"

const _id = "someid"

describe("configure router", () => {
  router.use(
    BostaRouter({
      notificationEndpoint: BOSTA_CONFIG.notification_endpoint,
      onNotification(req) {
        expect(req.body).toHaveProperty("_id", _id)
      },
    })
  )

  test("router should trigger 401 on notification hook if hmac does not match", () => {
    return request(app)
      .post(BOSTA_CONFIG.notification_endpoint)
      .send({ _id })
      .expect(200)
  })
})
