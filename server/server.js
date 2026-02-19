const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- DIAGNOSTIC LOG (Check your terminal for this) ---
console.log("Checking .env file...");
if (!process.env.MONGO_URI) {
    console.log("❌ ERROR: MONGO_URI is NOT found in .env file. Check your file name and path.");
} else {
    console.log("✅ MONGO_URI found in .env file.");
}

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const galleryRoutes = require('./routes/gallery');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', require('./routes/events'));
app.use('/api/gallery', galleryRoutes);

// MongoDB Connection with extra timeout settings
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Fast fail (5 seconds) instead of waiting 30s
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:");
    console.error(err.message);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send("Event Management API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});