const Exam = require("../models/Exam");
const Question = require("../models/Question");
const ExamResponse = require("../models/ExamResponse");
const User = require("../models/User");
const getUserFromToken = require("../middleware/auth");

// Start or resume an exam by code
// - If already submitted: throw with code "ALREADY_SUBMITTED" (handled by route -> 409)
// - If already started (not submitted): return saved answers to resume
// - If first time: create response shell and return exam + questions
async function startExam(token, code) {
  const user = await getUserFromToken(token);
  const exam = await Exam.findOne({ code }).populate("createdBy", "name").lean();
  if (!exam) {
    const err = new Error("Exam not found");
    err.status = 404;
    throw err;
  }

  // Check if already submitted — send a typed error the route can map to 409
  const submitted = await ExamResponse.findOne({
    user: user._id,
    exam: exam._id,
    isSubmitted: true,
  }).select("_id score submittedAt");
  if (submitted) {
    const err = new Error("You have already submitted this exam.");
    err.code = "ALREADY_SUBMITTED";
    err.status = 409;
    throw err;
  }

  // Find in-progress attempt
  let response = await ExamResponse.findOne({
    user: user._id,
    exam: exam._id,
    isSubmitted: false,
  }).lean();

  // Fetch questions
  const questions = await Question.find({ exam: exam._id })
    .select("questionText options marks")
    .lean();

  if (!response) {
    // Create a fresh in-progress response
    response = await ExamResponse.create({
      user: user._id,
      exam: exam._id,
      answers: questions.map((q) => ({
        question: q._id,
        selectedOption: null,
        isCorrect: false,
      })),
      isSubmitted: false,
      score: 0,
    });
    return {
      exam,
      questions,
      responseId: response._id,
    };
  }

  // Ensure answers cover all questions (if exam changed)
  const have = new Set((response.answers || []).map((a) => String(a.question)));
  const missing = questions.filter((q) => !have.has(String(q._id)));
  if (missing.length) {
    await ExamResponse.updateOne(
      { _id: response._id },
      {
        $push: {
          answers: {
            $each: missing.map((q) => ({
              question: q._id,
              selectedOption: null,
              isCorrect: false,
              answeredAt: new Date(),
            })),
          },
        },
      }
    );
  }

  // Provide saved selections to prefill UI on resume
  const savedAnswers = (response.answers || []).map((a) => ({
    question: a.question,
    selectedOption: a.selectedOption,
  }));

  return {
    exam,
    questions,
    responseId: response._id,
    answers: savedAnswers,
  };
}

// Save a single answer atomically for an in-progress response
async function saveCurrentAnswer(token, { responseId, questionId, selectedOption }) {
  const user = await getUserFromToken(token);

  const existing = await ExamResponse.findOne({ _id: responseId, user: user._id }).select("isSubmitted");
  if (!existing) {
    const err = new Error("Response not found");
    err.status = 404;
    throw err;
  }
  if (existing.isSubmitted) {
    const err = new Error("Exam already submitted. Changes are not allowed.");
    err.code = "ALREADY_SUBMITTED";
    err.status = 409;
    throw err;
  }

  const res = await ExamResponse.updateOne(
    { _id: responseId, user: user._id, isSubmitted: false, "answers.question": questionId },
    {
      $set: {
        "answers.$.selectedOption": selectedOption,
        "answers.$.answeredAt": new Date(),
      },
    }
  );
  const matched = res.matchedCount ?? res.n;
  if (!matched) {
    const err = new Error("Could not save answer");
    err.status = 400;
    throw err;
  }
  return { ok: true };
}

// Submit and compute score; update exam + user aggregates
async function submitExam(token, { responseId }) {
  const user = await getUserFromToken(token);

  const response = await ExamResponse.findOne({ _id: responseId, user: user._id }).populate({
    path: "exam",
    select: "_id",
  });
  if (!response) {
    const err = new Error("Response not found");
    err.status = 404;
    throw err;
  }
  if (response.isSubmitted) {
    // Already finalized — return existing score to frontend
    return { score: response.score };
  }

  // Server-side scoring
  const questions = await Question.find({ exam: response.exam._id })
    .select("options marks")
    .lean();

  const qMap = new Map(questions.map((q) => [String(q._id), q]));
  let score = 0;
  const updatedAnswers = response.answers.map((a) => {
    const q = qMap.get(String(a.question));
    const isCorrect =
      q && typeof a.selectedOption === "number" && q.options?.[a.selectedOption]?.isCorrect === true;
    if (isCorrect) score += q?.marks || 1;
    return { ...a.toObject?.() ?? a, isCorrect };
  });

  response.answers = updatedAnswers;
  response.score = score;
  response.isSubmitted = true;
  response.submittedAt = new Date();
  await response.save();

  // Update Exam.students (create if new, else set)
  await Exam.updateOne(
    { _id: response.exam._id, "students.user": { $ne: user._id } },
    { $push: { students: { user: user._id, score, attendedAt: new Date() } } }
  );
  await Exam.updateOne(
    { _id: response.exam._id, "students.user": user._id },
    { $set: { "students.$.score": score, "students.$.attendedAt": new Date() } }
  );

  // Update User.attendedExams (upsert behavior: update if exists, else push)
  const setRes = await User.updateOne(
    { _id: user._id, "attendedExams.exam": response.exam._id },
    { $set: { "attendedExams.$.score": score, "attendedExams.$.date": new Date() } }
  );
  const modified = setRes.modifiedCount ?? setRes.nModified ?? 0;
  if (!modified) {
    await User.updateOne(
      { _id: user._id },
      { $push: { attendedExams: { exam: response.exam._id, score, date: new Date() } } }
    );
  }

  return { score };
}

module.exports = { startExam, saveCurrentAnswer, submitExam };
