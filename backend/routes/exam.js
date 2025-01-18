// filepath: /C:/Users/vyshn/OneDrive/Pictures/Desktop/mearnexam/exam-app/backend/routes/exam.js
const express = require('express');
const router = express.Router();

// Define your exam routes here
router.get('/', (req, res) => {
  res.send('Exam route');
});

module.exports = router;