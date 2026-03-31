const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const {wrapper} = require('axios-cookiejar-support');
const {CookieJar} = require('tough-cookie');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const jar = new CookieJar();
const client = wrapper(axios.create({jar}));

const BASE_URL = process.env.RIRO_URL;
const LOGIN_URL = process.env.RIRO_LOGIN;
const MEAL_URL = process.env.RIRO_MEAL;

let cachedData = {today: null, tomorrow: null, lastFetch: ""};

function buildRiroUrl(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dbCode = "2303";

    return `${MEAL_URL}?db=${dbCode}&action=day&year=${year}&month=${month}&day=${day}`;
}

async function getIasaMeal(userId, userPw, targetDate) {
    try {
        const loginPayload = qs.stringify({
            'app': 'user', 'mode': 'login', 'userType': 1, 'id': userId, 'pw': userPw
        });

        await client.post(LOGIN_URL, loginPayload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0',
                'Referer': BASE_URL
            }
        });

        const requestUrl = buildRiroUrl(targetDate);
        console.log(`URL 요청: ${requestUrl}`);

        const mealRes = await client.get(requestUrl);
        const $ = cheerio.load(mealRes.data);
        const mealResult = {breakfast: [], lunch: [], dinner: []};

        $('.meal_day_list').each((_, element) => {
            const title = $(element).find('.title').text().trim();
            const menuContainer = $(element).find('.meal_day_popup_btn');
            const menuItems = [];

            menuContainer.find('p').each((__, p) => {
                $(p).find('span').remove();
                let item = $(p).text().trim()
                    .replace(/[0-9.]+(?=$)/g, '')
                    .replace(/_$/g, '')
                    .trim();

                if (item && item !== '자율') menuItems.push(item);
            });
            if (title.includes('조식')) mealResult.breakfast = menuItems;
            else if (title.includes('중식')) mealResult.lunch = menuItems;
            else if (title.includes('석식')) mealResult.dinner = menuItems;
        });

        return mealResult;
    } catch (error) {
        console.error('Error on crawling:', error.message);
        return null;
    }
}

async function startServer() {
    router.post('/search', async (req, res) => {
        console.log("------- Kakao Request received (meal) -------");

        const params = req.body.action.params;
        const now = new Date();
        const todayStr = now.toLocaleDateString();

        if (cachedData.lastFetch !== todayStr) {
            console.log("Data renewal...");
            const tDate = new Date();
            const tmrDate = new Date();
            tmrDate.setDate(tmrDate.getDate() + 1);

            cachedData.today = await getIasaMeal(process.env.RIRO_ID, process.env.RIRO_PW, tDate);
            cachedData.tomorrow = await getIasaMeal(process.env.RIRO_ID, process.env.RIRO_PW, tmrDate);
            cachedData.lastFetch = todayStr;
        }

        const isTomorrow = params && (params.date || params.date_input);
        const data = isTomorrow ? cachedData.tomorrow : cachedData.today;

        if (!data || (data.breakfast.length === 0 && data.lunch.length === 0)) {
            return res.json({
                version: "2.0",
                template: {outputs: [{simpleText: {text: "급식 정보를 불러올 수 없습니다."}}]}
            });
        }

        const response = await makeResponse(data, isTomorrow);
        return res.json(response);
    });

    module.exports = router;
}

function makeResponse(mealData, isTomorrow) {
    const dayLabel = isTomorrow ? "내일" : "오늘";
    const nextDayLabel = isTomorrow ? "오늘" : "내일";

    const formatMenuText = (menuArr) => {
        if (!menuArr || menuArr.length === 0) return "급식 정보가 없습니다.";
        return "🍴 " + menuArr.join("\n🍴 ");
    };

    return {
        version: "2.0",
        template: {
            outputs: [{
                carousel: {
                    type: "textCard",
                    items: [
                        {
                            title: `🌅 ${dayLabel} 조식`,
                            description: formatMenuText(mealData.breakfast),
                            buttons: [
                                {action: "message", label: `${nextDayLabel} 급식 보기`, messageText: `${nextDayLabel} 급식 알려줘`}
                            ]
                        },
                        {
                            title: `☀️ ${dayLabel} 중식`,
                            description: formatMenuText(mealData.lunch),
                            buttons: [
                                {action: "webLink", label: "리로스쿨 바로가기", webLinkUrl: BASE_URL}
                            ]
                        },
                        {
                            title: `🌙 ${dayLabel} 석식`,
                            description: formatMenuText(mealData.dinner),
                            buttons: [
                                {action: "webLink", label: "리로스쿨 바로가기", webLinkUrl: BASE_URL}
                            ]
                        },
                    ]
                }
            }]
        }
    };
}

startServer();
