const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    examResults: [
        {
            examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
            marks: { type: Number, required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
