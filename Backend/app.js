const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://balajipathak:pUo5vnHtW84bZTej@cluster0.himqpss.mongodb.net/realEstate')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const adminloginRoutes = require('./routes/admin');
const agentRoutes =require('./routes/agent');
const propertyRoutes = require('./routes/propertyRoutes');
const dashboardRoutes = require('./routes/dashboard');
const blogRoutes = require('./routes/blog');
const contactRoutes =require('./routes/contact');
const compantinfoRoutes =require('./routes/settings');

app.use('/admin', adminRoutes);
app.use(adminloginRoutes);
app.use(agentRoutes);
app.use('/properties', propertyRoutes);
app.use('/dashboard', dashboardRoutes); 
app.use(blogRoutes);
app.use(contactRoutes);
app.use(compantinfoRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Port configuration
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
