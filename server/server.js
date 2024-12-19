const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Enable CORS for specific origins
const allowedOrigins = ["http://13.201.89.59:5000"];  // Frontend's IP/Domain
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests from the allowed origins or no origin (for local testing)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow cookies (if needed)
}));


// Serve the React app from the 'build' folder
const buildpath = path.join(__dirname, "../client/dist");
app.use(express.static(buildpath));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/uploads", express.static("uploads"));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Serve React app for all other routes (to handle front-end routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildpath, 'index.html'));
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});