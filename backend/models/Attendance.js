import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true },
  present: { type: Boolean, required: true }
});

// Compound index to ensure one record per student per slot per day
attendanceSchema.index({ studentId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
