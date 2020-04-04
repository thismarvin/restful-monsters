const express = require("express");
const errors = require("./common/errors.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered users.
router.get("/users", async (_, res) => {
    try {
        const result = await db.query(`SELECT * FROM users ORDER BY id;`);
        res.status(200).json(result);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Gets a user with a specific login.
router.get("/users/:login", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE login="${req.body.login}";`);

        if (result.length === 0) {
            errors.sendNotFound(res, "Could not find a user with that login.");
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

// Creates a user.
router.post("/users", async (req, res) => {
    if (!req.body.login) {
        errors.sendBadRequest(res, "Invalid request body.");
        return;
    }

    try {
        await db.query(`INSERT INTO users (login) VALUES ("${req.body.login}");`);
        const result = await db.query(`SELECT * FROM users WHERE login="${req.body.login}";`);
        res.status(201).json(result);
    } catch (error) {
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

module.exports = router;