const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const blogRoutes = require('./routes/blogRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your frontend origin
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,  // Allow cookies and other credentials
  allowedHeaders: 'Content-Type,Authorization'
}));

// Routes
app.use('/uploads', express.static('uploads'));

app.use('/api/blog', blogRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
