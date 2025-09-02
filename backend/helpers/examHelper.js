const Exam = require("../models/Exam");
const { createExam, addQuestion } = require("./dataHelper"); // reuse helpers if you already have

/**
 * Validate exam input (title, questions, options)
 */
function validateExamInput(title, questions) {
  if (!title || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Title and at least one question are required");
  }

  for (const q of questions) {
    if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2) {
      throw new Error("Each question needs text and at least 2 options");
    }
    const hasCorrect = q.options.some((o) => o.isCorrect === true);
    if (!hasCorrect) {
      throw new Error("Each question must have one correct option");
    }
  }
}

/**
 * Create exam and its questions
 */
async function handleCreateExam(token, { title, description, questions }) {
  // 1. Validate input
  validateExamInput(title, questions);

  // 2. Create exam
  const exam = await createExam(token, { title, description });

  // 3. Add questions
  for (const q of questions) {
    await addQuestion(token, exam._id, {
      questionText: q.questionText,
      options: q.options.map((o) => ({ text: o.text, isCorrect: !!o.isCorrect })),
      marks: typeof q.marks === "number" ? q.marks : 1,
    });
  }

  // 4. Return populated exam
  const saved = await Exam.findById(exam._id).populate("questions");
  return saved;
}

module.exports = { handleCreateExam };
