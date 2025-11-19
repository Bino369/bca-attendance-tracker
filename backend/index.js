
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';

import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Environment Configuration ---

// Check if running on Vercel to prevent localhost fallback in production
const isVercel = !!process.env.VERCEL;
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (isVercel) {
    // We are on Vercel, but no MONGODB_URI is set.
    // explicitly set to null to trigger Offline Mode handling in middleware
    // and prevent attempting to connect to localhost (which fails).
    console.warn("Vercel environment detected. MONGODB_URI is missing. API will run in Offline Mode.");
    MONGODB_URI = null;
  } else {
    // Local development
    console.log("Local development detected. Using localhost MongoDB.");
    MONGODB_URI = 'mongodb://localhost:27017/attendance_db';
  }
}

// Middleware
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// --- Database Connection ---

// Global cache for serverless hot-reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If URI is null (Offline Mode), return null immediately.
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Connection Error:', e.message);
    throw e;
  }

  return cached.conn;
};

// Middleware to ensure DB is connected or handle offline state
app.use(async (req, res, next) => {
  // Skip for Health checks or OPTIONS
  if (req.method === 'OPTIONS' || req.path === '/') {
     return next();
  }

  try {
    const conn = await connectDB();
    
    if (!conn) {
       // Graceful fallback if DB is not configured (Offline Mode)
       return res.status(503).json({ 
         message: 'Service Unavailable: Database not configured. Application is in Offline Mode.',
         offline: true 
       });
    }
    
    next();
  } catch (err) {
    console.error("Database Error:", err.message);
    // Return 503 so frontend handles it as "Offline" rather than a generic 500 crash
    res.status(503).json({ 
        message: 'Database connection failed', 
        error: err.message,
        offline: true 
    });
  }
});

// Routes
app.get('/', (req, res) => {
    res.send('Attendance API is running');
});

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

export default app;

// Start Server (Local Development only)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(e => {
        console.error("Failed to connect to DB on startup:", e);
        // Allow server to start even if DB fails locally
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (Offline Mode)`);
        });
    });
}
