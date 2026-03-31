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

router.post('/register', async (req, res) => {
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

    if (saved) {
        res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 시간표가 성공적으로 등록되었습니다.\n\n월요일: ${mondaySaved.schedule.length}교시\n화요일: ${tuesdaySaved.schedule.length}교시\n수요일: ${wednesdaySaved.schedule.length}교시\n목요일: ${thursdaySaved.schedule.length}교시\n금요일: ${fridaySaved.schedule.length}교시`}
                }]
            }
        });
    }
});

module.exports = router;
