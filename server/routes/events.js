const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

// 1. Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. CREATE: Add a new event
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, description, date, venue, category, organizer, registrationLink } = req.body;
        
        const newEvent = new Event({
            title,
            description,
            date,
            venue,
            category,
            organizer,
            registrationLink, 
            registrationDeadline: req.body.registrationDeadline,
            image: req.file ? req.file.filename : '', 
            status: 'Pending'
        });

        await newEvent.save();
        res.status(201).json({ msg: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. READ: Get all events
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. READ: Get single event details (Needed for the Edit form)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: "Event not found" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. UPDATE: Update event details
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description, date, venue, category, organizer, registrationLink } = req.body;
        
        // Prepare update object
        let updateData = { title, description, date, venue, category, organizer, registrationLink };

        // If a new image is uploaded, update the image field
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true } // Returns the updated document
        );

        res.json({ msg: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;