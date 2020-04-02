const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];

let jocose;

async function setup() {
    jocose = new Jocose(config);
    await jocose.connect();
}

setup();

module.exports = {
    jocose
}