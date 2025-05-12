const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', (req, res) => {
  const { id, title, content } = req.body;

  if (!id || !content) {
    return res.status(400).json({ error: 'ID and content are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO notes (id, title, content) VALUES (?, ?, ?)');
    const result = stmt.run(id, title || null, content);
    
    if (result.changes > 0) {
      res.status(201).json({ 
        success: true, 
        note: { id, title, content } 
      });
    } else {
      res.status(400).json({ error: 'Failed to create note' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes > 0) {
      res.json({ success: true, message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;