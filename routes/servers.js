const express = require('express');
const servers = require("../services/servers");
const router = express.Router();

/* GET promod svars */
router.get('/promodsvars', async function(req, res, next) {
    try {
        res.json(await servers.getPromodSvars());
    } catch (err) {
        console.error('Error while getting promod svars.', err.message);
        next(err)
    }
});

/* GET current promod players */
router.get('/promodplayers', async function(req, res, next) {
    try {
        res.json(await servers.getPromodPlayers());
    } catch (err) {
        console.error('Error while getting promod svars.', err.message);
        next(err)
    }
});

module.exports = router;
