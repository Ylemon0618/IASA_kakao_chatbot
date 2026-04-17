const Log = require('../models/Log');

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m"
};

async function saveLog(req) {
    try {
        const { userRequest, action } = req.body;
        const userId = userRequest.user.id;
        const utterance = userRequest.utterance;
        const blockName = action.name;
        const params = JSON.stringify(action.params);
        const time = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

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

module.exports = saveLog;
