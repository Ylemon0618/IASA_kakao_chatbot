const mongoose = require('mongoose');

const goormSchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Goorm', goormSchema);
