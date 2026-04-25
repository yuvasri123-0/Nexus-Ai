const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Root route (Requirement #1)
app.get('/', (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    message: "API is running"
  });
});

// API Health Check (Requirement #1)
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// AI Routes
app.use('/api', aiRoutes);

// Error Handling (Requirement #5)
app.use(errorHandler);

module.exports = app;
