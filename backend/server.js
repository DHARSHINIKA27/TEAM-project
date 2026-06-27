const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware for debugging request matching
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const careerRoutes = require('./routes/careers');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contacts');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'Enterprise IT Platform API' });
});

// Catch-all 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API Endpoint ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred', error: err.message });
});

// Connect to MongoDB
const { connectDB } = require('./db');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  Enterprise IT Server Running on Port: ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}).catch(error => {
  console.error('Failed to start server due to connection error:', error);
});

