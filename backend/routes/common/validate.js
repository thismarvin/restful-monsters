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

    /**
     * Formats, validates, and hashes a given password, and returns the result.
     * @param {String} password The password to format, validate, and hash.
     */
    async processPassword(password) {
        const formattedPassword = this.formatPassword(password);

        if (this.validatePassword(formattedPassword)) {
            return await bcrypt.hash(formattedPassword, this.saltRounds);
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

    /**
     * Formats a given password, and returns the result as a String.
     * @param {String} password The password to format.
     */
    formatPassword(password) {
        return password.toString().trim();
    }

    /**
     * Tests whether or not a given password is valid. Throws an error otherwise.
     * @param {String} password A formatted password to validate.
     */
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

class LevelValidator {
    constructor() {

    }

    processUserId(userId) {
        const formattedUserId = this.formatUserId(userId);
        if (this.validateUserId(formattedUserId)) {
            return userId;
        }
    }

    processName(name) {
        const formattedName = this.formatName(name);

        if (this.validateName(formattedName)) {
            return `"${formattedName}"`;
        }
    }

    processData(data) {
        return `"${this.formatData(data)}"`;
    }

    processDescription(description) {
        const formattedDescription = this.formatDescription(description);

        if (this.validateDescription(formattedDescription)) {
            return `"${formattedDescription}"`;
        }
    }

    formatUserId(userId) {
        return parseInt(userId);
    }

    validateUserId(userId) {
        if (typeof userId !== "number") {
            throw {
                "code": "USERID_EXPECTED_NUMBER",
                "message": "A valid user id must be a number.",
                "validationError": true
            };
        }

        return true;
    }


    formatName(name) {
        return name.toString().trim().replace(/'|"/g, `""`);;
    }

    validateName(name) {
        if (name.length === 0) {
            throw {
                "code": "NAME_TOO_SHORT",
                "message": "A valid level name must be at least one character long.",
                "validationError": true
            };
        }

        if (name.length > 32) {
            throw {
                "code": "NAME_TOO_LONG",
                "message": "A valid level name cannot be longer than 32 characters.",
                "validationError": true
            };
        }

        return true;
    }

    formatDescription(description) {
        return description.toString().trim().replace(/'|"/g, `""`);
    }

    validateDescription(description) {
        if (description.length > 64) {
            throw {
                "code": "DESCRIPTION_TOO_LONG",
                "message": "A level description cannot be longer than 32 characters.",
                "validationError": true
            };
        }

        return true;
    }

    formatData(data) {
        let result = data.replace(/'|"/g, `""`);
        const invalidKeys = result.match(/\w+\s*:/g);

        if (invalidKeys) {
            for (let key of invalidKeys) {
                result = result.replace(key, `""${key.substring(0, key.length - 1)}"":`);
            }
        }

        return result;
    }

    // TODO: Make a regex that can catch ER_INVALID_JSON_TEXT early instead of having MySQL complain.
    // validateData(data) {
    //     // I do not think this will work long term!
    //     //{\n*("[a-z]+":"([A-Z0-9]+\.[A-Z0-9]+,*)+",*\n*)+\n*}
    //     return true;
    // }
}

const userValidater = new UserValidator();
const levelValidator = new LevelValidator();

module.exports = {
    userValidater,
    levelValidator
};