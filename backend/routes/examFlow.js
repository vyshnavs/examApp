const express = require("express");
const router = express.Router();
const { startExam, saveCurrentAnswer, submitExam } = require("../helpers/examFlowHelper");

// POST /user/startexam { code }
router.post("/startExam", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    const code = String(req.body.code || "").trim();
    if (!code) return res.status(400).json({ message: "Exam code is required" });

    const data = await startExam(token, code);

    // Return minimal exam details for client
    return res.json({
      exam: {
        _id: data.exam._id,
        title: data.exam.title,
        code: data.exam.code,
        createdAt: data.exam.createdAt,
        createdBy: data.exam.createdBy?.name || null,
        description: data.exam.description || "",
      },
      questions: data.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options.map((o) => ({ text: o.text })), // hide correctness
        marks: q.marks || 1,
      })),
      responseId: data.responseId,
      // New: include saved answers on resume so the UI can prefill radios
      answers: Array.isArray(data.answers) ? data.answers : [],
    });
  } catch (err) {
    console.error("startExam error:", err);
    // Map typed service errors to HTTP status codes for clear frontend handling
    const status =
      err.status ||
      (err.code === "ALREADY_SUBMITTED" ? 409 : 500);
    return res.status(status).json({ message: err.message || "Failed to start exam" });
  }
});


// POST /user/currentuserresponse { responseId, questionId, selectedOption }
router.post("/currentResponse", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    const { responseId, questionId, selectedOption } = req.body || {};
    if (!responseId || !questionId || typeof selectedOption !== "number") {
      return res.status(400).json({ message: "responseId, questionId, selectedOption are required" });
    }

    await saveCurrentAnswer(token, { responseId, questionId, selectedOption });
    return res.json({ ok: true });
  } catch (err) {
    console.error("currentuserresponse error", err);
    return res.status(500).json({ message: err.message || "Failed to save response" });
  }
});
// POST /examSubmit { responseId }
router.post("/examSubmit", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    const { responseId } = req.body || {};
    if (!responseId) return res.status(400).json({ message: "responseId is required" });

    const result = await submitExam(token, { responseId });
    // submitExam should already upsert into User.attendedExams and Exam.students
    return res.json(result);
  } catch (err) {
    console.error("examSubmit error:", err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Failed to submit exam" });
  }
});

module.exports = router;
