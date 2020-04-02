const express = require("express");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered users.
router.get("/users", async (req, res) => {
    await db.query(`SELECT * FROM users ORDER BY id;`)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// Gets a user with a specific login.
router.get("/users/:login", async (req, res) => {
    await db.query(`SELECT * FROM users WHERE login="${req.params.login}";`)
        .then(result => {
            if (result.length === 0) {
                res.status(404).json({
                    "error": "Could not find a user with that login."
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// Creates a user.
router.post("/users", async (req, res) => {
    await db.query(`INSERT INTO users (login) VALUES ("${req.params.login}");`)
        .then(async () => {
            await db.query(`SELECT * FROM users WHERE login="${req.params.login}";`)
                .then(result => {
                    res.status(201).json(result);
                });
        })
        .catch(error => {
            if (error.code === "ER_DUP_ENTRY") {
                res.status(409).json({
                    "error": "A user with that login already exists."
                });
            } else {
                res.status(500).json(err);
            }
        });
});

module.exports = router;