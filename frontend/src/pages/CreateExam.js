import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/connection";
import Navbar from "../components/Navbar";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 16 } } };

export default function CreateExam() {
  const navigate = useNavigate();

  const [meta, setMeta] = useState({
    title: "",
    description: "",
    // keep string versions for inputs so they can be cleared
    totalQuestionsStr: "",
    optionsPerQuestionStr: "",
  });
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // parsed values with defaults
  const totalQuestionsNum = Math.max(0, parseInt(meta.totalQuestionsStr || "0", 10) || 0);
  const optionsPerQuestionNum = Math.max(0, parseInt(meta.optionsPerQuestionStr || "0", 10) || 0);

  const canGenerate =
    meta.title.trim().length > 0 && totalQuestionsNum > 0 && optionsPerQuestionNum > 1;

  const handleGenerate = () => {
    const total = totalQuestionsNum;
    const opts = optionsPerQuestionNum;
    const q = Array.from({ length: total }, (_, qi) => ({
      id: qi + 1,
      text: "",
      options: Array.from({ length: opts }, (_, oi) => ({
        id: oi + 1,
        text: "",
      })),
      correct: 1, // 1-based
      marks: 1,
    }));
    setQuestions(q);
  };

  const updateQuestionText = (qi, value) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, text: value } : q)));
  };
  const updateOptionText = (qi, oi, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? { ...o, text: value } : o)) }
          : q
      )
    );
  };
  const setCorrectOption = (qi, optionId) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, correct: optionId } : q)));
  };
  const setMarks = (qi, v) => {
    const n = Math.max(1, parseInt(v || "1", 10) || 1);
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, marks: n } : q)));
  };

  const payload = useMemo(
    () => ({
      title: meta.title,
      description: meta.description,
      questions: questions.map((q) => ({
        questionText: q.text,
        options: q.options.map((o) => ({ text: o.text, isCorrect: o.id === q.correct })),
        marks: Number(q.marks || 1),
      })),
    }),
    [meta, questions]
  );

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMsg("");
      const token = localStorage.getItem("token");
      await api.post("/user/createExam", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // success: clear and redirect
      setMsg("Exam saved successfully!");
      setQuestions([]);
      setMeta({
        title: "",
        description: "",
        totalQuestionsStr: "",
        optionsPerQuestionStr: "",
      });
      navigate("/progress", { replace: true });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to save exam.");
    } finally {
      setSaving(false);
    }
  };

  // helper: sanitize number input to allow empty
  const handleNumberChange = (key) => (e) => {
    const v = e.target.value;
    // allow empty string to support backspace clearing
    if (v === "") {
      setMeta((m) => ({ ...m, [key]: "" }));
      return;
    }
    // accept digits only, ignore other chars
    if (/^\d+$/.test(v)) {
      setMeta((m) => ({ ...m, [key]: v }));
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">✍️ Create Exam</h1>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">Define exam basics, generate questions, and mark correct answers.</p>
        {msg && <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-400">{msg}</p>}
      </motion.div>

      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl mx-auto mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Exam Basics</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            placeholder="Exam title"
            className="w-full p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={meta.title}
            onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Short description (optional)"
            className="w-full p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={meta.description}
            onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
          />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Total questions"
            className="w-full p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={meta.totalQuestionsStr}
            onChange={handleNumberChange("totalQuestionsStr")}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Options per question"
            className="w-full p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={meta.optionsPerQuestionStr}
            onChange={handleNumberChange("optionsPerQuestionStr")}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!canGenerate}
            onClick={handleGenerate}
            className="px-5 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Generate Questions
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {questions.length > 0 && (
          <motion.div
            key="questions"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="max-w-5xl mx-auto mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Questions</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Enter question text, fill option texts, and choose the correct answer.</p>
            </div>

            <motion.ul variants={container} initial="hidden" animate="show" className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {questions.map((q, qi) => (
                <motion.li key={q.id} variants={item} className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Question {q.id}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-24 p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={String(q.marks ?? "")}
                      onChange={(e) => setMarks(qi, e.target.value)}
                      aria-label="Marks"
                      title="Marks"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter question text"
                    className="mt-2 w-full p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={q.text}
                    onChange={(e) => updateQuestionText(qi, e.target.value)}
                  />

                  <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {q.options.map((o, oi) => {
                      const isCorrect = q.correct === o.id;
                      return (
                        <motion.div
                          key={o.id}
                          whileHover={{ scale: 1.01 }}
                          className={`rounded-lg p-3 border transition-colors ${
                            isCorrect
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              placeholder={`Option ${o.id}`}
                              className="w-full p-2 rounded bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none"
                              value={o.text}
                              onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setCorrectOption(qi, o.id)}
                              className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${
                                isCorrect
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Mark"}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setQuestions([])}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-2 rounded-md font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Exam"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
