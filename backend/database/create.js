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
password VARCHAR(127) NOT NULL,
created_on TIMESTAMP NOT NULL,
PRIMARY KEY(id)
);
`;
const createEntitiesTable = `
CREATE TABLE IF NOT EXISTS entities (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(16) NOT NULL UNIQUE,
PRIMARY KEY(id)
);
`;
const createEntityCategoriesTable = `
CREATE TABLE IF NOT EXISTS entity_categories (
id INT NOT NULL AUTO_INCREMENT,
category VARCHAR(16) NOT NULL UNIQUE,
PRIMARY KEY(id)
);
`;
const createLevelCategoriesTable = `
CREATE TABLE IF NOT EXISTS level_categories (
id INT NOT NULL AUTO_INCREMENT,
category VARCHAR(16) NOT NULL UNIQUE,
PRIMARY KEY(id)
);
`;
const createLevelsTable = `
CREATE TABLE IF NOT EXISTS levels (
id INT NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL,
name VARCHAR(32) NOT NULL,
description VARCHAR(64) DEFAULT "Have fun!",
data JSON NOT NULL,
times_played INT UNSIGNED NOT NULL DEFAULT 0,
times_completed INT UNSIGNED NOT NULL DEFAULT 0,
likes INT UNSIGNED NOT NULL DEFAULT 0,
dislikes INT UNSIGNED NOT NULL DEFAULT 0,
created_on TIMESTAMP NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
const createEntitySynopsesTable = `
CREATE TABLE IF NOT EXISTS entity_synopses (
entity_id INT NOT NULL,
entity_category_id INT NOT NULL,
FOREIGN KEY(entity_id) REFERENCES entities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
FOREIGN KEY(entity_category_id) REFERENCES entity_categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
id INT NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL,
level_id INT NOT NULL,
text TEXT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
FOREIGN KEY(level_id) REFERENCES levels(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
const createLevelSynopsesTable = `
CREATE TABLE IF NOT EXISTS level_synopses (
level_id INT NOT NULL,
level_category_id INT NOT NULL,
FOREIGN KEY(level_id) REFERENCES levels(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
FOREIGN KEY(level_category_id) REFERENCES level_categories(id)
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
levels.description,
levels.likes,
levels.dislikes,
levels.times_played,
IFNULL(ROUND((levels.times_completed / levels.times_played * 100), 2), 0) AS perctange_complete,
levels.created_on
FROM levels
JOIN users
ON  levels.user_id = users.id
ORDER BY users.login;
`;

async function create() {
    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(createUsersTable, "Create users Table.");
        jocose.enqueue(createEntitiesTable, "Create entities Table.");
        jocose.enqueue(createEntityCategoriesTable, "Create entity_categories Table.");
        jocose.enqueue(createLevelCategoriesTable, "Create level_categories Table.");
        await jocose.run();

        jocose.enqueue(createLevelsTable, "Create levels Table.");
        jocose.enqueue(createEntitySynopsesTable, "Create entity_synopses Table.");
        await jocose.run();

        jocose.enqueue(createCommentsTable, "Create comments Table.");
        jocose.enqueue(createLevelSynopsesTable, "Create level_synopses View.");
        jocose.enqueue(createLevelsView, "Create v_levels View.");
        await jocose.run();

        if (jocose.debugModeEnabled) {
            console.log();
        }

        log("✔ : Successfully created database.", "green");
        process.exit();
    } catch (error) {
        switch (error.code) {
            case "ECONNREFUSED":
                log("✖ : Database creation failed, could not connect to database.", "red");
                process.exit();

            default:
                log("✖ : Something went wrong and I don't even know what!", "red");
                process.exit();
        }
    }
}

create();