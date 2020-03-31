const express = require("express");
const db = require("../database/setup.js");

const router = express.Router();

// Gets all registered levels.
router.get("/levels", (req, res) => {
    db("levels").select("*").orderBy("id").then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Gets all levels from a specific creator.
// TODO: Test if this works lol 😉
router.get("/levels/:login", (req, res) => {
    db("user_levels")
    .innerJoin("levels", "user_levels.level_id", "levels.id")
    .innerJoin("users", "user_levels.user_id", "users.id")
    .where({login: req.params.login})
    .then(result => {
        if (result.length === 0) {
            res.status(404).json({
                "error": "Could not find any levels from that user."
            });
        } else {
            res.json(result);
        }
    })
    .catch(() => {
        res.status(500).json(err);
    });
});

// Creates a level.
// TODO: I mean this does create a level, but there is no actual data yet. Just metadata.
router.post("/levels", (req, res) => {
    db("levels").insert(req.body).then(id => {
        db("levels").select("*").where({id: id[0]}).then(result => {
            res.status(201).json(result);
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;