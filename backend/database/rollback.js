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
    
    const connected = await jocose.connect();

    if (!connected) {
        log("✖ : Database rollback failed, could not connect to database.", "red");
        process.exit();
    }

    jocose.enqueue(dropTable("user_levels"), "Drop user_levels Table.");
    jocose.enqueue(dropTable("level_data"), "Drop level_data Table.");
    jocose.enqueue(dropView("v_levels"), "Drop v_levels View.");
    jocose.enqueue(dropView("v_blocks"), "Drop v_blocks View.");
    await jocose.run();
    
    jocose.enqueue(dropTable("users"), "Drop users Table.");
    jocose.enqueue(dropTable("levels"), "Drop levels Table.");
    jocose.enqueue(dropTable("blocks"), "Drop blocks Table.");
    await jocose.run();

    if (jocose.debugModeEnabled) {
        console.log();
    }

    log("✔ : Successfully rollbacked database.", "green");
    process.exit();
}

rollback();