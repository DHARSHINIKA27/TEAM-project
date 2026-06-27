const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/services
// @desc    Get all active services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await db.getAll('services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services data' });
  }
});

// @route   POST api/services
// @desc    Create a new service
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, icon, details, status } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Service name and description are required' });
  }

  try {
    const newService = await db.insert('services', {
      name,
      description,
      icon: icon || 'Settings',
      details: details || '',
      status: status || 'active'
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new service record' });
  }
});

// @route   PUT api/services/:id
// @desc    Update an existing service
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedService = await db.update('services', req.params.id, req.body);
    if (!updatedService) {
      return res.status(404).json({ message: 'Service record not found' });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service record' });
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('services', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Service record not found' });
    }
    res.json({ message: 'Service successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service record' });
  }
});

module.exports = router;
