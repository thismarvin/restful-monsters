require("dotenv").config();

const db = require("knex")({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_DATABASE_HOST,
        port: process.env.MYSQL_DATABASE_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
});

module.exports = db;