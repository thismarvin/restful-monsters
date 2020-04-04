const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];
const log = require("../utilities.js").log;
const options = {
    debug: require("../utilities.js").debugArgPresent
};

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
level_id INT NOT NULL UNIQUE,
FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
FOREIGN KEY(level_id) REFERENCES levels(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
const createLevelDataTable = `
CREATE TABLE IF NOT EXISTS level_data (
level_id INT NOT NULL UNIQUE,
data JSON NOT NULL,
FOREIGN KEY(level_id) REFERENCES levels(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
const createLevelsView = `
CREATE OR REPLACE VIEW v_levels AS
SELECT
levels.id,
users.login AS creator,
levels.name,
levels.likes,
levels.play_count,
IFNULL(ROUND((levels.completed_count / levels.play_count * 100), 2), 0) AS perctange_complete,
(TIMESTAMP(levels.date_created, levels.time_created)) as timestamp
FROM user_levels
JOIN levels
ON  user_levels.level_id = levels.id
JOIN  users
ON user_levels.user_id = users.id
ORDER BY users.login;
`;
const createBlockView = `
CREATE OR REPLACE VIEW v_blocks AS
SELECT 
id,
name,
(HEX(id)) AS symbol
FROM blocks
ORDER BY id ASC;
`;

async function create() {
    const jocose = new Jocose(config, options);
    
    const connected = await jocose.connect();

    if (!connected) {
        log("✖ : Database creation failed, could not connect to database.", "red");
        process.exit();        
    }

    jocose.enqueue(createUsersTable, "Create users Table.");
    jocose.enqueue(createLevelsTable, "Create levels Table.");
    jocose.enqueue(createBlocksTable, "Create blocks Table.");
    await jocose.run();

    jocose.enqueue(createUserLevelsTable, "Create user_levels Table.");
    jocose.enqueue(createLevelDataTable, "Create level_data Table.");
    await jocose.run();

    jocose.enqueue(createLevelsView, "Create v_levels View.");
    jocose.enqueue(createBlockView, "Create v_blocks View.");
    await jocose.run();

    if (jocose.debugModeEnabled) {
        console.log();
    }

    log("✔ : Successfully created database.", "green");
    process.exit();
}

create();