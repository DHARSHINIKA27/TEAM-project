const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await db.getAll('projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects data' });
  }
});

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, client, completionDate, status, image } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Project title, description, and category are required' });
  }

  try {
    const newProject = await db.insert('projects', {
      title,
      description,
      category,
      client: client || 'Internal Dev',
      completionDate: completionDate || '',
      status: status || 'completed',
      image: image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new project record' });
  }
});

// @route   PUT api/projects/:id
// @desc    Update an existing project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedProject = await db.update('projects', req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project record not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project record' });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('projects', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Project record not found' });
    }
    res.json({ message: 'Project successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project record' });
  }
});

module.exports = router;
