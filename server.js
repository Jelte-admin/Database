const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3003', // replace with your MySQL root password
  database: 'mydatabase'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Serve static HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API Endpoint to Fetch Data
app.get('/data', (req, res) => {
  const name = req.query.name;
  connection.query('SELECT * FROM users WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// API Endpoint to Add a User
app.post('/add-user', (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error, results) => {
    if (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Error adding user' });
    }
    res.status(200).json({ message: 'User added successfully!' });
  });
});

// API Endpoint to Toggle User Status
app.get('/toggle-status', (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Fetch current status
  connection.query('SELECT active FROM users WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error fetching user status:', err);
      return res.status(500).json({ error: 'Error fetching user status' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentStatus = results[0].active;
    const newStatus = !currentStatus;

    // Update status
    connection.query('UPDATE users SET active = ? WHERE name = ?', [newStatus, name], (error) => {
      if (error) {
        console.error('Error updating user status:', error);
        return res.status(500).json({ error: 'Error updating user status' });
      }
      res.json({ success: true, newStatus });
    });
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
