import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db';

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

// ===== Fix Vercel DB reconnect =====
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Error:', err);
  }
};

// Connect before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Export for Vercel serverless function
export default app;

// Local server (NOT used on Vercel)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Local server running at http://localhost:${PORT}`);
    });
  });
}
