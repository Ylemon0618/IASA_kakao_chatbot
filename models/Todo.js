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
    date: {
        type: Date,
        required: false,
    },
    period: {
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
        required: false,
    },

    title: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: false,
    },
    reflectionRatio: {
        type: Number,
        required: false,
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
