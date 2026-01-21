const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Prevents duplicate emails
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['attendee', 'organizer'],
        default: 'attendee'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
}
});

module.exports = mongoose.model('User', UserSchema);