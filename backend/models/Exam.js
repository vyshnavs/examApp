const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  students: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, default: 0 },
      attendedAt: { type: Date, default: Date.now }
    }
  ],
  code: { type: String, unique: true, index: true } 
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
