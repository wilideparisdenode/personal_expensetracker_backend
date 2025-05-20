const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../model/task');
const router = express.Router();

// Middleware to verify token
function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

// Get all tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description,category } = req.body;
  const newTask = new Task({ title, description,category, userId: req.user.id });
  await newTask.save();
  res.status(201).json(newTask);
});

// Edit task
router.put('/:id', auth, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log( "the id of the task is "+req.params.id);
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json( task );
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;