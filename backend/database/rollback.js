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

    const dropView = viewName => {
        return `DROP VIEW IF EXISTS ${viewName};`;
    }

    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(dropTable("comments"), "Drop comments Table.");
        jocose.enqueue(dropTable("entity_synopses"), "Drop entity_synopses Table.");
        jocose.enqueue(dropTable("level_synopses"), "Drop level_synopses Table.");
        jocose.enqueue(dropView("v_levels"), "Drop v_levels View.");
        await jocose.run();

        jocose.enqueue(dropTable("entity_categories"), "Drop entity_categories Table.");
        jocose.enqueue(dropTable("level_categories"), "Drop level_categories Table.");
        jocose.enqueue(dropTable("entities"), "Drop entities Table.");
        jocose.enqueue(dropTable("levels"), "Drop levels Table.");
        await jocose.run();

        jocose.enqueue(dropTable("users"), "Drop users Table.");
        await jocose.run();

        if (jocose.debugModeEnabled) {
            console.log();
        }

        log("✔ : Successfully rollbacked database.", "green");
        process.exit();
    } catch {
        switch (error.code) {
            case "ECONNREFUSED":
                log("✖ : Database rollback failed, could not connect to database.", "red");
                process.exit();

            default:
                log("✖ : Something went wrong and I don't even know what!", "red");
                process.exit();
        }
    }
}

rollback();