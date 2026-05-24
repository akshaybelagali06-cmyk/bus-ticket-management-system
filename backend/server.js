const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/passes', require('./routes/passRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bus Pass Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚌 Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

