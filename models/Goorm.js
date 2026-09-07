const mongoose = require('mongoose');

const goormSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true,
    },
    problems: [
        {
            number: {
                type: Number,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Goorm', goormSchema);
