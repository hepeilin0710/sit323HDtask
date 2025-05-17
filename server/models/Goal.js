const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkins: [{
        date: {
            type: Date,
            required: true
        },
        note: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal; 