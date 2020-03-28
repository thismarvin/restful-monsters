require("dotenv").config();
const config = require("../../knexfile.js")[process.env.ENVIRONMENT];

const db = require("knex")(config);

function verifyConnection() {
    db("users").select("*").then(() => {
        console.log("Successfully connected to database.");
    })
    .catch(err => {
        console.log(`Could not connect to database. Error: ${err.code}`);
    });
}

verifyConnection();

module.exports = db;