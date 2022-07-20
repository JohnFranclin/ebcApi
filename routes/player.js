const express = require('express');
const router = express.Router();
const player = require('../services/player');

/* GET basic information. */
router.get('/basic', async function(req, res, next) {
   try {
       res.json(await player.getOverview(req.query.id));
   } catch (err) {
       console.error('Error while getting basic information.', err.message);
       next(err)
   }
});

/* GET playtime in seconds */
router.get('/playtime', async function(req, res, next) {
    try {
        res.json(await player.getPlaytimeInSeconds(req.query.guid));
    } catch (err) {
        console.error('Error while getting playtime.', err.message);
        next(err)
    }
});

/* GET prestige and awards */
router.get('/prestigeAwards', async function(req, res, next) {
    try {
        res.json(await player.getPrestigeAndAwards(req.query.guid));
    } catch (err) {
        console.error('Error while getting prestige and awards.', err.message);
        next(err)
    }
});

/* GET basic player stats */
router.get('/stats', async function(req, res, next) {
    try {
        res.json(await player.getStats(req.query.id));
    } catch (err) {
        console.error('Error while getting stats.', err.message);
        next(err)
    }
});

/* GET penalty stats, only use case for members */
router.get('/penaltyStats', async function(req, res, next) {
    try {
        res.json(await player.getPenaltyStats(req.query.id));
    } catch (err) {
        console.error('Error while getting penalty stats.', err.message);
        next(err)
    }
});

/* GET aliases */
router.get('/aliases', async function(req, res, next) {
    try {
        res.json(await player.getAliases(req.query.id));
    } catch (err) {
        console.error('Error while getting aliases.', err.message);
        next(err)
    }
});

/* GET penalties */
router.get('/penalties', async function(req, res, next) {
    try {
        res.json(await player.getPenalties(req.query.id));
    } catch (err) {
        console.error('Error while getting penalties.', err.message);
        next(err)
    }
});

/* GET chat log */
router.get('/chatLog', async function(req, res, next) {
    try {
        res.json(await player.getChatlog(req.query.id, req.query.page));
    } catch (err) {
        console.error('Error while getting chatlog.', err.message);
        next(err)
    }
});

/* GET prestige log */
router.get('/prestigeLog', async function(req, res, next) {
    try {
        res.json(await player.getPrestigeLog(req.query.guid));
    } catch (err) {
        console.error('Error while getting prestige log.', err.message);
        next(err)
    }
});

/* GET IP aliases */
router.get('/ipAliases', async function(req, res, next) {
    try {
        res.json(await player.getIpAliases(req.query.id));
    } catch (err) {
        console.error('Error while getting ip aliases.', err.message);
        next(err)
    }
});

/* GET command log */
router.get('/cmdLog', async function(req, res, next) {
    try {
        res.json(await player.getCmdLog(req.query.id));
    } catch (err) {
        console.error('Error while getting command log.', err.message);
        next(err)
    }
});

module.exports = router;