const express = require('express');
const ip = require("../services/ip");
const router = express.Router();

/* GET info about a single ip */
router.get('/info', async function(req, res, next) {
    try {
        res.json(await ip.getIpInfo(req.query.ip));
    } catch (err) {
        console.error('Error while getting info from ip-api.com.', err.message);
        next(err)
    }
});

/* POST ip info for a batch */
router.post('/batchInfo', async function(req, res, next) {
    try {
        res.json(await ip.getIpBatchInfo(req.body));
    } catch (err) {
        console.error('Error while getting info from ip-api.com.', err.message);
        next(err)
    }
});

/* GET similar IPs */
router.get('/similar', async function(req, res, next) {
    try {
        res.json(await ip.getSimilarIps(req.query.ip));
    } catch (err) {
        console.error('Error while getting similar IPs.', err.message);
        next(err)
    }
});

module.exports = router;
