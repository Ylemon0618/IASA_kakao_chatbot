const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');
const {saveLog, printError, asyncLogger} = require('../utils/logger');

const saveTimetable = asyncLogger(__filename, async (userId, day, rawText) => {
    const subjects = rawText.split(' ')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    const scheduleData = subjects.map((subject, index) => ({
        period: index + 1,
        subject: subject
    }));

    return Timetable.findOneAndUpdate(
        {
            userId: userId,
            day: day
        },
        {
            $set: {
                schedule: scheduleData,
                updatedAt: new Date()
            }
        },
        {
            upsert: true,
            new: true
        }
    );
});

const saveTeacher = asyncLogger(__filename, async (userId, day, rawText) => {
    const timetable = await Timetable.findOne({userId: userId, day: day})

    const teachers = rawText.split(' ')
        .map(item => item.trim())
        .map(item => item.split('/'))
        .filter(item => item.length > 0);

    const scheduleData = timetable.schedule.map((item, index) => ({
        period: item.period,
        subject: item.subject,
        teacher: teachers[index],
        rotationDate: item.rotationDate,
        room: item.room
    }));

    return Timetable.findOneAndUpdate(
        {
            userId: userId,
            day: day
        },
        {
            $set: {
                schedule: scheduleData,
                updatedAt: new Date()
            }
        },
        {
            upsert: true,
            new: true
        }
    );
});

const saveRoom = asyncLogger(__filename, async (userId, day, rawText) => {
    const timetable = await Timetable.findOne({userId: userId, day: day})

    const rooms = rawText.split(' ')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    const scheduleData = timetable.schedule.map((item, index) => ({
        period: item.period,
        subject: item.subject,
        teacher: item.teacher,
        rotationDate: item.rotationDate,
        room: rooms[index]
    }));

    return Timetable.findOneAndUpdate(
        {
            userId: userId,
            day: day
        },
        {
            $set: {
                schedule: scheduleData,
                updatedAt: new Date()
            }
        },
        {
            upsert: true,
            new: true
        }
    );
});

const saveRotation = asyncLogger(__filename, async (userId, day, period, teacher) => {
    const timetable = await Timetable.findOne({userId: userId, day: day})
    const teachers = timetable.schedule[period - 1].teacher;

    if (!teachers.includes(teacher)) return null;

    const teacherIndex = teachers.indexOf(teacher);

    const now = new Date();
    const date = new Date();
    date.setDate(now.getDate() - 7 * teacherIndex - 1);
    date.setHours(0, 0, 0, 0);

    let scheduleData = timetable.schedule;
    scheduleData[period - 1].rotationDate = date;

    return Timetable.findOneAndUpdate(
        {
            userId: userId,
            day: day
        },
        {
            $set: {
                schedule: scheduleData,
                updatedAt: new Date()
            }
        },
        {
            upsert: true,
            new: true
        }
    );
});

router.post('/name', asyncLogger(__filename, async (req, res, userId) => {
    const mondaySchedule = req.body.action.params.monday;
    const tuesdaySchedule = req.body.action.params.tuesday;
    const wednesdaySchedule = req.body.action.params.wednesday;
    const thursdaySchedule = req.body.action.params.thursday;
    const fridaySchedule = req.body.action.params.friday;

    const mondaySaved = await saveTimetable(userId, "monday", mondaySchedule);
    const tuesdaySaved = await saveTimetable(userId, "tuesday", tuesdaySchedule);
    const wednesdaySaved = await saveTimetable(userId, "wednesday", wednesdaySchedule);
    const thursdaySaved = await saveTimetable(userId, "thursday", thursdaySchedule);
    const fridaySaved = await saveTimetable(userId, "friday", fridaySchedule);

    if (mondaySaved && tuesdaySaved && wednesdaySaved && thursdaySaved && fridaySaved) {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 시간표가 성공적으로 등록되었습니다.`}
                }]
            }
        });
    } else {
        return printError(
            __filename,
            `Error on ${__filename}: while saving name`,
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        )
    }
}));

router.post('/teacher', asyncLogger(__filename, async (req, res, userId) => {
    const mondaySchedule = req.body.action.params.monday;
    const tuesdaySchedule = req.body.action.params.tuesday;
    const wednesdaySchedule = req.body.action.params.wednesday;
    const thursdaySchedule = req.body.action.params.thursday;
    const fridaySchedule = req.body.action.params.friday;

    const mondaySaved = await saveTeacher(userId, "monday", mondaySchedule);
    const tuesdaySaved = await saveTeacher(userId, "tuesday", tuesdaySchedule);
    const wednesdaySaved = await saveTeacher(userId, "wednesday", wednesdaySchedule);
    const thursdaySaved = await saveTeacher(userId, "thursday", thursdaySchedule);
    const fridaySaved = await saveTeacher(userId, "friday", fridaySchedule);

    if (mondaySaved && tuesdaySaved && wednesdaySaved && thursdaySaved && fridaySaved) {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 선생님 성함이 성공적으로 등록되었습니다.`}
                }]
            }
        });
    } else {
        return printError(
            __filename,
            `Error on ${__filename}: while saving teacher`,
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        )
    }
}));

router.post('/room', asyncLogger(__filename, async (req, res, userId) => {
    const mondaySchedule = req.body.action.params.monday;
    const tuesdaySchedule = req.body.action.params.tuesday;
    const wednesdaySchedule = req.body.action.params.wednesday;
    const thursdaySchedule = req.body.action.params.thursday;
    const fridaySchedule = req.body.action.params.friday;

    const mondaySaved = await saveRoom(userId, "monday", mondaySchedule);
    const tuesdaySaved = await saveRoom(userId, "tuesday", tuesdaySchedule);
    const wednesdaySaved = await saveRoom(userId, "wednesday", wednesdaySchedule);
    const thursdaySaved = await saveRoom(userId, "thursday", thursdaySchedule);
    const fridaySaved = await saveRoom(userId, "friday", fridaySchedule);

    if (mondaySaved && tuesdaySaved && wednesdaySaved && thursdaySaved && fridaySaved) {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 수업 장소가 성공적으로 등록되었습니다.`}
                }]
            }
        });
    } else {
        return printError(
            __filename,
            `Error on ${__filename}: while saving room`,
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        )
    }
}));

router.post('/rotation', asyncLogger(__filename, async (req, res, userId) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const day = days[daysKo.indexOf(req.body.action.params.day)];
    const period = parseInt(req.body.action.params.period[0]);
    const teacher = req.body.action.params.teacher;

    const saved = await saveRotation(userId, day, period, teacher);

    if (saved) {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 이번 주차의 선생님이 성공적으로 등록되었습니다.`}
                }]
            }
        });
    } else {
        return printError(
            __filename,
            `Error on ${__filename}: while saving rotation`,
            '오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        )
    }
}));

module.exports = router;
