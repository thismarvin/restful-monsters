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
                    error: "Could not find any levels from that user."
                });
            } else {
                res.status(200).json(result);
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

// Creates a level.
router.post("/levels", async (req, res) => {
    /**
     * example_request = {
     *  creator: thismarvin,
     *  name: World 1 - 1,
     *  description: Have fun you guys!,
     *  data: {
     *      "blocks": "5.1,1.1A"
     *  }
     * }
     */

    if (!req.body["creator"] || !req.body["name"] || !req.body["description"] || !req.body["data"]) {
        res.status(400).json({
            error: "Invalid request body."
        });
        return;
    }

    let creatorID;
    let levelID;

    // TODO: maybe .connect should return a promise and not do whatever it does now?
    await db.connect()
        .then(async () => {
            const insertIntoLevels = `
            INSERT INTO levels
            (name, description, date_created, time_created)
            VALUES (
            "${req.body.name}",
            "${req.body.description}",
            CURDATE(),
            CURTIME()
            );
            `;
            await db.query(insertIntoLevels)
        })
        .then(async () => {
            const getCreatorID = async () => {
                return new Promise(async (resolve) => {
                    await db.query(`SELECT * FROM users WHERE login="${req.body.creator}";`)
                        .then(result => {
                            if (result.length === 0) {
                                resolve(false);
                                return;
                            }

                            creatorID = result[0]["id"];
                            resolve(true);
                        });
                });
            };

            const getLevelID = async () => {
                return new Promise(async resolve => {
                    await db.query(`SELECT * FROM levels WHERE name="${req.body.name}";`)
                        .then(result => {
                            if (result.length === 0) {
                                resolve(false);
                                return;
                            }

                            levelID = result[0]["id"];
                            resolve(true);
                        });
                });
            };

            await Promise.all([
                getCreatorID(),
                getLevelID()
            ]);
        })
        .then(async () => {
            const insertIntoUserLevels = `
            INSERT INTO user_levels
            (user_id, level_id)
            VALUES (
            ${creatorID},
            ${levelID}
            );
            `;

            const insertIntoLevelData = `
            INSERT INTO level_data
            (level_id, data)
            VALUES (
            ${levelID},
            '${req.body.data}'
            );
            `;

            await Promise.all([
                db.query(insertIntoUserLevels),
                db.query(insertIntoLevelData)
            ]);
        })
        .then(async () => {
            return await db.query(`SELECT * FROM v_levels WHERE name="${req.body.name}";`)
        })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            console.log(error.code);
            console.log(error.sql);
        });
});

module.exports = router;