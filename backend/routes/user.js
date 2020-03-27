const express = require("express");
const db = require("../database/setup.js");

const router = express.Router();

router.get('/user', (req, res) => {
    db("users").select("*").orderBy("id").then(result => {
        res.json(result);
    });
});

module.exports = router;