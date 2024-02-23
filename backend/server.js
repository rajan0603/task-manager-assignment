const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const knexfile = require('./knexfile');

const app = express();
const PORT = process.env.PORT || 5000;

const db = knex(knexfile.development);

app.use(cors());
app.use(bodyParser.json());

// Retrieve all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db('tasks').select('*');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    await db('tasks').insert({ title, description });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task's status
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await db('tasks').where({ id }).update({ completed });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db('tasks').where({ id }).del();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

