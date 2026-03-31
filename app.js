const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const mealRouter = require('./routes/meal');
// const timetableRouter = require('./routes/timetable');

app.use('/api/iasa/meal', mealRouter);
// app.use('/api/timetable', timetableRouter);

const PORT = Number(process.env.PORT) || 25565;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server on ${PORT}`);
});
