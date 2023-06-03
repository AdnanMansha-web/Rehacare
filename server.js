const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Landing page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Internal area
app.get('/internal', (req, res) => {
  res.sendFile(__dirname + '/public/internal.html');
});

// Authentication
const users = [];

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username is already taken
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the storage
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the storage
    const user = users.find(user => user.username === username);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if password is correct
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
