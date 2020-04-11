const bcrypt = require("bcrypt");

function validateUsername(username) {
    const validated = username.toString().trim();

    if (validated.length === 0) {
        throw {
            "code": "USERNAME_TOO_SHORT",
            "message": "A valid username must be at least one character long.",
            "validationError": true
        };
    }
    if (validated.length > 32) {
        throw {
            "code": "USERNAME_TOO_LONG",
            "message": "A valid username must be at least one character long.",
            "validationError": true
        };
    }

    if (/[^\w-.]/g.test(validated)) {
        throw {
            "code": "USERNAME_INVALID_CHARACTERS",
            "message": "A valid username must consist of only alphanumeric characters, with the exception of an underscore, dash, and period.",
            "validationError": true
        };
    }

    return validated;
}

function validatePassword(password) {
    const validated = password.toString().trim();

    if (validated.length < 8) {
        throw {
            "code": "PASSWORD_TOO_SHORT",
            "message": "A valid password must be at least eight characters long.",
            "validationError": true
        };
    }

    return validated;
}

async function validateUser(user) {
    const username = validateUsername(user.username);
    const password = validatePassword(user.password);
    const hashedPassword = await bcrypt.hash(password, 10);

    return {
        "username": username,
        "hashedPassword": hashedPassword
    };
}

module.exports = {
    validateUser
};