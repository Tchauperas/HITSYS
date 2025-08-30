const knex = require("knex");
const dotenv = require("dotenv").config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.HOST,
    port: process.env.MYSQL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
});

module.exports = db;