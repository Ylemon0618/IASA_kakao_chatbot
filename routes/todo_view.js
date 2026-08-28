const express = require('express');
const Todo = require("../models/Todo");
const router = express.Router();
const {saveLog, printError, asyncLogger} = require('../utils/logger');

function formatTodoList(todos, targetMonth, targetDay) {
    if (!todos || todos.length === 0) {
        return `📅 ${targetMonth}월 ${targetDay}일에 등록된 일정이 없습니다.`;
    }

    let text = `📅 ${targetMonth}월 ${targetDay}일 일정 목록\n\n`;

    todos.forEach((todo, idx) => {
        const mandatoryTag = todo.isMandatory ? '🚨 ' : '';
        text += `${idx + 1}. ${mandatoryTag}**${todo.title}**\n`;

        if (todo.showTime && todo.time) {
            const h = String(todo.time.hour).padStart(2, '0');
            const m = String(todo.time.minute).padStart(2, '0');
            text += `   └ ⏰ ${h}:${m}\n`;
        }

        if (todo.isLong && todo.period?.start && todo.period?.end) {
            const startStr = formatDateShort(todo.period.start);
            const endStr = formatDateShort(todo.period.end);
            text += `   └ 🗓️ 기간: ${startStr} ~ ${endStr}\n`;
        }

        const extras = [];
        if (todo.explanation) extras.push(`📝 ${todo.explanation}`);
        if (todo.reflectionRatio) extras.push(`📊 반영비율 ${todo.reflectionRatio}%`);

        if (extras.length > 0) {
            text += `   └ ${extras.join(' | ')}\n`;
        }

        text += '\n';
    });

    return text.trim();
}

function formatDateShort(dateObj) {
    const d = new Date(dateObj);
    return `${d.getMonth() + 1}.${d.getDate()}`;
}

async function getTodos(res, req, targetDate) {
    return Todo.find({
        $or: [
            {
                isLong: false,
                date: targetDate
            },
            {
                isLong: true,
                'period.start': {$lte: targetDate},
                'period.end': {$gte: targetDate}
            }
        ]
    }).sort({'time.hour': 1, 'time.minute': 1, updatedAt: -1});
}

async function makeResponse(res, req, targetDate) {
    const todos = await getTodos(res, req, targetDate);

    const message = formatTodoList(todos, targetDate.getMonth() + 1, targetDate.getDate());

    return res.json({
        version: "2.0",
        template: {
            outputs: [{simpleText: {text: message}}]
        }
    });
}

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const month = parseInt(req.body.action.params.month);
    const day = parseInt(req.body.action.params.day);
    const currentYear = new Date().getFullYear();
    const targetDate = new Date(currentYear, month - 1, day, 0, 0, 0, 0);

    return res.json(await getTodos(res, req, targetDate));
}));

router.post('/today', asyncLogger(__filename, async (req, res, userId) => {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);

    return res.json(await getTodos(res, req, targetDate));
}));

module.exports = router;
