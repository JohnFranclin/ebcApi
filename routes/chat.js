const express = require('express');
const chat = require("../services/chat");
const router = express.Router();

/* GET all chat */
router.get('/all', async function(req, res, next) {
    try {
        res.json(await chat.getChatMessages(req.query.page));
    } catch (err) {
        console.error('Error while getting all chat.', err.message);
        next(err)
    }
});

/* GET messages by message id */
router.get('/byId', async function(req, res, next) {
    try {
        res.json(await chat.getChatByMessagesId(req.query.id));
    } catch (err) {
        console.error('Error while getting messages by ID.', err.message);
        next(err)
    }
});

/* GET calladmin chat */
router.get('/ca', async function(req, res, next) {
    try {
        res.json(await chat.getCallAdminLog(req.query.page));
    } catch (err) {
        console.error('Error while getting messages in calladmin.', err.message);
        next(err)
    }
});

module.exports = router;
