const bcrypt = require("bcrypt");

class UserValidator {
    constructor() {
        this.saltRounds = 10;
    }

    /**
     * Formats and validates a given username, and returns the result.
     * @param {String} username The username to format and validate.
     */
    processUsername(username) {
        const formattedUsername = this.formatUsername(username);

        if (this.validateUsername(formattedUsername)) {
            return formattedUsername;
        }
    }

    async processPassword(password) {
        const formattedPassword = this.formatPassword(password);

        if (this.validatePassword(formattedPassword)) {
            return await bcrypt.hash(password, this.saltRounds);
        }
    }

    /**
     * Formats a given username, and returns the result as a String.
     * @param {String} username The username to format.
     * @private
     */
    formatUsername(username) {
        return username.toString().trim();
    }

    /**
     * Tests whether or not a given username is valid. Throws an error otherwise.
     * @param {String} username A formatted username to validate.
     * @private
     */
    validateUsername(username) {
        if (username.length === 0) {
            throw {
                "code": "USERNAME_TOO_SHORT",
                "message": "A valid username must be at least one character long.",
                "validationError": true
            };
        }
        if (username.length > 32) {
            throw {
                "code": "USERNAME_TOO_LONG",
                "message": "A valid username must be at least one character long.",
                "validationError": true
            };
        }

        if (/[^\w-.]/g.test(username)) {
            throw {
                "code": "USERNAME_INVALID_CHARACTERS",
                "message": "A valid username must consist of only alphanumeric characters, with the exception of an underscore, dash, and period.",
                "validationError": true
            };
        }

        return true;
    }

    formatPassword(password) {
        return password.toString().trim();
    }

    validatePassword(password) {
        if (password.length < 8) {
            throw {
                "code": "PASSWORD_TOO_SHORT",
                "message": "A valid password must be at least eight characters long.",
                "validationError": true
            };
        }

        return true;
    }
}

const userValidater = new UserValidator();

module.exports = {
    processUsername: userValidater.processUsername.bind(userValidater),
    processPassword: userValidater.processPassword.bind(userValidater)
};