const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/perf_usuarios");
});

module.exports = router;
