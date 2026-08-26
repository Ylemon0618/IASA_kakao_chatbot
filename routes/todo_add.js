const express = require('express');
const Todo_add = require("../models/Todo");
const router = express.Router();
const {saveLog, printError} = require('../utils/logger');

router.post('/', async (req, res) => {
    await saveLog(req);

    const userId = req.body.userRequest.user.id;

    try {
        console.log(req.body.action.params.start_date);
        console.log(req.body.action.params.end_date);
    } catch (error) {
        return res.json(printError(
            './routes/goorm.js',
            'Error while printing goorm answer',
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        ));
    }
});

module.exports = router;
