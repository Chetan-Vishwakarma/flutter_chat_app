// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Set up the Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your_database_url' with your MongoDB connection string)
mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define a simple schema for the MongoDB collection
const exampleSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Create a model based on the schema
const ExampleModel = mongoose.model('Example', exampleSchema);

// Middleware for parsing JSON
app.use(express.json());

// Define a GET endpoint
app.get('/api/examples', async (req, res) => {
  try {
    // Retrieve data from MongoDB
    const examples = await ExampleModel.find();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a POST endpoint
app.post('/api/examples', async (req, res) => {
  try {
    // Create a new example instance based on the request body
    const newExample = new ExampleModel({
      name: req.body.name,
      description: req.body.description,
    });

    // Save the new example to MongoDB
    const savedExample = await newExample.save();
    res.status(201).json(savedExample);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
