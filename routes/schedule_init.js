const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');

router.post('/', async (req, res) => {
    const userId = req.body.userRequest.user.id;

    try {
        const result = await Timetable.deleteMany({ userId: userId });

        if (result.deletedCount === 0) {
            return res.json({
                version: "2.0",
                template: {
                    outputs: [{ simpleText: { text: "이미 등록된 시간표가 없거나 삭제할 데이터가 없습니다." } }]
                }
            });
        }

        return res.json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: { text: `🗑️ 모든 시간표 데이터가 초기화되었습니다.\n(총 ${result.deletedCount}개의 요일 데이터 삭제)` }
                }]
            }
        });
    } catch (error) {
        console.error('Reset Error:', error);
        return res.json({
            version: "2.0",
            template: {
                outputs: [{ simpleText: { text: "시간표 초기화 중 오류가 발생했습니다." } }]
            }
        });
    }
});

module.exports = router;
