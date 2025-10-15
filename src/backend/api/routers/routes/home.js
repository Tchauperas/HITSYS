const express = require("express");
const path = require("path");
const router = express.Router();

const rendererPath = path.join(__dirname, "../../../../../renderer");

router.use(express.static(rendererPath));

router.get("/", (req, res) => {
  res.sendFile(path.join(rendererPath, "index.html"));
});

module.exports = router;
