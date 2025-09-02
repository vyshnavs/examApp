const express = require("express");
const router = express.Router();
const { getProgressData } = require("../helpers/progressHelper");
const { handleCreateExam } = require("../helpers/examHelper");
const { findExamsByCode } = require("../helpers/dataHelper");



// GET /progress
router.get("/progress", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) return res.status(401).json({ error: "No token provided" });

    const progressData = await getProgressData(token);
    res.json(progressData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /user/createExam
router.post("/createExam", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    const { title, description, questions } = req.body || {};

    const exam = await handleCreateExam(token, { title, description, questions });

    return res.status(201).json({ exam });
  } catch (err) {
    console.error("CreateExam error", err.message);
    return res.status(400).json({ message: err.message });
  }
});

//findexam
router.get("/findexam", async (req, res) => {
  try {
    const code = String(req.query.code || "").trim();
    if (!code) {
      return res.status(400).json({ message: "Exam code is required" });
    }

    // exact match by default; set to true if partial matches are desired
    const usePartial = false;

    const exams = await findExamsByCode(code, { usePartial });

    // Normalize shape for frontend
    const payload = exams.map((e) => ({
      _id: e._id,
      title: e.title,
      description: e.description,
      code: e.code,
      createdAt: e.createdAt,
      createdBy: e.createdBy
        ? { _id: e.createdBy._id, name: e.createdBy.name, email: e.createdBy.email }
        : null,
    }));

    return res.json(payload);
  } catch (err) {
    console.error("findexam error:", err);
    return res.status(500).json({ message: "Failed to search exams" });
  }
});

module.exports = router;

