
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get attendance (optional filter by date)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      query.date = date;
    }
    const records = await Attendance.find(query);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark or Update attendance
// Expects body: { studentId, date, timeSlot, present }
router.post('/', async (req, res) => {
  const { studentId, date, timeSlot, present } = req.body;

  try {
    // Upsert: Update if exists, Insert if new
    const record = await Attendance.findOneAndUpdate(
      { studentId, date, timeSlot },
      { present },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
