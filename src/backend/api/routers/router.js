const express = require("express");
const router = express.Router();

const rootLogin = require("./routes/login");
const rootHome = require("./routes/home")

router.use("/", rootLogin);
router.use("/home", rootHome)

module.exports = router;
