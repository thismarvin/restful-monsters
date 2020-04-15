const express = require("express");
const errors = require("./common/errors.js");
const validation = require("./common/validate.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

//#region CRUD
// Creates a user.
router.post("/users", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'username' and 'password' keys and values.`);
        return;
    }

    try {
        const username = validation.userValidater.processUsername(req.body.username);
        const password = await validation.userValidater.processPassword(req.body.password);

        const insertUserResponse = await db.query(`INSERT INTO users (login, password, created_at) VALUES ("${username}", "${password}", CURRENT_TIMESTAMP());`);
        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id="${insertUserResponse.insertId}";`);
        res.status(201).json(selectUserResponse);
    } catch (error) {
        if (error.validationError) {
            errors.sendBadRequest(res, error.message);
            return;
        }

        switch (error.code) {
            case "ER_DUP_ENTRY":
                errors.sendConflict(res, "A user with that login already exists.");
                break;
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Gets a user with a specific username.
router.get("/users/:username", async (req, res) => {
    try {
        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        res.status(200).json(selectUserResponse[0]);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Updates everything about a user.
router.put("/users/:username", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'username' and 'password' keys and values.`);
        return;
    }

    try {
        const username = validation.userValidater.processUsername(req.body.username);
        const password = await validation.userValidater.processPassword(req.body.password);

        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            const insertUserResponse = await db.query(`INSERT INTO users (login, password, created_at) VALUES ("${username}", "${password}", CURRENT_TIMESTAMP());`);
            const selectCreatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id="${insertUserResponse.insertId}";`);
            res.status(201).json(selectCreatedUserResponse[0]);
        } else {
            const userID = selectUserResponse[0].id;
            await db.query(`UPDATE users SET login="${username}", password="${password}" WHERE id = ${userID};`);
            const selectUpdatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id=${userID};`);
            res.status(200).json(selectUpdatedUserResponse[0]);
        }
    } catch (error) {
        if (error.validationError) {
            errors.sendBadRequest(res, error.message);
            return;
        }

        switch (error.code) {
            case "ER_DUP_ENTRY":
                errors.sendConflict(res, "A user with that login already exists.");
                break;
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Updates a specific value of a user.
router.patch("/users/:username", async (req, res) => {
    if (!req.body.username && !req.body.password) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'username' or 'password' key and values.`);
        return;
    }

    try {
        const selectUserResponse = await db.query(`SELECT id FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        const userID = selectUserResponse[0].id;

        let username = null;
        let password = null;
        let modifications = [];

        if (req.body.username) {
            username = validation.userValidater.processUsername(req.body.username);
            modifications.push(`login="${username}"`);
        }

        if (req.body.password) {
            password = await validation.userValidater.processPassword(req.body.password);
            modifications.push(`password="${password}"`);
        }

        await db.query(`UPDATE users SET ${modifications.toString()} WHERE id = ${userID}`);
        const selectUpdatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id=${userID};`);
        res.status(200).json(selectUpdatedUserResponse[0]);
    } catch (error) {
        if (error.validationError) {
            errors.sendBadRequest(res, error.message);
            return;
        }

        switch (error.code) {
            case "ER_DUP_ENTRY":
                errors.sendConflict(res, "A user with that login already exists.");
                break;
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Deletes a user.
router.delete("/users/:username", async (req, res) => {
    try {
        const selectUserResponse = await db.query(`SELECT id FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        const userID = selectUserResponse[0].id;

        await db.query(`DELETE FROM users WHERE id=${userID};`);
        res.status(204).json();
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});
//#endregion

// Gets all registered users.
router.get("/users", async (_, res) => {
    try {
        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users ORDER BY id;`);
        res.status(200).json(selectUserResponse);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Gets all levels from a specific user.
router.get("/users/:username/levels", async (req, res) => {
    try {
        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        const userID = selectUserResponse[0].id;
        const selectLevelsResponse = await db.query(`SELECT id, name, description, data, created_at FROM levels WHERE user_id = ${userID};`);

        res.status(200).json(selectLevelsResponse);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

module.exports = router;