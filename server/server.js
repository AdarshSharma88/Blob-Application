const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Configure allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5000', // if you're running the frontend locally
  'http://13.201.89.59:5000', // Your production domain/IP for the frontend
  'http://13.201.89.59:5173', // Your production domain/IP for the frontend
];

// Enable CORS with the above allowed origins
app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // allow no-origin requests (like Postman or direct API testing)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow cookies to be sent with requests (if necessary)
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

// Listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});