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
    created_at TIMESTAMP NOT NULL,
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

const createFollowersTable = `
CREATE TABLE IF NOT EXISTS followers (
    user_id INT NOT NULL,
    follower_id INT NOT NULL,
    PRIMARY KEY(user_id, follower_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(follower_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createFeedbackTable = `
CREATE TABLE IF NOT EXISTS feedback (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    liked BOOL NOT NULL DEFAULT false,
    disliked BOOL NOT NULL DEFAULT false,
    flagged BOOL NOT NULL DEFAULT false,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createEntitySynopsesTable = `
CREATE TABLE IF NOT EXISTS entity_synopses (
    entity_id INT NOT NULL,
    entity_category_id INT NOT NULL,
    PRIMARY KEY(entity_id, entity_category_id),
    FOREIGN KEY(entity_id) REFERENCES entities(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(entity_category_id) REFERENCES entity_categories(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelsTable = `
CREATE TABLE IF NOT EXISTS levels (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(32) NOT NULL,
    description VARCHAR(64) NOT NULL DEFAULT "",
    data JSON NOT NULL,
    times_played INT UNSIGNED NOT NULL DEFAULT 0,
    times_completed INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createLevelCollectionsTable = `
CREATE TABLE IF NOT EXISTS level_collections (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(32) NOT NULL,
    description VARCHAR(64) NOT NULL DEFAULT "",
    data JSON NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;

const createLevelActivityTable = `
CREATE TABLE IF NOT EXISTS level_activity (
    level_id INT NOT NULL,
    user_id INT NOT NULL,
    completed BOOL NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY(level_id, user_id),
    FOREIGN KEY(level_id) REFERENCES levels(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelSynopsesTable = `
CREATE TABLE IF NOT EXISTS level_synopses (
    level_id INT NOT NULL,
    level_category_id INT NOT NULL,
    PRIMARY KEY(level_id, level_category_id),
    FOREIGN KEY(level_id) REFERENCES levels(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(level_category_id) REFERENCES level_categories(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelFeedbackTable = `
CREATE TABLE IF NOT EXISTS level_feedback (
    level_id INT NOT NULL,
    feedback_id INT NOT NULL,
    PRIMARY KEY(level_id, feedback_id),
    FOREIGN KEY(level_id) REFERENCES levels(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(feedback_id) REFERENCES feedback(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelCommentsTable = `
CREATE TABLE IF NOT EXISTS level_comments (
    level_id INT NOT NULL,
    comment_id INT NOT NULL,
    PRIMARY KEY(level_id, comment_id),
    FOREIGN KEY(level_id) REFERENCES levels(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createLevelCollectionLevelsTable = `
CREATE TABLE IF NOT EXISTS level_collection_levels (
    level_collection_id INT NOT NULL,
    level_id INT NOT NULL,
    PRIMARY KEY (level_collection_id, level_id),
    FOREIGN KEY(level_collection_id) REFERENCES level_collections(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(level_id) REFERENCES levels(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;
const createLevelCollectionSynopsesTable = `
CREATE TABLE IF NOT EXISTS level_collection_synopses (
    level_collection_id INT NOT NULL,
    level_category_id INT NOT NULL,
    PRIMARY KEY(level_collection_id, level_category_id),
    FOREIGN KEY(level_collection_id) REFERENCES level_collections(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(level_category_id) REFERENCES level_categories(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelCollectionFeedbackTable = `
CREATE TABLE IF NOT EXISTS level_collection_feedback (
    level_collection_id INT NOT NULL,
    feedback_id INT NOT NULL,
    PRIMARY KEY(level_collection_id, feedback_id),
    FOREIGN KEY(level_collection_id) REFERENCES level_collections(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(feedback_id) REFERENCES feedback(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
`;
const createLevelCollectionCommentsTable = `
CREATE TABLE IF NOT EXISTS level_collection_comments (
    level_collection_id INT NOT NULL,
    comment_id INT NOT NULL,
    PRIMARY KEY(level_collection_id, comment_id),
    FOREIGN KEY(level_collection_id) REFERENCES level_collections(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
`;

async function create() {
    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(createUsersTable, "Create users Table.");
        jocose.enqueue(createEntitiesTable, "Create entities Table.");
        jocose.enqueue(createEntityCategoriesTable, "Create entity_categories Table.");
        jocose.enqueue(createLevelCategoriesTable, "Create level_categories Table.");
        await jocose.run();

        jocose.enqueue(createFollowersTable, "Create followers Table.");
        jocose.enqueue(createFeedbackTable, "Create feedback Table.");
        jocose.enqueue(createCommentsTable, "Create comments Table.");
        jocose.enqueue(createEntitySynopsesTable, "Create entity_synopses Table.");
        jocose.enqueue(createLevelsTable, "Create levels Table.");
        jocose.enqueue(createLevelCollectionsTable, "Create level_collection Table.");
        await jocose.run();

        jocose.enqueue(createLevelActivityTable, "Create level_activity Table.");
        jocose.enqueue(createLevelSynopsesTable, "Create level_synopses Table.");
        jocose.enqueue(createLevelFeedbackTable, "Create level_feedback Table.");
        jocose.enqueue(createLevelCommentsTable, "Create level_comments Table.");
        jocose.enqueue(createLevelCollectionLevelsTable, "Create level_collection_levels Table.");
        jocose.enqueue(createLevelCollectionSynopsesTable, "Create level_collection_synopses Table.");
        jocose.enqueue(createLevelCollectionFeedbackTable, "Create level_collection_feedback Table.");
        jocose.enqueue(createLevelCollectionCommentsTable, "Create level_collection_comments Table.");
        await jocose.run();

        if (jocose.debugModeEnabled) {
            console.log();
        }

        log("✔ : Successfully created database.", "green");
        process.exit();
    } catch (error) {
        if (jocose.debugModeEnabled) {
            console.log();
        }

        switch (error.code) {
            case "ECONNREFUSED":
                log("✖ : Database creation failed, could not connect to database.", "red");
                process.exit();

            default:
                log(`✖ : Something went wrong! ${error.code}`, "red");
                process.exit();
        }
    }
}

create();