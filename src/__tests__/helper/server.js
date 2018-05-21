const { server, router } = require("./app")
const { BostaRouter } = require("../../express_router")
router.use(
  BostaRouter({
    onNotification(req) {
      if (!process.env.CI) {
        console.log("Notification", req.body)
      }
    },
  })
)

server.listen(process.env.PORT, () => {
  console.log(`started server on port ${process.env.PORT}`)
  process.send && process.send("started")
})
