const express = require('express');
const Todo = require("../models/Todo");
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

async function getTodos(res, req, date) {
    const shorts = await Todo.find({date: date})
    const shorts_title = shorts.map(item => item.title)

    return {
        version: "2.0",
        template: {
            outputs: [{
                simpleText: {
                    text: `검색된 목록:\n\n${shorts_title.join('\n')}`
                }
            }]
        }
    };
}

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const month = parseInt(req.body.action.params.month);
    const day = parseInt(req.body.action.params.day);
    const currentYear = new Date().getFullYear();
    const search_date = new Date(currentYear, month - 1, day, 0, 0, 0, 0);

    return res.json(await getTodos(res, req, search_date));
}));

router.post('/today', asyncLogger(__filename, async (req, res, userId) => {
    const search_date = new Date();
    search_date.setHours(0, 0, 0, 0);

    return res.json(await getTodos(res, req, search_date));
}));

module.exports = router;
