import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // matches frontend UUIDs
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
