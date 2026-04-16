const express = require('express');
const Goorm = require("../models/Goorm");
const router = express.Router();

router.post('/', async (req, res) => {
    const userId = req.body.userRequest.user.id;

    try {
        const data = await Goorm.findOne({enabled: true});
        const problems = data.problems;
        const number = parseInt(req.body.action.params.number);

        if (!problems) return res.json({
            version: "2.0",
            template: { outputs: [{ simpleText: { text: `아직 등록된 코드가 없습니다.` } }] }
        });

        const problem = problems[number - 1];

        if (!problem) return res.json({
            version: "2.0",
            template: { outputs: [{ simpleText: { text: `아직 등록된 코드가 없습니다.` } }] }
        })

        console.log(`${userId} checked goorm code(${number})`)

        return res.json({
            version: "2.0",
            template: {
                outputs: [
                    {
                        carousel: {
                            type: "textCard",
                            items: [
                                {
                                    title: `${number}번 문제 정답`,
                                    description: problem.code,
                                    buttons: [
                                        {action: "message", label: `이전 문제 코드 보기`, messageText: `구름 ${number - 1}번 문제 코드 알려줘`},
                                        {action: "message", label: `다음 문제 코드 보기`, messageText: `구름 ${number + 1}번 문제 코드 알려줘`}
                                    ]
                                }
                            ]
                        }
                    }
                ],
            }
        });
    } catch (error) {
        console.error(`An error occurred while getting goorm code: ${error}`);
        return res.json({
            version: "2.0",
            template: { outputs: [{ simpleText: { text: `오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.` } }] }
        });
    }
});

module.exports = router;
