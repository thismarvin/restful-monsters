const express = require("express");
const errors = require("./common/errors.js");
const validation = require("./common/validate.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();


//#region CRUD
router.post("/levels", async (req, res) => {
    if (!req.body.userId || !req.body.name || !req.body.data) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'userId', 'name', and 'data' keys and values.`);
        return;
    }

    try {
        const modifications = [];

        modifications.push({
            "user_id": validation.levelValidator.processUserId(req.body.userId)
        });
        modifications.push({
            "name": validation.levelValidator.processName(req.body.name)
        });
        modifications.push({
            "data": validation.levelValidator.processData(req.body.data)
        });
        modifications.push({
            "created_at": "CURRENT_TIMESTAMP()"
        });

        if (req.body.description) {
            modifications.push({
                "description": validation.levelValidator.processDescription(req.body.description)
            });
        }

        const tables = [];
        const values = [];

        for (let modification of modifications) {
            tables.push(Object.keys(modification)[0]);
            values.push(Object.values(modification)[0]);
        }

        const insertLevelResponse = await db.query(`INSERT INTO levels (${tables.toString()}) VALUES (${values.toString()});`);
        const selectNewLevel = await db.query(`SELECT * FROM levels WHERE id=${insertLevelResponse.insertId};`);
        res.status(201).json(selectNewLevel[0]);
    } catch (error) {
        if (error.validationError) {
            errors.sendBadRequest(res, error.message);
            return;
        }

        switch (error.code) {
            case "ER_INVALID_JSON_TEXT":
                errors.sendBadRequest(res, "The level data that was provided was not formatted correctly. Make sure to use valid JSON syntax.");
                break;
            default:
                errors.handle(res, error);
                break;
        }
    }
});

router.get("/levels/:id", async (req, res) => {
    try {
        const selectLevelResponse = await db.query(`SELECT * FROM levels WHERE id=${req.params.id};`);

        if (selectLevelResponse.length === 0) {
            errors.sendNotFound(res, "Could not find a level with that id.");
            return;
        }

        res.status(200).json(selectLevelResponse[0]);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

router.put("/levels/:id", async (req, res) => {

});

router.patch("/levels/:id", async (req, res) => {

});

router.delete("/levels/:id", async (req, res) => {

});
//#endregion

// Gets all registered levels.
router.get("/levels", async (_, res) => {
    try {
        const result = await db.query(`SELECT * FROM levels;`);
        res.status(200).json(result);
    } catch (error) {
        switch (error.code) {
            default:
                errors.handle(res, error);
                break;
        }
    }
});

module.exports = router;