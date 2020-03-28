const express = require("express");
const db = require("../database/setup.js");

const router = express.Router();

// Gets all registered users.
router.get("/users", (req, res) => {
    db("users").select("*").orderBy("id").then(result => {
        res.json(result);
    })
    .catch(err => {
        res.json(err);
    });
});

// Gets a user with a specific login.
router.get("/users/:login", (req, res) => {
    db("users").select("*").where({login: req.params.login}).then(result => {
        if (result.length === 0) {
            res.status(404).json({
                "error": "Could not find a user with that login."
            });
        } else {
            res.json(result);
        }
    })
    .catch(() => {
        res.status(400).json(err);
    });
});

// Creates a user.
router.post("/users", (req, res) => {
    db("users").insert(req.body).then(id => {
        db("users").select("*").where({id: id[0]}).then(result => {
            res.status(201).json(result);
        });
    })
    .catch(err => {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                "error": "A user with that login already exists."
            });
        } else {
            res.status(400).json(err);
        }
    });
});

module.exports = router;