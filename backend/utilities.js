let actionOutputEnabled = false;
process.argv.forEach((val) => {
    if (val.toLowerCase() === "showactionoutput") {
        actionOutputEnabled = true;
    }
});

module.exports = {
    actionOutputEnabled
};