const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db/init');
const announcementRoutes = require('./routes/announcements');
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDatabase();

app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/announcements', announcementRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/board', (req, res) => {
    res.send('Welcome to the board!');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});