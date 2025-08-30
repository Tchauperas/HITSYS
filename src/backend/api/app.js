const express = require("express");
const router = require("./routes/router");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

module.exports = app;