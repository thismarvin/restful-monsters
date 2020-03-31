const db = require("./setup.js");
const actionOutputEnabled = require("../utilities.js").actionOutputEnabled;

const options = [
    {
        actionOutput: actionOutputEnabled,
        "description": "Drop user_levels Table"
    },
    {
        actionOutput: actionOutputEnabled,
        "description": "Drop level_data Table"
    },
    {
        actionOutput: actionOutputEnabled,
        "description": "Drop users Table"
    },
    {
        actionOutput: actionOutputEnabled,
        "description": "Drop levels Table"
    },
    {
        actionOutput: actionOutputEnabled,
        "description": "Drop blocks Table"
    }
];

async function revert() {
    const connected = await db.connected;
    if (!connected) {
        process.exit();
    }

    const dropTable = (tableName) => {
        return `DROP TABLE IF EXISTS ${tableName};`
    };

    await Promise.all([
        db.query(dropTable("user_levels"), options[0]),
        db.query(dropTable("level_data"), options[1]),
    ]);

    await Promise.all([
        db.query(dropTable("users"), options[2]),
        db.query(dropTable("levels"), options[3]),
        db.query(dropTable("blocks"), options[4])
    ]);

    console.log("Database rollback complete.");
    process.exit();
}

revert();