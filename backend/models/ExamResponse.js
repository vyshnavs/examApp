// models/ExamResponse.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: Number }, // 0-based index
      isCorrect: { type: Boolean, default: false },
      answeredAt: { type: Date, default: Date.now }
    }
  ],
  isSubmitted: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date }
}, { timestamps: true });

// one active response per user+exam
responseSchema.index({ user: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('ExamResponse', responseSchema);
