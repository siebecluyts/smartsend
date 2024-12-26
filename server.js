const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));
app.use(bodyParser.json()); // For parsing application/json

// Initialize session
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));

// Sample database (in-memory or can be a file like JSON or MongoDB)
let users = [];  // Stores user data
let messages = [];  // Stores messages

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}

// Route to sign up
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Save user to the database
  users.push({ username, password });
  req.session.username = username;
  res.status(201).json({ message: 'User created successfully' });
});

// Route to log in
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  req.session.username = username;
  res.status(200).json({ message: 'Logged in successfully' });
});

// Route to log out
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Route to fetch the logged-in user's profile
app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ username: req.session.username });
});

// Route to fetch all users excluding the logged-in user
app.get('/users', isAuthenticated, (req, res) => {
  const currentUser = req.session.username;
  const userList = users.filter(user => user.username !== currentUser);
  res.json(userList);
});

// Route to fetch messages for the logged-in user
app.get('/messages', isAuthenticated, (req, res) => {
  const currentUser = req.session.username;
  const userMessages = messages.filter(msg => msg.receiver === currentUser || msg.sender === currentUser);
  res.json(userMessages);
});

// Route to send a message to another user
app.post('/send-message', isAuthenticated, (req, res) => {
  const { recipient, message } = req.body;
  const sender = req.session.username;

  if (!recipient || !message) {
    return res.status(400).json({ error: 'Recipient and message are required' });
  }

  // Save the message
  messages.push({ sender, receiver: recipient, message, timestamp: new Date() });
  res.status(200).json({ message: 'Message sent successfully' });
});

// Serve the HTML dashboard page
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
