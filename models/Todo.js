const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    classes: {
        type: Number,
        required: true,
    },

    isLong: {
        type: Boolean,
        required: true,
    },
    showTime: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
    },
    period: {
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
    },
    time: {
        hour: {
            type: Number
        },
        minute: {
            type: Number
        }
    },

    title: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
    reflectionRatio: {
        type: Number,
    },

    isMandatory: {
        type: Boolean,
        required: true,
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', todoSchema);
