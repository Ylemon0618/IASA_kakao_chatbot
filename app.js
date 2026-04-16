require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.log(`Connecting to MongoDB with URI: ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const mealRouter = require('./routes/meal');
const scheduleUploadRouter = require('./routes/schedule_upload');
const scheduleSearchRouter = require('./routes/schedule_search');
const scheduleSetRouter = require('./routes/schedule_set');
const scheduleInitRouter = require('./routes/schedule_init');
const goormInitRouter = require('./routes/goorm');

app.use('/api/iasa/meal', mealRouter);
app.use('/api/iasa/schedule/upload', scheduleUploadRouter);
app.use('/api/iasa/schedule/search', scheduleSearchRouter);
app.use('/api/iasa/schedule/set', scheduleSetRouter);
app.use('/api/iasa/schedule/initialize', scheduleInitRouter);
app.use('/api/iasa/goorm', goormInitRouter);

const PORT = Number(process.env.PORT) || 25565;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server on ${PORT}`);
});
