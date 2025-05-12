const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all resources (public)
router.get('/', (req, res) => {
  try {
    const resources = db.prepare('SELECT * FROM resources ORDER BY created_at DESC').all();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get a specific resource (public)
router.get('/:id', (req, res) => {
  try {
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Create a new resource (admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { title, description, link } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const id = uuidv4();
    
    db.prepare('INSERT INTO resources (id, title, description, link) VALUES (?, ?, ?, ?)')
      .run(id, title, description, link || null);
    
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    res.status(201).json({ success: true, resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update a resource (admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { title, description, link } = req.body;
    const { id } = req.params;
    
    if (!title && !description && link === undefined) {
      return res.status(400).json({ error: 'At least one field is required' });
    }
    
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const newTitle = title || resource.title;
    const newDescription = description || resource.description;
    const newLink = link !== undefined ? link : resource.link;
    
    db.prepare('UPDATE resources SET title = ?, description = ?, link = ? WHERE id = ?')
      .run(newTitle, newDescription, newLink, id);
    
    const updatedResource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    res.json({ success: true, resource: updatedResource });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    db.prepare('DELETE FROM resources WHERE id = ?').run(id);
    
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;