const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all announcements (public)
router.get('/', (req, res) => {
  try {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Get a specific announcement (public)
router.get('/:id', (req, res) => {
  try {
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

// Create a new announcement (admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const id = uuidv4();
    
    db.prepare('INSERT INTO announcements (id, title, content) VALUES (?, ?, ?)')
      .run(id, title, content);
    
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update an announcement (admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }
    
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    const newTitle = title || announcement.title;
    const newContent = content || announcement.content;
    
    db.prepare('UPDATE announcements SET title = ?, content = ? WHERE id = ?')
      .run(newTitle, newContent, id);
    
    const updatedAnnouncement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    
    res.json({ success: true, announcement: updatedAnnouncement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete an announcement (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;