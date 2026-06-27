const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   POST api/contacts
// @desc    Submit a contact inquiry (Public)
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, company, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required fields' });
  }

  try {
    const newContact = await db.insert('contacts', {
      name,
      email,
      company: company || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'unread'
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact inquiry' });
  }
});

// @route   GET api/contacts
// @desc    Get all contact inquiries (Admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await db.getAll('contacts');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact inquiries' });
  }
});

// @route   PUT api/contacts/:id/read
// @desc    Toggle mark contact inquiry as read/unread (Admin)
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  const { status } = req.body; // expect 'read' or 'unread'
  
  if (!status || !['read', 'unread'].includes(status)) {
    return res.status(400).json({ message: 'Valid status ("read" or "unread") is required' });
  }

  try {
    const updatedContact = await db.update('contacts', req.params.id, { status });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Inquiry record not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact inquiry (Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('contacts', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Inquiry record not found' });
    }
    res.json({ message: 'Contact inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact inquiry' });
  }
});

module.exports = router;
