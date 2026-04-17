const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    utterance: String,
    blockName: String,
    params: Object,
    timestamp: {type: Date, default: Date.now},
    platform: {type: String, default: "kakao"}
});

module.exports = mongoose.model('Log', logSchema);
