const express = require('express');
const search = require("../services/search");
const router = express.Router();

/* GET clients by string input */
router.get('/s', async function(req, res, next) {
    try {
        res.json(await search.getClientsByString(req.query.name, req.query.page));
    } catch (err) {
        console.error('Error while getting search results.', err.message);
        next(err)
    }
});

/* GET clients by alias string input */
router.get('/a', async function(req, res, next) {
    try {
        res.json(await search.getClientsByAlias(req.query.name, req.query.page));
    } catch (err) {
        console.error('Error while getting search results.', err.message);
        next(err)
    }
});

/* GET clients by guid */
router.get('/guid', async function(req, res, next) {
    try {
        res.json(await search.getClientsByGuid(req.query.guid, req.query.page));
    } catch (err) {
        console.error('Error while getting search results.', err.message);
        next(err)
    }
});

/* GET client by id */
router.get('/id', async function(req, res, next) {
    try {
        res.json(await search.getClientById(req.query.id));
    } catch (err) {
        console.error('Error while getting search result.', err.message);
        next(err)
    }
});

module.exports = router;
