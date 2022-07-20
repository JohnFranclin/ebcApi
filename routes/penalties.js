const express = require('express');
const penalties = require("../services/penalties");
const router = express.Router();

/* GET all penalties */
router.get('/all', async function(req, res, next) {
    try {
        res.json(await penalties.getAllPenalties(req.query.page));
    } catch (err) {
        console.error('Error while getting all penalties.', err.message);
        next(err)
    }
});

/* GET penalties by penalty type */
router.get('/byType', async function(req, res, next) {
    try {
        res.json(await penalties.getPenaltiesByType(req.query.type, req.query.page));
    } catch (err) {
        console.error('Error while getting penalties by type.', err.message);
        next(err)
    }
});

/* GET penalties by IP */
router.get('/byIp', async function(req, res, next) {
    try {
        res.json(await penalties.getPenaltiesByIp(req.query.ip));
    } catch (err) {
        console.error('Error while getting penalties by IP.', err.message);
        next(err)
    }
});

/* GET total penalties per member */
router.get('/perMember', async function(req, res, next) {
    try {
        res.json(await penalties.getTotalPenaltiesPerMember());
    } catch (err) {
        console.error('Error while getting penalties per member.', err.message);
        next(err)
    }
});

/* GET total penalties per member last 30 day */
router.get('/perMemberLast30', async function(req, res, next) {
    try {
        res.json(await penalties.getPenaltiesPerMemberLastMonth());
    } catch (err) {
        console.error('Error while getting penalties per member from last month.', err.message);
        next(err)
    }
});

module.exports = router;
