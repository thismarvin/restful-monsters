const Jocose = require("./jocose.js");
const config = require("./config.js").getConfig()["connection"];

const jocose = new Jocose(config);

module.exports = {
    jocose
}