require('dotenv').config();
const express = require('express');
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const admin = process.env.ADMIN_USERID;

    if (admin.includes(userId)) {
        const command = req.body.action.params.command;

        try {
            eval(command);

            return res.json({
                version: "2.0",
                template: {outputs: [{simpleText: {text: `명령어 실행을 완료했습니다.`}}]}
            })
        } catch (err) {
            return res.json({
                version: "2.0",
                template: {outputs: [{simpleText: {text: `실행 도중 오류가 발생했습니다.\n\n${err.message}`}}]}
            })
        }
    } else {
        return res.json({
            version: "2.0",
            template: {outputs: [{simpleText: {text: `이 명령어는 관리자만 실행할 수 있습니다.`}}]}
        })
    }
}));

module.exports = router;
