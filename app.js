require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('./utils/colors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`${colors.green}MongoDB Connected${colors.reset}`))
    .catch(err => console.log(`${colors.red}MongoDB Connection Error:${colors.reset}`, err.message));

const mealRouter = require('./routes/meal');
const scheduleUploadRouter = require('./routes/schedule_upload');
const scheduleSearchRouter = require('./routes/schedule_search');
const scheduleSetRouter = require('./routes/schedule_set');
const scheduleInitRouter = require('./routes/schedule_init');
const goormInitRouter = require('./routes/goorm');
const todoAddRouter = require('./routes/todo_add');
const todoViewRouter = require('./routes/todo_view');

app.use('/api/iasa/meal', mealRouter);
app.use('/api/iasa/schedule/upload', scheduleUploadRouter);
app.use('/api/iasa/schedule/search', scheduleSearchRouter);
app.use('/api/iasa/schedule/set', scheduleSetRouter);
app.use('/api/iasa/schedule/initialize', scheduleInitRouter);
app.use('/api/iasa/goorm', goormInitRouter);
app.use('/api/iasa/todo/add', todoAddRouter);
app.use('/api/iasa/todo/view', todoViewRouter);

const PORT = Number(process.env.PORT) || 25565;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`${colors.blue}-----------------------------------${colors.reset}`);
    console.log(`${colors.white}Server running on port ${PORT}${colors.reset}`);
    console.log(`${colors.blue}-----------------------------------${colors.reset}`);
});
