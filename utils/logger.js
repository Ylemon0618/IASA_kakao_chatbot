const Log = require('../models/Log');
const colors = require('./colors');

async function saveLog(req) {
    try {
        const {userRequest, action} = req.body;
        const userId = userRequest.user.id;
        const utterance = userRequest.utterance;
        const blockName = action.name;
        const params = JSON.stringify(action.params);
        const time = new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});

        console.log(`\n${colors.cyan}[USER LOG]${colors.reset} ${time}`);
        console.log(`${colors.yellow}ID:${colors.reset} ${userId.substring(0, 10)}...`);
        console.log(`${colors.green}Input:${colors.reset} "${utterance}"`);
        console.log(`${colors.green}Block:${colors.reset} ${blockName}`);
        console.log(`${colors.green}Params:${colors.reset} ${params}`);
        console.log(`------------------------------`);

        const newLog = new Log({
            userId: userId,
            utterance: utterance,
            blockName: blockName,
            params: action.params,
            timestamp: new Date()
        });

        await newLog.save();
    } catch (err) {
        console.error(`${colors.red}[LOG ERROR]${colors.reset}`, err.message);
    }
}

function printError(path, errorMsg, kakao) {
    try {
        console.error(`${colors.red}${path}${colors.reset}: ${errorMsg}`);

        if (!kakao) {
            return null;
        }

        return {
            version: "2.0",
            template: {outputs: [{simpleText: {text: kakao}}]}
        };
    } catch (err) {
        console.error(`${colors.red}[LOG ERROR]${colors.reset}`, err.message);
    }
}

/**
 * @param {string} filePath - 현재 파일 경로 (__filename)
 * @param {Function} fn - 실행할 비동기 함수
 */
const asyncLogger = (filePath, fn) => {
    return async (...args) => {
        const isExpress = args[0]?.body && typeof args[1]?.json === 'function';

        let req = null;
        let res = null;
        let userId = null;

        if (isExpress) {
            req = args[0];
            res = args[1];

            await saveLog(req);
            userId = req.body?.userRequest?.user?.id || null;
        }

        try {
            if (isExpress) {
                return await fn(req, res, userId);
            } else {
                return await fn(...args);
            }
        } catch (error) {
            if (isExpress) {
                const errorResponse = await printError(
                    filePath,
                    `Error on ${filePath}: ${error.message}`,
                    '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
                );
                return res.json(errorResponse);
            } else {
                return printError(filePath, `Error in helper function: ${error.message}`);
            }
        }
    };
};

module.exports = {
    saveLog,
    printError,
    asyncLogger,
};
