const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const mealRouter = require('./routes/meal');
const scheduleUploadRouter = require('./routes/schedule_upload');
const scheduleSearchRouter = require('./routes/schedule_search');

app.use('/api/iasa/meal', mealRouter);
app.use('/api/iasa/schedule/upload', scheduleUploadRouter);
app.use('/api/iasa/schedule/search', scheduleSearchRouter);

const PORT = Number(process.env.PORT) || 25565;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server on ${PORT}`);
});
