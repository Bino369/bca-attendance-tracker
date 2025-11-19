
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping string ID to match frontend UUIDs
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true }
});

export default mongoose.model('Student', studentSchema);
