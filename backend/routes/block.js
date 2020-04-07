const express = require("express");
const errors = require("./common/errors.js");
const db = require("../database/setup.js").jocose;

const router = express.Router();

// Gets all registered users.
router.get("/blocks", async (_, res) => {
    try {
        const result = await db.query(`SELECT * FROM v_blocks ORDER BY id;`);
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