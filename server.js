const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Registration route
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Read existing user data from the JSON file
  const userData = getUsersData();

  // Check if the email is already registered
  const existingUser = userData.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send('Email already registered');
  }


  // Create a new user object
  const newUser = { email, password };

  // Add the new user to the user data
  userData.push(newUser);

  // Save the updated user data to the JSON file
  saveUsersData(userData);
  res.send('Registered successfully');
  //res.redirect('/');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Read the user data from the JSON file
  const userData = getUsersData();

  // Check if the user exists and the password is correct
  const user = userData.find((user) => user.email === email && user.password === password);

  if (user) {
    // Successful login, redirect to the internal area
    res.redirect('/internal');
  } else {
    // Failed login, redirect back to the landing page
    res.redirect('/');
  }
});

// Internal area route
app.get('/internal', (req, res) => {
  res.sendFile(__dirname + '/public/internal.html');
});

// Update data route
app.post('/update', (req, res) => {
  const {email, password, newPassword } = req.body;

  // Read the user data from the JSON file
  const userData = getUsersData();

  // Find the user by email
  const user = userData.find((user) => user.email === email);

  if (user) {
    // Check if the provided password is correct
    if (user.password !== password) {
      return res.status(401).send('Invalid email or password');
    }

    

    // Update the user's password
    if (newPassword) {
      user.password = newPassword;
    }

    // Save the updated user data to the JSON file
    saveUsersData(userData);

    res.send('Data updated successfully');
  } else {
    res.status(400).send('User not found');
  }
});



// Helper functions
function getUsersData() {
  const rawData = fs.readFileSync('users.json', 'utf8');
  return JSON.parse(rawData);
}

function saveUsersData(data) {
  fs.writeFileSync('users.json', JSON.stringify(data));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
