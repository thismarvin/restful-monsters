const express = require("express");
const errors = require("./common/errors.js");
const validation = require("./common/validate.js");
const RequestHelper = require("./common/requestHelper.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

const keys = new Set([
    "username",
    "password"
]);

//#region CRUD
// Creates a user.
router.post("/users", async (req, res) => {
    try {
        if (!RequestHelper.expectFullBody(req, keys)) {
            errors.sendBadRequest(res, "Invalid request body. Expected the body to contain all of the following keys: 'username' and 'password'.");
            return;
        }

        const modifications = [];

        modifications.push({
            "login": validation.userValidater.processUsername(req.body.username)
        });
        modifications.push({
            "password": await validation.userValidater.processPassword(req.body.password)
        });
        modifications.push({
            "created_at": "CURRENT_TIMESTAMP()"
        });

        const tables = [];
        const values = [];

        for (let modification of modifications) {
            tables.push(Object.keys(modification)[0]);
            values.push(Object.values(modification)[0]);
        }

        const insertUserResponse = await db.query(`INSERT INTO users (${tables.toString()}) VALUES (${values.toString()});`);
        const selectUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id="${insertUserResponse.insertId}";`);
        res.status(201).json(selectUserResponse[0]);
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
    try {
        if (!RequestHelper.expectFullBody(req, keys)) {
            errors.sendBadRequest(res, "Invalid request body. Expected the body to contain all of the following keys: 'username' and 'password'.");
            return;
        }

        const selectUserResponse = await db.query(`SELECT id FROM users WHERE login="${req.params.username}";`);
        const userId = selectUserResponse[0].id;
        const modifications = [];

        modifications.push({
            "login": validation.userValidater.processUsername(req.body.username)
        });
        modifications.push({
            "password": await validation.userValidater.processPassword(req.body.password)
        });

        if (selectUserResponse.length === 0) {
            modifications.push({
                "created_at": "CURRENT_TIMESTAMP()"
            });
        }

        const tables = [];
        const values = [];

        for (let modification of modifications) {
            tables.push(Object.keys(modification)[0]);
            values.push(Object.values(modification)[0]);
        }

        if (selectUserResponse.length === 0) {
            const insertUserResponse = await db.query(`INSERT INTO users (${tables.toString()}) VALUES (${values.toString()});`);
            const selectCreatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id="${insertUserResponse.insertId}";`);
            res.status(201).json(selectCreatedUserResponse[0]);
        } else {
            const updates = [];
            for (let i = 0; i < modifications.length; i++) {
                updates.push(`${tables[i]}=${values[i]}`);
            }

            await db.query(`UPDATE users SET ${updates.toString()} WHERE id=${userId};`);
            const selectUpdatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id=${userId};`);
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
    try {
        if (!RequestHelper.expectMinimumBody(req, keys)) {
            errors.sendBadRequest(res, "Invalid request body. Expected the body to contain at least one of the following keys: 'username' and 'password'.");
            return;
        }

        const selectUserResponse = await db.query(`SELECT id FROM users WHERE login="${req.params.username}";`);
        const userId = selectUserResponse[0].id;

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        const modifications = [];

        if (req.body.username) {
            modifications.push({
                "login": validation.userValidater.processUsername(req.body.username)
            });
        }
        if (req.body.password) {
            modifications.push({
                "password": await validation.userValidater.processPassword(req.body.password)
            });
        }

        const tables = [];
        const values = [];

        for (let modification of modifications) {
            tables.push(Object.keys(modification)[0]);
            values.push(Object.values(modification)[0]);
        }

        const updates = [];
        for (let i = 0; i < modifications.length; i++) {
            updates.push(`${tables[i]}=${values[i]}`);
        }

        await db.query(`UPDATE users SET ${updates.toString()} WHERE id=${userId};`);
        const selectUpdatedUserResponse = await db.query(`SELECT id, login, created_at FROM users WHERE id=${userId};`);
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

        await db.query(`DELETE FROM users WHERE id=${selectUserResponse[0].id};`);
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
        const selectUsersResponse = await db.query(`SELECT id, login, created_at FROM users ORDER BY id;`);
        res.status(200).json(selectUsersResponse);
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
        const selectUserResponse = await db.query(`SELECT id FROM users WHERE login="${req.params.username}";`);

        if (selectUserResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that username.");
            return;
        }

        const selectLevelsResponse = await db.query(`SELECT * FROM levels WHERE user_id = ${selectUserResponse[0].id};`);

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