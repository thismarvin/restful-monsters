const mysql = require("mysql");

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
        this.db = mysql.createConnection(config);
        this.connected = false;
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
        this.debugModeEnabled = enabled;
    }

    /**
     * An asyncronous function that verifies the connection to the database.
     */
    async connect() {
        this.connected = await this.verifyConnection();
    }

    /**
     * Runs a SQL query on the current database and returns the outcome as a Promise.
     * @param {String} sql The SQL query to run on the current database.
     * @param {String} description An optional parameter that identifies the current query when "debugMode" is enabled.
     */
    query(sql, description) {
        const showActionOutput = (result) => {
            if (this.debugModeEnabled && description) {
                const symbol = result ? "✔" : "❌";
                console.log(`${symbol} : "${description}"`);
            }
        };

        return new Promise((resolve, reject) => {
            this.db.query(sql, (error, results) => {
                if (error) {
                    showActionOutput(false);
                    reject(error);
                }

                showActionOutput(true);
                resolve(results);
            });
        });
    }

    /**
     * Queues up a SQL query that can be executed in the future.
     * @param {String} sql The SQL query to run on the current database.
     * @param {String} description An optional parameter that identifies the current query when "debugMode" is enabled via options.
     */
    queue(sql, description) {
        this.queryQueue.push(new Query(sql, description));
    }

    /**
     * An asyncronous function that executes all queued queries concurrently.
     */
    async run() {
        await Promise.all(
            this.queryQueue.map(command => {
                return this.query(command.sql, command.description);
            })
        );

        this.queryQueue = [];
    }

    /**
     * Returns a Promise that checks whether or not the connection to the database is valid.
     * @private
     */
    verifyConnection() {
        return new Promise(resolve => {
            this.db.connect((err) => {
                if (err) {
                    if (this.debugModeEnabled) {
                        console.log("Could not connected to database.");
                    }
                    resolve(false);
                } else {
                    if (this.debugModeEnabled) {
                        console.log("Successfully connected to database.");
                    }
                    resolve(true);
                }
            });
        });
    }
}

module.exports = Jocose;