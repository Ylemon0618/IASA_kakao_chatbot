const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');
const {saveLog, printError, asyncLogger} = require('../utils/logger');

router.post('/', asyncLogger(__filename, async (req, res, userId) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const {grade, cls, semester} = req.body.action.params;
    const scheduleId = grade + cls + semester;

    const timetableDocs = await Promise.all(
        days.map(day => Timetable.findOne({userId: scheduleId, day: day}))
    );

    for (let i = 0; i < days.length; i++) {
        const sourceDoc = timetableDocs[i];

        if (sourceDoc && sourceDoc.schedule) {
            await Timetable.findOneAndUpdate(
                {userId: userId, day: days[i]},
                {
                    $set: {
                        schedule: sourceDoc.schedule,
                        updatedAt: new Date()
                    }
                },
                {upsert: true}
            );
        }
    }

    return res.json({
        version: "2.0",
        template: {
            outputs: [{
                simpleText: {text: `📅 ${grade}학년 ${cls}반 시간표가 성공적으로 설정되었습니다.`}
            }]
        }
    });
}));

module.exports = router;
