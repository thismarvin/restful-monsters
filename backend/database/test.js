const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];
const options = {
    debug: require("../utilities.js").debugArgPresent
};
const errors = require("../routes/errors.js");

async function test() {
    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(`SELECT * FROM v_levels;`);
        jocose.enqueue(`SELECT * FROM users;`);
        jocose.enqueue(`SELECT * FROM blocks;`);

        const results = await jocose.run();

        console.log(`Total Users: ${results[0].length}`);
        console.log(`Total Levels: ${results[1].length}`);
        console.log(`Total Blocks: ${results[2].length}`);
    } catch (error) {

        switch (error.code) {
            case "ECONNREFUSED":
                console.log("Could not connect to server");
                break;

            default:
                console.log(`${error}`);
                break;
        }
    }

    console.log("DONE");
    process.exit();
}

test();