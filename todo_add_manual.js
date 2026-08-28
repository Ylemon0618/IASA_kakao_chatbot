const Todo = require('./models/Todo');
const {saveLog, printError, asyncLogger} = require('./utils/logger');

const createTodo = asyncLogger(__filename, async (inputData) => {
    const {
        year,
        grade,
        classes,
        isLong,
        showTime,
        dateInput,   // 단일 날짜: { year, month, day }
        periodInput, // 기간 날짜: { start: { year, month, day }, end: { year, month, day } }
        timeInput,   // 시간 정보: { hour, minute } (showTime이 true일 때만 입력)
        title,
        explanation,
        reflectionRatio,
        isMandatory
    } = inputData;

    let dateValue = null;
    let periodValue = null;
    let timeValue = null;

    if (isLong) {
        periodValue = {
            start: parseZeroTimeDate(periodInput.start),
            end: parseZeroTimeDate(periodInput.end)
        };
    } else {
        dateValue = parseZeroTimeDate(dateInput);
    }

    if (showTime && timeInput) {
        timeValue = {
            hour: Number(timeInput.hour),
            minute: Number(timeInput.minute)
        };
    }

    const newTodo = new Todo({
        year: Number(year),
        grade: Number(grade),
        classes: Number(classes),
        isLong,
        showTime,
        date: dateValue,
        period: periodValue,
        time: timeValue, // showTime이 false면 null로 저장
        title,
        explanation: explanation || "",
        reflectionRatio: reflectionRatio !== undefined ? Number(reflectionRatio) : null,
        isMandatory,
        updatedAt: new Date()
    });

    const savedTodo = await newTodo.save();
    console.log('Todo successfully saved manually:', savedTodo._id);
    return savedTodo;
});

function parseZeroTimeDate(dateObj) {
    if (!dateObj) return null;
    const {year, month, day} = dateObj;
    return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
}

module.exports = createTodo;
