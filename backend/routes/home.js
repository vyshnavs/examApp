const express = require('express');
const path = require('path');
const router = express.Router();

// Dummy data for exams
const examsData = [
  {
    id: 1,
    title: 'Math Exam',
    description: 'A comprehensive math exam covering all topics.',
    image: 'assets/img/products/1.jpg',
  },
  {
    id: 2,
    title: 'Science Exam',
    description: 'A challenging science exam for advanced students.',
    image: 'assets/img/products/2.jpg',
  },
  {
    id: 3,
    title: 'History Exam',
    description: 'A history exam focusing on modern history.',
    image: 'assets/img/products/3.jpg',
  },
];

// Serve the index.html file from React's build folder and inject the examsData to frontend
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public', 'index.html')); // Serving the static React HTML page
});

// Serve exam data as JSON for the frontend to fetch
router.get('/exams', (req, res) => {
  res.json(examsData); // Send examsData as JSON response
});

module.exports = router;
