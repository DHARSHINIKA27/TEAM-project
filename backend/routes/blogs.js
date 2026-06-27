const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/blogs
// @desc    Get all published/active blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await db.getAll('blogs');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog data' });
  }
});

// @route   POST api/blogs
// @desc    Create a new blog article
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, excerpt, content, author, readTime, category, image, status, date } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author name are required' });
  }

  try {
    const newBlog = await db.insert('blogs', {
      title,
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      author,
      date: date || new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      category: category || 'General',
      image: image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status: status || 'published'
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new blog post' });
  }
});

// @route   PUT api/blogs/:id
// @desc    Update a blog article
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedBlog = await db.update('blogs', req.params.id, req.body);
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post' });
  }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog article
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await db.delete('blogs', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Blog article not found' });
    }
    res.json({ message: 'Blog article successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});

module.exports = router;
