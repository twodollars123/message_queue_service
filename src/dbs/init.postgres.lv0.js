const { Client } = require("pg");

const dbConfig = require("../configs/postgre.config");

const client = new Client(dbConfig);

module.exports = client;
