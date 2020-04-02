const express = require("express");
const common = require("./common.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered users.
router.get("/users", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM users ORDER BY id;`);
        res.status(200).json(result);
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            common.sendBadGateway(res, "Could not connect to database.");
            return;
        }

        res.status(500).json(error);
    }
});

// Gets a user with a specific login.
router.get("/users/:login", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE login="${req.body.login}";`);

        if (result.length === 0) {
            res.status(404).json({
                "error": {
                    "code": 404,
                    "message": `Could not find a user with that login.`
                }
            });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            common.sendBadGateway(res, "Could not connect to database.");
            return;
        }

        res.status(500).json(error);
    }
});

// Creates a user.
router.post("/users", async (req, res) => {
    if (!req.body["login"]) {
        common.sendBadRequest(res, "Invalid request body.");
        return;
    }

    try {
        await db.query(`INSERT INTO users (login) VALUES ("${req.body.login}");`);
        const result = await db.query(`SELECT * FROM users WHERE login="${req.body.login}";`);
        res.status(201).json(result);
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            common.sendBadGateway(res, "Could not connect to database.");
            return;
        }

        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                "error": {
                    "code": 409,
                    "message": `A user with that login already exists.`
                }
            });
            return;
        }

        res.status(500).json(error);
        return;
    }
});

module.exports = router;