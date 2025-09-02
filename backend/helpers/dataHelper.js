// dataHelper.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Exam = require("../models/Exam");
const Question = require("../models/Question");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Decode JWT → return logged-in user
 */
async function getUserFromToken(token) {
  if (!token) throw new Error("No token provided");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    throw new Error("Invalid token: " + err.message);
  }
}

//////////////////////////
// USER FUNCTIONS
//////////////////////////

async function getUserData(token) {
  return getUserFromToken(token);
}

async function updateUserData(token, updateFields) {
  const user = await getUserFromToken(token);
  Object.assign(user, updateFields);
  await user.save();
  return user;
}

async function deleteUserData(token) {
  const user = await getUserFromToken(token);
  await User.findByIdAndDelete(user._id);
  return { message: "User deleted successfully" };
}

//////////////////////////
// EXAM FUNCTIONS
//////////////////////////

function generateExamCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function createExam(token, examData) {
  const user = await getUserFromToken(token);

  // Generate unique exam code
  let code;
  let exists = true;
  while (exists) {
    code = generateExamCode(6); // e.g., "A1B2C3"
    exists = await Exam.findOne({ code });
  }

  const exam = new Exam({
    ...examData,
    createdBy: user._id,
    code, // ✅ attach unique code
  });

  await exam.save();
  return exam;
}

async function getUserExams(token) {
  const user = await getUserFromToken(token);
  return Exam.find({ createdBy: user._id }).populate("questions");
}

async function updateExam(token, examId, updateFields) {
  const user = await getUserFromToken(token);
  const exam = await Exam.findOneAndUpdate(
    { _id: examId, createdBy: user._id }, // restrict
    updateFields,
    { new: true }
  );
  if (!exam) throw new Error("Exam not found or unauthorized");
  return exam;
}

async function deleteExam(token, examId) {
  const user = await getUserFromToken(token);
  const exam = await Exam.findOneAndDelete({ _id: examId, createdBy: user._id });
  if (!exam) throw new Error("Exam not found or unauthorized");
  await Question.deleteMany({ exam: exam._id }); // cleanup
  return { message: "Exam and related questions deleted" };
}

async function findExamsByCode(code, { usePartial = false } = {}) {
  let query;
  if (usePartial) {
    query = { code: { $regex: code, $options: "i" } }; // partial match, case-insensitive
  } else {
    query = { code }; // exact match
  }

  return Exam.find(query).populate("createdBy", "name email");
}

//////////////////////////
// QUESTION FUNCTIONS
//////////////////////////

async function addQuestion(token, examId, questionData) {
  const user = await getUserFromToken(token);
  const exam = await Exam.findOne({ _id: examId, createdBy: user._id });
  if (!exam) throw new Error("Exam not found or unauthorized");

  const question = new Question({
    ...questionData,
    exam: exam._id,
  });
  await question.save();

  exam.questions.push(question._id);
  await exam.save();

  return question;
}

async function updateQuestion(token, questionId, updateFields) {
  const user = await getUserFromToken(token);
  const question = await Question.findById(questionId).populate("exam");
  if (!question || question.exam.createdBy.toString() !== user._id.toString()) {
    throw new Error("Question not found or unauthorized");
  }

  Object.assign(question, updateFields);
  await question.save();
  return question;
}

async function deleteQuestion(token, questionId) {
  const user = await getUserFromToken(token);
  const question = await Question.findById(questionId).populate("exam");
  if (!question || question.exam.createdBy.toString() !== user._id.toString()) {
    throw new Error("Question not found or unauthorized");
  }

  await Question.findByIdAndDelete(questionId);
  await Exam.findByIdAndUpdate(question.exam._id, {
    $pull: { questions: questionId },
  });

  return { message: "Question deleted successfully" };
}

//////////////////////////
// EXPORTS
//////////////////////////
module.exports = {
  getUserData,
  updateUserData,
  deleteUserData,

  createExam,
  getUserExams,
  updateExam,
  deleteExam,
  findExamsByCode,

  addQuestion,
  updateQuestion,
  deleteQuestion,
};
