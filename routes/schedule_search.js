const express = require('express');
const router = express.Router();
const Timetable = require('../models/Schedule');

function getRotatedTeacher(teachers, startDate, offset = 0) {
    if (!Array.isArray(teachers) || teachers.length <= 1) return teachers[0] || "미지정";

    if (!startDate) return null

    const today = new Date();
    const diffInMs = today - new Date(startDate);

    const passedWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const teacherIndex = (passedWeeks + offset) % teachers.length;

    return teachers[teacherIndex];
}

async function getSchedules(req, res, isTomorrow = False) {
    try {
        const userId = req.body.userRequest.user.id;

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const daysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const scheduleDayIndex = (isTomorrow ? new Date().getDay() + 1 : new Date().getDay()) % 7;
        const scheduleDay = days[scheduleDayIndex];
        const scheduleDayKo = daysKo[scheduleDayIndex];

        const data = await Timetable.findOne({userId: userId, day: scheduleDay});

        if (!data || !data.schedule || data.schedule.length === 0) {
            let messageText = `📅 ${isTomorrow ? "내일" : "오늘"}(${scheduleDay})은 등록된 시간표가 없습니다.`;
            if (scheduleDayIndex > 0 && scheduleDayIndex <= 5) messageText += `주중 시간표를 설정하려면 아래 버튼을 클릭 해 주세요.`;

            let temp = {
                outputs: [{
                    simpleText: {
                        text: messageText
                    }
                }]
            }
            if (scheduleDayIndex > 0 && scheduleDayIndex <= 5) temp.quickReplies = [
                {label: "시간표 설정하기", action: "message", messageText: "시간표 등록하기"}
            ]

            return res.json({
                version: "2.0",
                template: temp
            });
        }

        return data.schedule.slice(0, 9).map((item) => {
            const teacher = getRotatedTeacher(item.teacher, item.rotationDate);

            let items = {
                imageTitle: {
                    title: `${item.period}교시: ${item.subject}`,
                    description: `IASA Schedule`,
                },
                itemList: [
                    {
                        title: "담당 교사",
                        description: teacher || `${item.teacher.join('/')}`
                    },
                    {title: "수업 장소", description: item.room || "미지정"}
                ],
            };

            if (!teacher) {
                items.description = "현재 주차의 담당 교사를 지정하려면 아래 버튼을 클릭 해 주세요."
                items.buttons = [
                    {
                        action: "message",
                        label: `이번주 담당 교사 지정하기`,
                        messageText: `${scheduleDayKo} ${item.period}교시 담당 교사 지정해줘`
                    }
                ]
            }

            return items
        });
    } catch (error) {
        console.error('error while searching schedule:', err);
        return null;
    }
}

router.post('/day', async (req, res) => {
    const isTomorrow = req.body.action.params.isTomorrow === "true";
    const carouselItems = await getSchedules(req, res, isTomorrow);
    console.log(carouselItems);

    if (!carouselItems) {
        return res.json({
            version: "2.0",
            template: {outputs: [{simpleText: {text: "시간표를 불러오는 중 서버 오류가 발생했습니다."}}]}
        });
    }

    return res.json({
        version: "2.0",
        template: {
            outputs: [
                {
                    carousel: {
                        type: "itemCard",
                        items: carouselItems
                    }
                }
            ],
            quickReplies: [
                {label: "오늘 시간표 보기", action: "message", messageText: "오늘 시간표 알려줘"},
                {label: "급식 확인하기", action: "message", messageText: "내일 급식 뭐야"}
            ]
        }
    });
});

module.exports = router;
