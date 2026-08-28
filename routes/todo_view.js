const express = require('express');
const Todo = require("../models/Todo");
const router = express.Router();
const {saveLog, printError} = require('../utils/logger');

router.post('/', async (req, res) => {
    await saveLog(req);

    const userId = req.body.userRequest.user.id;

    try {
        const month = parseInt(req.body.action.params.month);
        const day = parseInt(req.body.action.params.day);
        const currentYear = new Date().getFullYear();
        const date_now = new Date(currentYear, month - 1, day);
        date_now.setHours(0, 0, 0, 0);
        console.log(month, day, currentYear, date_now);

        const shorts = await Todo.find({date: date_now})
        const shorts_title = shorts.map(item => item.title)

        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {
                        text: `검색된 목록:\n\n${shorts_title.join('\n')}`
                    }
                }]
            }
        });
    } catch (error) {
        return res.json(printError(
            './routes/todo_add.js',
            'Error while showing todo',
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        ));
    }
});

module.exports = router;
