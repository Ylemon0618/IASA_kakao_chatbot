const express = require('express');
const Goorm = require("../models/Goorm");
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const { clientExtra, params } = req.body.action;
    const client = (clientExtra && Object.keys(clientExtra).length > 0) ? clientExtra : params;

    let week = client.week;
    const query = week ? {week: Number(week)} : {week: {$exists: true}};
    const data = await Goorm.findOne(query).sort({week: -1});
    week = data?.week;

    const number = parseInt(client.number);
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
                {
                    action: "block",
                    label: "지난번 문제 확인하기",
                    blockId: "69e07f3b9e38951753fa1751",
                    extra: {
                        number: number,
                        week: week - 1
                    }
                },
                {action: "message", label: `이전 문제 코드 보기`, messageText: `구름 ${number - 1}번 문제 코드 알려줘`},
                {action: "message", label: `다음 문제 코드 보기`, messageText: `구름 ${number + 1}번 문제 코드 알려줘`}
            ]
        }
    });
}));

module.exports = router;
