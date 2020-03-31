const mysql = require("mysql");
const config = require("./config.js")[process.env.ENVIRONMENT];

function testDatabaseConnection() {
    return new Promise(resolve => {
        db.connect((err) => {
            if (err) {
                console.log("Could not connected to database.");
                resolve(false);
                return;
            }

            console.log("Successfully connected to database.");
            resolve(true);
        });
    });
}

async function connectToDatabase() {
    return await testDatabaseConnection();
}

/**
 * Run a SQL query on the current database.
 * @param {String} sql The SQL query to run on the current database.
 * @param {Object} options Apparently this is how you overload methods in JavaScript? 🤔
 */
function query(sql, options) {
    const log = (result) => {
        if (!options["actionOutput"] || !options["description"]) {
            return;
        }

        const symbol = result ? "✔" : "❌";
        if (options["description"]) {
            console.log(`${symbol} : "${options["description"]}"`);
        }
    };

    return new Promise(resolve => {
        db.query(sql, err => {
            if (err) {
                log(false);
                throw err;
            }

            log(true);
            resolve(true);
        });
    });
}

const db = mysql.createConnection(config.connection);
const connected = connectToDatabase();

module.exports = {
    connected,
    query
};