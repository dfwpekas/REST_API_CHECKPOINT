// Installing the necessary dependencies
const mongoose = require("mongoose"); 
const express = require("express"); 
const nodemon = require("nodemon");
const user = require("./models/user")
const bodyParser = require("body-parser");

// configuring express, dotenv, body-parser.Json 
app = express();
app.use(bodyParser.json());
require('dotenv').config();

// establishing mongoose connection to the Database
mongoose.connect(process.env.MONGO_URL, {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Creating all 4 Routes

// GET route to return all users
app.get('/users', async (req, res) => {
    try {
      const users = await user.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error:'Error fetching users' });
    }
  });

// POST route to add a new user
app.post('/users', async (req, res) => {
    try {
      const newUser = new user(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: 'Error creating new user' });

    }
  });

// PUT route to edit a user by ID
app.put('/users/:id', async (req, res) => {
    try {
      const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({error: 'Error updating user' });
    }
  });

// DELETE route to remove a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
      const deletedUser = await user.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error:'Error deleting user' });
    }
  });


// creating the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

