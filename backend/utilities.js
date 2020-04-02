let debugArgPresent = false;
process.argv.forEach((val) => {
    if (val.toLowerCase() === "debug") {
        debugArgPresent = true;
    }
});

module.exports = {
    debugArgPresent
};