import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, User2, Calendar, Hash, Clock3, ArrowLeft } from "lucide-react";
import api from "../api/connection";
import Navbar from "../components/Navbar";

const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const listItem = {
  hidden: { y: 8, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 140, damping: 16 } },
};

export default function AttendExam() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // full exam object

  // Localized date-time formatter
  const dt = useMemo(
    () =>
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
        : null,
    []
  );
  const fmt = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return dt ? dt.format(date) : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  // Search by code (debounced)
  useEffect(() => {
    if (!code || code.trim().length === 0) {
      setResults([]);
      setError("");
      return;
    }
    const t = setTimeout(async () => {
      try {
        setFetching(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await api.get("/user/findexam", {
          params: { code: code.trim() },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const arr = Array.isArray(res.data) ? res.data : [];
        setResults(arr);
      } catch (e) {
        setResults([]);
        setError(e.response?.data?.message || "No exams found for this code.");
      } finally {
        setFetching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [code]);

  // Clear details when code changes
  useEffect(() => {
    setSelected(null);
  }, [code]);

  return (
    <div>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        {/* Header */}
        <motion.section initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">🎯 Attend an Exam</h1>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Enter the exam code to search and join.</p>
          <div
            className="mx-auto mt-4 h-[2px] w-56 rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.65), rgba(139,92,246,0.65), rgba(236,72,153,0.65))" }}
          />
        </motion.section>

        {/* Search input */}
        <motion.section initial={{ y: 10, opacity: 0 }} animate={{ y: 1, opacity: 1 }} className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </div>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="Enter exam code (e.g., ABC123)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur
                border border-neutral-300 dark:border-neutral-700
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {fetching && <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Searching…</p>}
          {error && !fetching && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </motion.section>

        {/* List vs Details switch */}
        <div className="mt-8 max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {!selected && (
              <motion.section
                key="list"
                variants={listContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8 }}
              >
                <motion.ul className="space-y-3">
                  {results.map((exam) => (
                    <motion.li
                      key={exam._id || exam.id || exam.code}
                      variants={listItem}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelected(exam)}
                      className="cursor-pointer rounded-2xl px-4 py-3 bg-white/80 dark:bg-neutral-900/70 backdrop-blur
                        border border-neutral-200 dark:border-neutral-800
                        hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {exam.title || exam.name || "Untitled Exam"}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                            <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                              <Calendar className="h-3.5 w-3.5" />
                              {fmt(exam.createdAt || exam.date)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                              <User2 className="h-3.5 w-3.5" />
                              {exam.createdBy?.name || exam.owner?.name || "Unknown"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                {!fetching && code && results.length === 0 && !error && (
                  <motion.p variants={listItem} className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                    No exams found for this code.
                  </motion.p>
                )}
              </motion.section>
            )}

            {selected && (
              <motion.section
                key="details"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800
                  bg-white/80 dark:bg-neutral-900/70 backdrop-blur"
              >
                {/* Accent gradient header */}
                <div
                  className="h-24 w-full"
                  style={{
                    background:
                      "radial-gradient(1200px 200px at 20% 0%, rgba(59,130,246,0.3), transparent 60%), radial-gradient(1200px 220px at 80% 0%, rgba(139,92,246,0.25), transparent 60%)",
                  }}
                />
                <div className="p-6 -mt-10">
                  <button
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full
                      border border-neutral-300 dark:border-neutral-700
                      bg-white/80 dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 dark:hover:border-blue-500 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to results
                  </button>

                  <div className="mt-4">
                    <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                      {selected.title || selected.name || "Untitled Exam"}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {selected.description || "No description provided for this exam."}
                    </p>
                  </div>

                  <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Exam Code</p>
                      <p className="mt-1 inline-flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                        <Hash className="h-4 w-4" />
                        {selected.code || "—"}
                      </p>
                    </div>
                    <div className="rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Created</p>
                      <p className="mt-1 inline-flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                        <Calendar className="h-4 w-4" />
                        {fmt(selected.createdAt || selected.date)}
                      </p>
                    </div>
                    <div className="rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Created By</p>
                      <p className="mt-1 inline-flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                        <User2 className="h-4 w-4" />
                        {selected.createdBy?.name || selected.owner?.name || "Unknown"}
                      </p>
                    </div>
                    {selected.duration && (
                      <div className="rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Duration</p>
                        <p className="mt-1 inline-flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                          <Clock3 className="h-4 w-4" />
                          {selected.duration} minutes
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const targetCode = selected.code || selected._id || selected.id;
                        if (!targetCode) return;
                        navigate(`/attendExam/${targetCode}`);
                      }}
                      className="px-5 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Attend Exam
                    </motion.button>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Ensure a stable internet connection before starting.
                    </p>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
