const knex = require("knex")
require("dotenv").config()

const conn = {
    host: process.env.HOST,
    port: process.env.MYSQL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}

const connDev = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    database: "hitsys"
}

const db = knex({
    client: "mysql2",
    connection: connDev
})

module.exports = db
