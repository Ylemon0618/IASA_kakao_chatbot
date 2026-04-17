const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');
const saveLog = require('../utils/logger');

async function saveTimetable(userId, day, rawText) {
    try {
        const subjects = rawText.split(' ')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const scheduleData = subjects.map((subject, index) => ({
            period: index + 1,
            subject: subject
        }));

        return await Timetable.findOneAndUpdate(
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
    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving schedule:', error.message);
        return null;
    }
}

async function saveTeacher(userId, day, rawText) {
    try {
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

        return await Timetable.findOneAndUpdate(
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
    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving teacher:', error.message);
        return null;
    }
}

async function saveRoom(userId, day, rawText) {
    try {
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

        return await Timetable.findOneAndUpdate(
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
    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving room:', error.message);
        return null;
    }
}

async function saveRotation(userId, day, period, teacher) {
    try {
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

        return await Timetable.findOneAndUpdate(
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
    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving rotation:', error.message);
        return null;
    }
}

router.post('/name', async (req, res) => {
    saveLog(req);

    const userId = req.body.userRequest.user.id;
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
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `등록에 실패했습니다.`}
                }]
            }
        })
    }
});

router.post('/teacher', async (req, res) => {
    saveLog(req);

    const userId = req.body.userRequest.user.id;
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
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `등록에 실패했습니다.`}
                }]
            }
        })
    }
});

router.post('/room', async (req, res) => {
    saveLog(req);

    const userId = req.body.userRequest.user.id;
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
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `등록에 실패했습니다.`}
                }]
            }
        })
    }
});

router.post('/rotation', async (req, res) => {
    saveLog(req);

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const userId = req.body.userRequest.user.id;
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
        })
    } else {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `등록에 실패했습니다.\n선생님 성함이 맞는지 다시 한번 확인해 주세요.`}
                }]
            }
        })
    }
});

module.exports = router;
