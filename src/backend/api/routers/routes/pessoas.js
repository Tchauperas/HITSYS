const express = require("express")
const router = express.Router()
const pessoa = require("../../controllers/PessoaController")

router.get("/", (req, res) => {
    res.redirect("http://localhost:5173/pessoas")
})

module.exports = router