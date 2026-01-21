const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // Import admin logic
const galleryRoutes = require('./routes/gallery');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // <--- Added this line to enable Admin APIs
app.use('/api/events', require('./routes/events'));
app.use('/uploads', express.static('uploads'));
app.use('/api/gallery', galleryRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Basic Route to test if API works
app.get('/', (req, res) => {
  res.send("Event Management API is running...");
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});