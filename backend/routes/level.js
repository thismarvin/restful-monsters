const express = require("express");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered levels.
router.get("/levels", async (req, res) => {
    await db.query(`SELECT * FROM v_levels;`)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// Gets all levels from a specific creator.
router.get("/levels/:creator", async (req, res) => {
    await db.query(`SELECT * FROM v_levels WHERE creator="${req.params.creator}";`)
        .then(result => {
            if (result.length === 0) {
                res.status(404).json({
                    "error": "Could not find any levels from that user."
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// // Creates a level.
// // TODO:
// router.post("/levels", (req, res) => {

// });

module.exports = router;