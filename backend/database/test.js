const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];
const options = {
    debug: require("../utilities.js").debugArgPresent
};

async function test() {
    const jocose = new Jocose(config, options);

    try {
        jocose.enqueue(`SELECT * FROM levels;`);
        jocose.enqueue(`SELECT * FROM users;`);
        jocose.enqueue(`SELECT * FROM blocks;`);

        const results = await jocose.run();

        console.log("USERS:");
        console.log(results[0].length);
        console.log("LEVELS:");
        console.log(results[1].length);
        console.log("BLOCKS:");
        console.log(results[2].length);
    } catch (error) {
        console.log(error.code);
    }

    console.log("DONE");
    process.exit();
}

test();