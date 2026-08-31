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

async function getTodos(targetDate) {
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

async function makeResponse(targetDate) {
    const todos = await getTodos(targetDate);

    const message = formatTodoList(todos, targetDate.getMonth() + 1, targetDate.getDate());

    return {
        version: "2.0",
        template: {
            outputs: [{simpleText: {text: message}}]
        }
    };
}

async function getUrgentTodos() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Todo.find({
        $or: [
            {
                isLong: false,
                date: { $gte: today }
            },
            {
                isLong: true,
                'period.end': { $gte: today }
            }
        ]
    })
        .sort({
            date: 1,
            'period.start': 1,
            'time.hour': 1,
            'time.minute': 1
        })
        .limit(5);
}

function makeUrgentResponse(todos) {
    if (!todos || todos.length === 0) {
        return {
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {
                        text: "📅 다가오는 일정이 없습니다."
                    }
                }]
            }
        };
    }

    const items = todos.map((todo) => {
        const mandatoryTag = todo.isMandatory ? '🚨 ' : '📌 ';
        const cardTitle = `${mandatoryTag}${todo.title}`;

        const descParts = [];

        if (todo.isLong && todo.period?.start && todo.period?.end) {
            const startStr = formatDateShort(todo.period.start);
            const endStr = formatDateShort(todo.period.end);
            descParts.push(`🗓️ 기간: ${startStr} ~ ${endStr}`);
        } else if (todo.date) {
            const dateStr = formatDateShort(todo.date);
            descParts.push(`📅 날짜: ${dateStr}`);
        }

        if (todo.showTime && todo.time) {
            const h = String(todo.time.hour).padStart(2, '0');
            const m = String(todo.time.minute).padStart(2, '0');
            descParts.push(`⏰ 시간: ${h}:${m}`);
        }

        if (todo.explanation) descParts.push(`📝 ${todo.explanation}`);
        if (todo.reflectionRatio) descParts.push(`📊 반영비율: ${todo.reflectionRatio}%`);

        return {
            title: cardTitle,
            description: descParts.join('\n')
        };
    });

    return {
        version: "2.0",
        template: {
            outputs: [{
                carousel: {
                    type: "textCard",
                    items: items
                }
            }],
            quickReplies: [
                {action: "message", label: `오늘 일정 확인하기`, messageText: `오늘 일정 확인하기`},
                {action: "message", label: `내일 일정 확인하기`, messageText: `내일 일정 확인하기`}
            ]
        }
    };
}

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const month = parseInt(req.body.action.params.month);
    const day = parseInt(req.body.action.params.day);
    const currentYear = new Date().getFullYear();
    const targetDate = new Date(currentYear, month - 1, day, 0, 0, 0, 0);

    return res.json(await makeResponse(targetDate));
}));

router.post('/today', asyncLogger(__filename, async (req, res, userId) => {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);

    return res.json(await makeResponse(targetDate));
}));

router.post('/tomorrow', asyncLogger(__filename, async (req, res, userId) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    return res.json(await makeResponse(targetDate));
}));

router.post('/urgent', asyncLogger(__filename, async (req, res, userId) => {
    const urgentTodos = await getUrgentTodos();
    const responseJson = makeUrgentResponse(urgentTodos);

    return res.json(responseJson);
}));

module.exports = router;
