const mysql = require("mysql");

const colorCodes = {
    "white": "\x1b[37m",
    "green": "\x1b[32m",
    "red": "\x1b[31m"
}

function log(message, color) {
    let colorCode = colorCodes.white;

    if (color && colorCodes[color]) {
        colorCode = colorCodes[color];
    }

    console.log(`${colorCode}${message}${"\x1b[0m"}`);
}

/**
 * Represents a query to a database.
 * @private
 */
class Query {
    /**
     * Creates an object that represents a query to a database.
     * @param {String} sql 
     * @param {String} description 
     */
    constructor(sql, description) {
        this.sql = sql;
        this.description = description;
    }
}

/**
 * Provides additional utilities for interfacing with a MySQL database.
 */
class Jocose {
    /**
     * Creates an object that provides additional utilities for interfacing with a MySQL database.
     * @param {JSON} config Represents the credentials to connect to a MySQL database.
     * @param {JSON} options An optional parameter that provides additional information used to enable limited overloading.
     */
    constructor(config, options) {
        if (!config) {
            throw new Error("Expected config parameter.");
        }

        if (!config["host"] || !config["port"] || !config["user"] || !config["password"] || !config["database"]) {
            throw new Error("Invalid config syntax.");
        }

        this.pool = mysql.createPool(config);
        this.debugModeEnabled = false;
        this.queryQueue = [];

        if (options) {
            this.debugModeEnabled = options["debug"] || options["debugMode"];
        }
    }

    /**
     * Enables debug mode.
     * @param {Boolean} enabled Whether or not debug mode should be enabled.
     */
    enableDebugMode(enabled) {
        this.debugModeEnabled = enabled ? enabled : true;
    }

    /**
     * Runs a SQL query on the current database and returns the outcome as a Promise.
     * @param {String} sql The SQL query to run on the current database.
     * @param {String} description An optional parameter that identifies the current query when "debugMode" is enabled.
     */
    async query(sql, description) {
        const showActionOutput = (result) => {
            if (this.debugModeEnabled && description) {
                const symbol = result ? "✔" : "✖";
                log(`${symbol} : "${description}"`, result ? "green" : "red");
            }
        };

        return new Promise((resolve, reject) => {
            this.pool.query(sql, (error, results) => {
                if (error) {
                    showActionOutput(false);
                    reject(error);

                } else {
                    showActionOutput(true);
                    resolve(results);
                }
            });
        });
    }

    /**
     * Adds a SQL query to the end of the query queue.
     * @param {String} sql The SQL query to run on the current database.
     * @param {String} description An optional parameter that identifies the current query when "debugMode" is enabled via options.
     */
    enqueue(sql, description) {
        this.queryQueue.push(new Query(sql, description));
    }

    /**
     * Executes all queued queries concurrently and returns the outcome as a Promise.
     */
    async run() {
        const results = await Promise.all(
            this.queryQueue.map(command => {
                return this.query(command.sql, command.description);
            })
        );

        this.queryQueue = [];

        return results;
    }
}

module.exports = Jocose;