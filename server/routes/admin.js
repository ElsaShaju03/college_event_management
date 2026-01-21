const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/Event');
const adminMiddleware = require('../middleware/adminMiddleware');

// 1. Get Dashboard Stats (Totals for overview)
router.get('/stats', adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const pendingEvents = await Event.countDocuments({ status: 'Pending' });
        res.json({ totalUsers, totalEvents, pendingEvents });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. Get All Users (Categorized list for management)
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Hide passwords for security
        res.json(users);
    } catch (err) {
        res.status(500).send("Failed to fetch users");
    }
});

// 3. Manage Roles (Promote Student → Coordinator/Admin or Revoke)
router.patch('/users/role/:id', adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body; // Expecting 'attendee', 'organizer', or 'admin'
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { new: true }
        ).select('-password');
        
        res.json({ msg: `User role updated to ${role}`, user });
    } catch (err) {
        res.status(500).send("Role update failed");
    }
});

// 4. Activate / Deactivate Users (Block/Unblock access)
router.patch('/users/status/:id', adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body; // Expecting 'Active' or 'Inactive'
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).select('-password');
        
        res.json({ msg: `User is now ${status}`, user });
    } catch (err) {
        res.status(500).send("Status update failed");
    }
});

// 5. Update Event Status (Approve/Reject)
router.patch('/event-status/:id', adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(event);
    } catch (err) {
        res.status(500).send("Update Failed");
    }
});

module.exports = router;