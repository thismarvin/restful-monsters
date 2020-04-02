let debugArgPresent = false;
process.argv.forEach((val) => {
    if (val.toLowerCase() === "debug") {
        debugArgPresent = true;
    }
});

const colorCodes = {
    "white": "\x1b[37m",
    "green": "\x1b[32m",
    "red": "\x1b[31m"
}

function log(message, color) {
    let colorCode = colorCodes.white;

    if (color && colorCodes[color]) {
        colorCode = colorCodes[color];
    }

    console.log(`${colorCode}${message}${"\x1b[0m"}`);
}

module.exports = {
    debugArgPresent,
    log
};