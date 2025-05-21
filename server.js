const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./passport-setup'); // Adjust path as necessary
const router=require("./router/auth")
 const task_router =require("./router/task")


const app = express();

app.use((cors({
  origin: true, // Allow all origins (or specify your frontend URLs)
  credentials: true, // Required for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})));
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route setup
app.use('/api/', router); // Use '/api/auth' for auth routes
app.use('/api/tasks', task_router); // Ensure this route exists

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));