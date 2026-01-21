const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    organizer: { type: String, required: true },
    registrationDeadline: { type: Date, required: true }, // Add this line
    registrationLink: { type: String, required: true },
    image: { type: String }, // <--- This stores the filename of the cover photo
    status: { type: String, default: 'Pending' }, 
    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Event', EventSchema);