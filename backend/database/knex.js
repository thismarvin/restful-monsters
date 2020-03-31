const config = require("./config.js")[process.env.ENVIRONMENT];

const db = require("knex")(config);

module.exports = db;