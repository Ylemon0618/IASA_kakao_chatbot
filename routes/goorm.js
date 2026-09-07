const express = require('express');
const Goorm = require("../models/Goorm");
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    let week = req.body.action.params.week;
    const query = week ? {week: Number(week)} : {week: {$exists: true}};
    const data = await Goorm.findOne(query).sort({week: -1});
    week = data?.week;

    const number = parseInt(req.body.action.params.number);
    const problem = data?.problems?.[number - 1];

    if (!problem) {
        return res.json({
            version: "2.0",
            template: {outputs: [{simpleText: {text: "아직 등록된 코드가 없습니다."}}]}
        });
    }

    return res.json({
        version: "2.0",
        template: {
            outputs: [{
                simpleText: {
                    text: `${number}번 문제 정답\n\n${problem.code}`
                },
            }],
            quickReplies: [
                {action: "message", label: "지난번 문제 확인하기", messageText: `구름 ${week - 1}주차 ${number}번 문제 코드 알려줘`},
                {action: "message", label: `이전 문제 코드 보기`, messageText: `구름 ${number - 1}번 문제 코드 알려줘`},
                {action: "message", label: `다음 문제 코드 보기`, messageText: `구름 ${number + 1}번 문제 코드 알려줘`}
            ]
        }
    });
}));

module.exports = router;
