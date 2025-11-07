const express = require("express")
const router = require("./routers/router")
const app = express()
const cors = require("cors")

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/", router)

module.exports = app
