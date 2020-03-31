const db = require("./setup.js");
const actionOutputEnabled = require("../utilities.js").actionOutputEnabled;

const options = [
    {
        actionOutput: actionOutputEnabled,
        description: "Create users Table"
    },
    {
        actionOutput: actionOutputEnabled,
        description: "Create levels Table"
    },
    {
        actionOutput: actionOutputEnabled,
        description: "Create blocks Table"
    },
    {
        actionOutput: actionOutputEnabled,
        description: "Create user_levels Table"
    },
    {
        actionOutput: actionOutputEnabled,
        description: "Create level_data Table"
    }
];

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
id INT NOT NULL AUTO_INCREMENT,
login VARCHAR(32) NOT NULL UNIQUE,
PRIMARY KEY(id)
);
`;

const createLevelsTable = `
CREATE TABLE IF NOT EXISTS levels (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(32) NOT NULL,
description VARCHAR(64) DEFAULT "Have fun!",
play_count INT UNSIGNED NOT NULL DEFAULT 0,
completed_count INT UNSIGNED NOT NULL DEFAULT 0,
likes INT UNSIGNED NOT NULL DEFAULT 0,
dislikes INT UNSIGNED NOT NULL DEFAULT 0,
date_created DATE NOT NULL,
time_created TIME NOT NULL,
PRIMARY KEY(id)
);
`;

const createBlocksTable = `
CREATE TABLE IF NOT EXISTS blocks (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(16) NOT NULL UNIQUE,
PRIMARY KEY(id)
);
`;

const createUserLevelsTable = `
CREATE TABLE IF NOT EXISTS user_levels (
user_id INT NOT NULL,
level_id INT NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id),
FOREIGN KEY(level_id) REFERENCES levels(id)
);
`;

const createLevelDataTable = `
CREATE TABLE IF NOT EXISTS level_data (
level_id INT NOT NULL,
data JSON NOT NULL,
FOREIGN KEY(level_id) REFERENCES levels(id)
);  
`;

async function create() {
    const connected = await db.connected;
    if (!connected) {
        process.exit();
    }

    await Promise.all([
        db.query(createUsersTable, options[0]),
        db.query(createLevelsTable, options[1]),
        db.query(createBlocksTable, options[2])
    ]);

    await Promise.all([
        db.query(createUserLevelsTable, options[3]),
        db.query(createLevelDataTable, options[4])
    ]);

    console.log("Database creation complete.");
    process.exit();
}

create();