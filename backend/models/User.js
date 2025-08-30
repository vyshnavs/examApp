const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  isVerified: { type: Boolean, default: false },
  picture: { type: String },  // Stores Google profile picture URL
  provider: { type: String, enum: ['local', 'google'], default: 'local' }, // Track login method

  attendedExams: [
    {
      exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
      score: { type: Number, default: 0 },
      date: { type: Date, default: Date.now }
    }
  ],

  conductedExams: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
