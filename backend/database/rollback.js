const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];
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
    await jocose.connect();

    jocose.queue(dropTable("user_levels"), "Drop user_levels Table.");
    jocose.queue(dropTable("level_data"), "Drop level_data Table.");
    jocose.queue(dropView("v_levels"), "Drop v_levels View.");
    jocose.queue(dropView("v_blocks"), "Drop v_blocks View.");
    await jocose.run();
    
    jocose.queue(dropTable("users"), "Drop users Table.");
    jocose.queue(dropTable("levels"), "Drop levels Table.");
    jocose.queue(dropTable("blocks"), "Drop blocks Table.");
    await jocose.run();

    console.log("Database rollback complete.");
    process.exit();
}

rollback();