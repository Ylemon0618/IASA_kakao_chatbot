const express = require('express');
const Todo = require("../models/Todo");
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const start_date = req.body.action.params.start_date;
    const end_date = req.body.action.params.end_date;

    console.log(start_date, end_date);

    return res.json({
        version: "2.0",
        template: {
            outputs: [{simpleText: {text: `${start_date} ${end_date}`}},]
        }
    });
}));

module.exports = router;
