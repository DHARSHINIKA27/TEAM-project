const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ==================== JOB OPENINGS ====================

// @route   GET api/careers
// @desc    Get all active job listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const careers = await db.getAll('careers');
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving careers data' });
  }
});

// @route   POST api/careers
// @desc    Create a new job listing
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, department, location, type, description, requirements, status } = req.body;

  if (!title || !department || !location || !type) {
    return res.status(400).json({ message: 'Title, Department, Location, and Job Type are required' });
  }

  try {
    const newCareer = await db.insert('careers', {
      title,
      department,
      location,
      type,
      description: description || '',
      requirements: requirements || '',
      status: status || 'active'
    });
    res.status(201).json(newCareer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new career listing' });
  }
});

// @route   PUT api/careers/:id
// @desc    Update a job listing
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedCareer = await db.update('careers', req.params.id, req.body);
    if (!updatedCareer) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    res.json(updatedCareer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating career listing' });
  }
});

// @route   DELETE api/careers/:id
// @desc    Delete a job listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('careers', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    res.json({ message: 'Job listing successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job listing' });
  }
});


// ==================== APPLICATIONS ====================

// @route   POST api/careers/apply
// @desc    Apply for a job (Public)
// @access  Public
router.post('/apply', async (req, res) => {
  const { jobId, applicantName, email, phone, coverLetter, resumeLink } = req.body;

  if (!jobId || !applicantName || !email) {
    return res.status(400).json({ message: 'Job ID, applicant name, and email are required' });
  }

  try {
    const job = await db.getById('careers', jobId);
    const jobTitle = job ? job.title : 'General Inquiry / Unknown Position';

    const newApplication = await db.insert('applications', {
      jobId,
      jobTitle,
      applicantName,
      email,
      phone: phone || '',
      coverLetter: coverLetter || '',
      resumeLink: resumeLink || '',
      status: 'pending',
      appliedDate: new Date().toISOString()
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Error processing job application' });
  }
});

// @route   GET api/careers/applications
// @desc    Get all job applications (Admin)
// @access  Private
router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await db.getAll('applications');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving job applications' });
  }
});

// @route   PUT api/careers/applications/:id
// @desc    Update application status (Admin)
// @access  Private
router.put('/applications/:id', auth, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const updated = await db.update('applications', req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status' });
  }
});

// @route   DELETE api/careers/applications/:id
// @desc    Delete a job application (Admin)
// @access  Private
router.delete('/applications/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('applications', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Application record not found' });
    }
    res.json({ message: 'Application record successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application record' });
  }
});

module.exports = router;
