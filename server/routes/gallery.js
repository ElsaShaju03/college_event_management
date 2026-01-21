const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const adminMiddleware = require('../middleware/adminMiddleware');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 1. GET ALL GALLERY ITEMS (Public)
router.get('/all', async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. UPLOAD TO GALLERY (Admin Only)
router.post('/upload', adminMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { title, category, mediaType } = req.body;
        const newItem = new Gallery({
            title,
            category,
            mediaType,
            fileUrl: req.file.filename
        });
        await newItem.save();
        res.status(201).json({ msg: "Media uploaded to gallery!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;