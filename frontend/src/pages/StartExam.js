import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/connection";
import Navbar from "../components/Navbar";

const modalVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export default function AttendExamRunner() {
  const { code } = useParams(); // /attendExam/:code
  const navigate = useNavigate();

  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [fsWarning, setFsWarning] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [selections, setSelections] = useState({}); // { [questionId]: optionIndex }
  const containerRef = useRef(null);

  // Localized date/time
  const fmt = useMemo(
    () =>
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
        : null,
    []
  );
  const formatDT = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return fmt ? fmt.format(dt) : dt.toLocaleString();
  };

  // Anti-copy / context menu
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    const stopSelect = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("selectstart", stopSelect);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("selectstart", stopSelect);
    };
  }, []);

  // Fullscreen watcher
  useEffect(() => {
    const onFsChange = () => {
      const inFs = Boolean(document.fullscreenElement);
      if (!inFs && exam) setFsWarning(true);
      else setFsWarning(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [exam]);

  const requestFullscreen = async () => {
    const el = containerRef.current || document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  };

  // Start/resume exam
  const proceed = async () => {
    try {
      setLoading(true);
      await requestFullscreen();

      const token = localStorage.getItem("token");
      const res = await api.post(
        "/examFlow/startExam",
        { code },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      const data = res.data || {};

      setExam(data.exam || null);
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
      setResponseId(data.responseId || null);

      // Prefill from resumed answers if provided: [{question, selectedOption}]
      if (Array.isArray(data.answers) && data.answers.length) {
        const map = {};
        for (const a of data.answers) {
          if (a && a.question != null && typeof a.selectedOption === "number") {
            map[a.question] = a.selectedOption;
          }
        }
        setSelections(map);
      } else {
        // ensure clear if no resume data
        setSelections({});
      }

      setShowIntro(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to start exam.";
      alert(msg);
      // Handle already submitted case (409) by redirecting to progress
      if (err.response?.status === 409) {
        navigate("/progress");
      }
    } finally {
      setLoading(false);
    }
  };

  // Save answer immediately
  const saveSelection = async (questionId, optionIndex) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/examFlow/currentResponse",
        { responseId, questionId, selectedOption: optionIndex },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
    } catch (e) {
      // Non-blocking; keep selection in UI, log error
      console.error("Save response failed", e);
    }
  };

  const onSelect = async (qId, optionIndex) => {
    setSelections((prev) => ({ ...prev, [qId]: optionIndex }));
    if (responseId) {
      await saveSelection(qId, optionIndex);
    }
  };

  // Submit
  const finishExam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/examFlow/examSubmit",
        { responseId },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      const result = res.data || {};
      await exitFullscreen();
      alert(`Exam submitted. Score: ${result.score ?? 0}`);
      navigate("/progress");
    } catch (e) {
      console.error("Submit failed", e);
      alert(e.response?.data?.message || "Failed to submit exam.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900"
    >
  
      {/* Intro modal */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-6"
              role="dialog"
              aria-modal="true"
            >
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Before starting the exam
              </h2>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                Code:{" "}
                <span className="font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  {code}
                </span>
              </p>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Fullscreen is required. Exiting will show a warning.</li>
                <li>Copy, paste, right-click, and text selection are disabled.</li>
                <li>Do not refresh or close the tab during the exam.</li>
              </ul>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceed}
                  disabled={loading}
                  className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Loading…" : "Proceed"}
                </motion.button>
              </div>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                If fullscreen is blocked, allow it in the browser UI and click Proceed again.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen warning */}
      <AnimatePresence>
        {fsWarning && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 text-center">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Fullscreen required
              </h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                Please re-enter fullscreen to continue. Repeatedly exiting may auto-submit.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={requestFullscreen}
                  className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Re-enter Fullscreen
                </button>
                <button
                  onClick={finishExam}
                  className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Submit & Exit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam content */}
      {!showIntro && exam && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                {exam.title}
              </h1>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Code:{" "}
                <span className="font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  {exam.code}
                </span>{" "}
                • Created {formatDT(exam.createdAt)}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={finishExam}
              className="self-start sm:self-auto px-4 py-2 rounded-md font-semibold text-white bg-violet-600 hover:bg-violet-700"
            >
              Submit
            </motion.button>
          </header>

          <div className="mt-6 space-y-6">
            {questions.map((q, idx) => (
              <article
                key={q._id || idx}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 select-none"
              >
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Q{idx + 1}. {q.questionText}
                </p>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {q.options?.map((opt, oi) => {
                    const checked = selections[q._id] === oi;
                    return (
                      <label
                        key={oi}
                        className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                          checked
                            ? "border-blue-500"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500"
                        } bg-white dark:bg-neutral-900`}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          className="accent-blue-600"
                          checked={checked}
                          onChange={() => onSelect(q._id, oi)}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        <span className="text-sm text-neutral-800 dark:text-neutral-200">
                          {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
