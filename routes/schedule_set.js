const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');

router.post('/', async (req, res) => {
    const userId = req.body.userRequest.user.id;
    const { grade, cls, semester } = req.body.action.params;

    const scheduleId = grade + cls + semester; // 공용 시간표 ID (예: 111)
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    try {
        // 1. 모든 요일의 데이터를 병렬로 가져옵니다.
        const timetableDocs = await Promise.all(
            days.map(day => Timetable.findOne({ userId: scheduleId, day: day }))
        );

        // 2. 루프를 돌며 유저 개인 시간표로 복사합니다.
        for (let i = 0; i < days.length; i++) {
            const sourceDoc = timetableDocs[i];

            // 원본 데이터가 있을 때만 복사 진행
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
        console.error(`An error occurred while setting schedule: ${error}`);
        return res.json({
            version: "2.0",
            template: { outputs: [{ simpleText: { text: `등록에 실패했습니다. (사유: ${error.message})` } }] }
        });
    }
});

module.exports = router;
