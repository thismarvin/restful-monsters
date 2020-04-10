const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];
const log = require("../utilities.js").log;
const options = {
    debug: require("../utilities.js").debugArgPresent
};

async function rollback() {
    const dropTable = tableName => {
        return `DROP TABLE IF EXISTS ${tableName};`;
    }

    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(dropTable("followers"), "Drop comments Table.");
        jocose.enqueue(dropTable("entity_synopses"), "Drop entity_synopses Table.");
        jocose.enqueue(dropTable("level_activity"), "Drop level_activity Table.");
        jocose.enqueue(dropTable("level_synopses"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_comments"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_feedback"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_collection_levels"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_collection_synopses"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_collection_comments"), "Drop level_synopses Table.");
        jocose.enqueue(dropTable("level_collection_feedback"), "Drop level_synopses Table.");
        await jocose.run();

        jocose.enqueue(dropTable("entities"), "Drop entities Table.");
        jocose.enqueue(dropTable("entity_categories"), "Drop entity_categories Table.");
        jocose.enqueue(dropTable("levels"), "Drop entity_categories Table.");
        jocose.enqueue(dropTable("level_collections"), "Drop entity_categories Table.");
        jocose.enqueue(dropTable("level_categories"), "Drop level_categories Table.");
        jocose.enqueue(dropTable("feedback"), "Drop level_categories Table.");
        jocose.enqueue(dropTable("comments"), "Drop levels Table.");
        await jocose.run();

        jocose.enqueue(dropTable("users"), "Drop users Table.");
        await jocose.run();

        if (jocose.debugModeEnabled) {
            console.log();
        }

        log("✔ : Successfully rollbacked database.", "green");
        process.exit();
    } catch (error) {
        if (jocose.debugModeEnabled) {
            console.log();
        }

        switch (error.code) {
            case "ECONNREFUSED":
                log("✖ : Database rollback failed, could not connect to database.", "red");
                process.exit();

            default:
                log(`✖ : Something went wrong! ${error.code}`, "red");
                process.exit();
        }
    }
}

rollback();