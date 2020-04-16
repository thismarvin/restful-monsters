const express = require("express");
const errors = require("./common/errors.js");
const validation = require("./common/validate.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();


//#region CRUD
router.post("/levels", async (req, res) => {
    if (!req.body.userId || !req.body.name || !req.body.description || !req.body.data) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'userId', 'name', 'description', and 'data' keys and values.`);
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
            "description": validation.levelValidator.processDescription(req.body.description)
        });
        modifications.push({
            "data": validation.levelValidator.processData(req.body.data)
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
    if (!req.body.userId || !req.body.name || !req.body.description || !req.body.data) {
        errors.sendBadRequest(res, `Invalid request body. Expected 'userId', 'name', 'description', and 'data' keys and values.`);
        return;
    }

    const levelId = parseInt(req.params.id);

    if (levelId != req.params.id) {
        errors.sendBadRequest(res, "The given level id is invalid. A number was expected.");
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
            "description": validation.levelValidator.processDescription(req.body.description)
        });
        modifications.push({
            "data": validation.levelValidator.processData(req.body.data)
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

        const selectLevelResponse = await db.query(`SELECT id FROM levels WHERE id =${levelId};`);

        if (selectLevelResponse.length === 0) {
            const insertLevelResponse = await db.query(`INSERT INTO levels (${tables.toString()}) VALUES (${values.toString()});`);
            const selectInsertedLevelResponse = await db.query(`SELECT * FROM levels WHERE id=${insertLevelResponse.insertId};`);
            res.status(200).json(selectInsertedLevelResponse[0]);
        } else {
            const updates = [];
            for (let i = 0; i < modifications.length; i++) {
                updates.push(`${tables[i]}=${values[i]}`);
            }
            await db.query(`UPDATE levels SET ${updates.toString()} WHERE id=${levelId};`);
            const selectUpdatedLevelResponse = await db.query(`SELECT * FROM levels WHERE id=${levelId};`);
            res.status(200).json(selectUpdatedLevelResponse[0]);
        }
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