const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');
const { saveLog, printError } = require('../utils/logger');

router.post('/', async (req, res) => {
    await saveLog(req);

    const userId = req.body.userRequest.user.id;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const {grade, cls, semester} = req.body.action.params;
    const scheduleId = grade + cls + semester;

    try {
        const timetableDocs = await Promise.all(
            days.map(day => Timetable.findOne({ userId: scheduleId, day: day }))
        );

        for (let i = 0; i < days.length; i++) {
            const sourceDoc = timetableDocs[i];

            if (sourceDoc && sourceDoc.schedule) {
                await Timetable.findOneAndUpdate(
                    { userId: userId, day: days[i] },
                    {
                        $set: {
                            schedule: sourceDoc.schedule,
                            updatedAt: new Date()
                        }
                    },
                    { upsert: true }
                );
            }
        }

        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: { text: `📅 ${grade}학년 ${cls}반 시간표가 성공적으로 설정되었습니다.` }
                }]
            }
        });

    } catch (error) {
        return res.json(printError(
            './routes/schedule_set.js',
            error,
            '시간표 설정 도중 오류가 발생했습니다.\n잠시 후에 다시 시도 해 주세요.'
        ));
    }
});

module.exports = router;
