const express = require("express");
const common = require("./common.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered levels.
router.get("/levels", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM v_levels;');
        res.status(200).json(result);
        return;
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            common.sendBadGateway(res, "Could not connect to database.");
            return;
        }

        res.status(500).json(error);
    }
});

// Gets all levels from a specific creator.
router.get("/levels/:creator", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM v_levels WHERE creator="${req.params.creator}";`);

        if (result.length === 0) {
            res.status(404).json({
                error: {
                    "code": 404,
                    "message": "Could not find any levels from that creator."
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

    try {
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

        db.enqueue(`SELECT id FROM users WHERE login="${req.body.creator}";`);
        db.enqueue(`SELECT id FROM levels WHERE name="${req.body.name}";`);
        const results = await db.run();

        const creatorID = results[0][0]["id"];
        const levelID = results[1][0]["id"];

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

        db.enqueue(insertIntoUserLevels);
        db.enqueue(insertIntoLevelData);
        await db.run();

        const result = await db.query(`SELECT * FROM v_levels WHERE name="${req.body.name}";`);
        res.status(201).json(result);

    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            common.sendBadGateway(res, "Could not connect to database.");
            return;
        }

        res.status(500).json(error);
    }
});

module.exports = router;