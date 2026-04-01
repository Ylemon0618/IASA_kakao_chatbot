const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');

async function saveTimetable(userId, day, rawText) {
    try {
        const subjects = rawText.split(' ')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const scheduleData = subjects.map((subject, index) => ({
            period: index + 1,
            subject: subject
        }));

        const result = await Timetable.findOneAndUpdate(
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

        console.log(`${day} schdule save completed: ${subjects.length} of periods saved`);
        return result;

    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving schedule:', error.message);
        return null;
    }
}

async function saveTeacher(userId, day, rawText) {
    try {
        const timetable = await Timetable.findOne({userId: userId, day: day});

        if (!timetable) {return null;}

        const teachers = rawText.split(' ')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        timetable.schedule = timetable.schedule.map((item, index) => {
            return {
                period: item.period,
                subject: item.subject,
                teacher: teachers[index]
            }
        });
        timetable.updatedAt = new Date();
        await timetable.save();

        console.log(`${day} teacher save completed: ${teachers.length} of periods saved`);
        return timetable.schedule;

    } catch (error) {
        console.error('Error on ./routes/schdule.js while saving teacher:', error.message);
        return null;
    }
}

router.post('/register/name', async (req, res) => {
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
    }
    else {
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

router.post('/register/teacher', async (req, res) => {
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
    console.log(mondaySaved)

    if (mondaySaved && tuesdaySaved && wednesdaySaved && thursdaySaved && fridaySaved) {
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 선생님 성함이 성공적으로 등록되었습니다.`}
                }]
            }
        });
    }
    else {
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

module.exports = router;
