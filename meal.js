const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const BASE_URL = process.env.RIRO_URL;
const LOGIN_URL = process.env.RIRO_LOGIN;
const MEAL_URL = process.env.RIRO_MEAL;

const PORT = parseInt(process.env.PORT);

async function getIasaMeal(userId, userPw) {
    try {
        const loginPayload = qs.stringify({
            'app': 'user',
            'mode': 'login',
            'userType': 1,
            'id': userId,
            'pw': userPw
        });

        // 로그인 요청
        await client.post(LOGIN_URL, loginPayload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': BASE_URL
            }
        });

        // 급식 페이지 요청
        const mealRes = await client.get(MEAL_URL);

        // // 로그인 실패 체크
        // if (mealRes.data.includes('login_check') || !mealRes.data.includes('meal_day_list')) {
        //     throw new Error('로그인 세션을 가져오지 못했거나 급식 데이터가 없습니다.');
        // }

        // HTML 파싱
        const $ = cheerio.load(mealRes.data);
        const mealResult = { breakfast: [], lunch: [], dinner: [] };

        $('.meal_day_list').each((_, element) => {
            const title = $(element).find('.meal_day_view_top .title').text().trim();
            const menuContainer = $(element).find('.meal_day_popup_btn');

            const menuItems = [];
            menuContainer.find('p').each((_, p) => {
                let item;

                $(p).find('span').remove();
                item = $(p).text().trim();

                item = item.replace(/[0-9.]+(?=$)/g, '')
                    .replace(/_$/g, '')
                    .trim();

                if (item && item !== '자율') {
                    menuItems.push(item);
                }
            });

            if (title.includes('조식')) mealResult.breakfast = menuItems;
            else if (title.includes('중식')) mealResult.lunch = menuItems;
            else if (title.includes('석식')) mealResult.dinner = menuItems;
        });

        return mealResult;

    } catch (error) {
        console.error('에러 발생:', error.message);
        return null;
    }
}

async function startServer() {
    let cachedMeal = null;
    let lastFetchDate = "";

    try {
        app.post('/api/iasa/meal', async (req, res) => {
            console.log("------- 카카오톡 요청 수신 -------");

            const today = new Date().toLocaleDateString();

            if (cachedMeal && lastFetchDate === today) {
                return res.json(makeResponse(cachedMeal));
            }

            const data = await getIasaMeal(process.env.RIRO_ID, process.env.RIRO_PW);

            if (!data) {
                return res.json({
                    version: "2.0",
                    template: {outputs: [{simpleText: {text: "급식 정보를 가져오는 데 실패했습니다."}}]}
                });
            }
            else {
                cachedMeal = data
                lastFetchDate = today;
                return res.json(makeResponse(data));
            }
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server on ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

async function makeResponse(mealData) {
    return {
        version: "2.0",
        template: {
            outputs: [
                {
                    carousel: {
                        type: "itemCard",
                        items: [
                            {
                                imageTitle: {
                                    title: "🌅 오늘의 조식",
                                    description: "Incheon Academy of Science and Arts"
                                },
                                title: "",
                                description: "",
                                itemList: mealData.breakfast.map(menu => ({title: "메뉴", description: menu})),
                                buttons: [
                                    {action: "webLink", label: "리로스쿨 보기", webLinkUrl: BASE_URL}
                                ]
                            },
                            {
                                imageTitle: {
                                    title: "☀️ 오늘의 중식",
                                    description: "Incheon Academy of Science and Arts"
                                },
                                title: "",
                                description: "",
                                itemList: mealData.lunch.map(menu => ({title: "메뉴", description: menu})),
                                buttons: [
                                    {action: "webLink", label: "리로스쿨 보기", webLinkUrl: BASE_URL}
                                ]
                            },
                            {
                                imageTitle: {
                                    title: "🌙 오늘의 석식",
                                    description: "Incheon Academy of Science and Arts"
                                },
                                title: "",
                                description: "",
                                itemList: mealData.dinner.map(menu => ({title: "메뉴", description: menu})),
                                buttons: [
                                    {action: "webLink", label: "리로스쿨 보기", webLinkUrl: BASE_URL}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    };
}

startServer();
