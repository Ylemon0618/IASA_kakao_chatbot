const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');

router.post('/', async (req, res) => {
    const userId = req.body.userRequest.user.id;
    const grade = req.body.action.params.grade;
    const cls = req.body.action.params.cls;
    const semester = req.body.action.params.semester;

    const scheduleId = grade + cls + semester;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    try {
        const timetables = days.map(async (item) => {
            return Timetable.findOne({userId: scheduleId, day: item}).schedule;
        });

        for (const [index, item] of timetables.entries()) {
            await Timetable.findOneAndUpdate(
                {
                    userId: userId,
                    day: days[index]
                },
                {
                    $set: {
                        schedule: item,
                        updatedAt: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            );
        }

        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `📅 시간표가 성공적으로 설정되었습니다.`}
                }]
            }
        });
    } catch (error) {
        console.log(`An error occured while setting schedule: ${error}`);
        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {text: `등록에 실패했습니다.`}
                }]
            }
        });
    }
});

module.exports = router;
