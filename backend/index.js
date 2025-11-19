
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';

import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db';

// Middleware
app.use(cors({
    origin: "*", // Configure appropriately for production if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// --- Optimized Database Connection for Serverless ---

// Use global cache to preserve connection across hot reloads in dev
// and warm starts in serverless environments.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering for serverless to fail fast if not connected
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.get('/', (req, res) => {
    res.send('Attendance API is running');
});

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Export the app for Vercel (Serverless)
export default app;

// Start Server only if running directly (Local Development)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}
