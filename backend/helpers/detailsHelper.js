const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

// 🔹 Helper to get user from token
const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// 🔹 Fetch exams attended by a user
const getAttendedExams = async (token) => {
  const user = await getUserFromToken(token);
  return await User.findById(user._id)
    .populate('attendedExams.exam', 'name date')
    .select('attendedExams');
};

// 🔹 Fetch exams conducted by a user
const getConductedExams = async (token) => {
  const user = await getUserFromToken(token);
  return await User.findById(user._id)
    .populate('conductedExams', 'name date students')
    .select('conductedExams');
};

// 🔹 Fetch details of a specific exam
const getExamDetails = async (examId) => {
  return await Exam.findById(examId)
    .populate('questions', 'questionText options correctAnswer marks')
    .populate('students.student', 'name email');
};

// 🔹 Create a new exam
const createExam = async (token, examData) => {
  const user = await getUserFromToken(token);
  const exam = new Exam({ ...examData, createdBy: user._id });
  await exam.save();

  user.conductedExams.push(exam._id);
  await user.save();

  return exam;
};

// 🔹 Add questions to an exam
const addQuestionsToExam = async (examId, questionsData) => {
  const questions = await Question.insertMany(
    questionsData.map(q => ({ ...q, exam: examId }))
  );

  const exam = await Exam.findById(examId);
  exam.questions.push(...questions.map(q => q._id));
  await exam.save();

  return questions;
};

// 🔹 Submit exam answers and save score
const submitExam = async (token, examId, score) => {
  const user = await getUserFromToken(token);
  const exam = await Exam.findById(examId);

  exam.students.push({ student: user._id, score });
  await exam.save();

  user.attendedExams.push({ exam: examId, score });
  await user.save();

  return { exam, user };
};

module.exports = {
  getAttendedExams,
  getConductedExams,
  getExamDetails,
  createExam,
  addQuestionsToExam,
  submitExam
};
