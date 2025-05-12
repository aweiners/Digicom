const db = require('../models/database');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      role TEXT CHECK(role IN ('student', 'admin')) NOT NULL DEFAULT 'student'
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    db.prepare('INSERT INTO users (username, role) VALUES (?, ?)').run('admin', 'admin');
  }

  const studentExists = db.prepare('SELECT * FROM users WHERE username = ?').get('student');
  if (!studentExists) {
    db.prepare('INSERT INTO users (username, role) VALUES (?, ?)').run('student', 'student');
  }

  console.log('Database initialized successfully');
}

module.exports = { initDatabase };