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

    if (!mondaySchedule) {
        return res.json({version: "2.0", template: {outputs: [{simpleText: {text: "내용을 입력해주세요."}}]}});
    }

    const saved = await saveTimetable(userId, "monday", mondaySchedule);

    if (saved) {
        res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 시간표가 ${saved.schedule.length}교시까지 정상 등록되었습니다.`}
                }]
            }
        });
    }
});

module.exports = router;
