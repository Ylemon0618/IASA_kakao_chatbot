const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    schedule: [
        {
            period: Number,
            subject: String,
            teacher: Array,
            rotationDate: Date,
            room: String,
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Timetable', timetableSchema);
