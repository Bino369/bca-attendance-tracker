
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping string ID to match frontend UUIDs
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Student', studentSchema);
