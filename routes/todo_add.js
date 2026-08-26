const express = require('express');
const Todo = require("../models/Todo");
const router = express.Router();
const {saveLog, printError} = require('../utils/logger');

router.post('/', async (req, res) => {
    await saveLog(req);

    const userId = req.body.userRequest.user.id;

    try {
        const start_date = req.body.action.params.start_date;
        const end_date = req.body.action.params.end_date;

        return res.json({
            version: "2.0",
            template: {
                outputs: [{ simpleText: { text: `${start_date} ${end_date}` } },]
            }
        });
    } catch (error) {
        return res.json(printError(
            './routes/todo_add.js',
            'Error while adding todo',
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        ));
    }
});

module.exports = router;
