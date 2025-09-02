import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Share2 } from "lucide-react";
import api from "../api/connection";
import Navbar from "../components/Navbar";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};
const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const listItem = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 140, damping: 16 } },
};

function useClipboard() {
  const copy = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };
  return copy;
}

function PillRow({ onDetails, title, subtitle, code, accent = "blue", onShare }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [6, -6]);
  const rotateY = useTransform(x, [-40, 40], [-6, 6]);

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const rx = (py - r.height / 2) / (r.height / 2);
    const ry = (px - r.width / 2) / (r.width / 2);
    x.set(ry * 40);
    y.set(rx * 40);
  };
  const handleLeave = () => {
    x.set(0); y.set(0);
  };

  const gradient =
    accent === "violet"
      ? "linear-gradient(90deg, rgba(139,92,246,0.9), rgba(236,72,153,0.9))"
      : "linear-gradient(90deg, rgba(59,130,246,0.9), rgba(99,102,241,0.9))";
  const dot =
    accent === "violet" ? "from-violet-500 to-fuchsia-500" : "from-blue-500 to-indigo-500";
  const badgeClasses =
    accent === "violet"
      ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  const detailsBtn =
    accent === "violet"
      ? "bg-violet-600 hover:bg-violet-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <motion.li
      variants={listItem}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative"
    >
      <div className={`absolute left-0 top-3 h-2 w-2 rounded-full bg-gradient-to-br ${dot}`} />
      <div className="pl-5" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.985 }}
          className="relative rounded-full px-4 py-3
          bg-white/70 dark:bg-neutral-900/60 backdrop-blur
          border border-white/30 dark:border-white/10"
        >
          <div
            className="pointer-events-none absolute -bottom-[2px] left-4 right-10 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
            style={{ background: gradient }}
          />
          <div className="flex items-center justify-between gap-4">
            {/* Left block: title, subtitle, code badge */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{subtitle}</p>
                {code ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeClasses}`}
                    title="Exam code"
                  >
                    Code: {code}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Actions: share + details */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShare}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800
                  bg-white/80 dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-200
                  hover:border-blue-500 dark:hover:border-blue-500 focus:outline-none"
                aria-label="Share exam link"
                title="Share exam link"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDetails}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white ${detailsBtn} transition-colors`}
                aria-label="Exam details"
                title="Exam details"
              >
                Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.li>
  );
}

export default function ProgressDashboard() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const navigate = useNavigate();
  const copy = useClipboard();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/user/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const attended = useMemo(
    () =>
      (progress?.attendedExams || []).map((e) => ({
        id: e.id || e._id,
        title: e.title || e.name,
        code: e.code,
        date: e.date || e.createdAt,
        route: `/attended-exams/${e.id || e._id}`,
      })),
    [progress]
  );
  const conducted = useMemo(
    () =>
      (progress?.conductedExams || []).map((e) => ({
        id: e.id || e._id,
        title: e.title || e.name,
        code: e.code,
        date: e.date || e.createdAt,
        route: `/conducted-exams/${e.id || e._id}`,
      })),
    [progress]
  );

  const fmt = useMemo(
    () =>
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
        : null,
    []
  );
  const formatDateTime = (d) => {
    const date = new Date(d);
    return fmt ? fmt.format(date) : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-blue-700 dark:text-blue-400">
        Loading progress...
      </div>
    );
  }
  if (!progress) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600 dark:text-red-400">
        Failed to load progress.
      </div>
    );
  }

  const makeShareUrl = (code) => {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    return origin ? `${origin}/attendExam/${encodeURIComponent(code)}` : `/attendExam/${encodeURIComponent(code)}`;
  };

  const handleShare = async (code) => {
    if (!code) return;
    const url = makeShareUrl(code);
    const ok = await copy(url);
    setCopied(ok ? code : "");
    setTimeout(() => setCopied(""), 1600);
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        {/* Hero */}
        <motion.section variants={sectionReveal} initial="hidden" animate="show" className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">📊 Progress Dashboard</h1>
          <div
            className="mx-auto mt-4 h-[2px] w-56 rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.7), rgba(139,92,246,0.7), rgba(236,72,153,0.7))" }}
          />
        </motion.section>

        {/* User */}
        <motion.section variants={sectionReveal} initial="hidden" animate="show" className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">User Details</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl px-4 py-3 bg-white/70 dark:bg-neutral-900/60 backdrop-blur border border-white/30 dark:border-white/10">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Name</p>
              <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">{progress.user?.name}</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-white/70 dark:bg-neutral-900/60 backdrop-blur border border-white/30 dark:border-white/10">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Email</p>
              <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">{progress.user?.email}</p>
            </div>
          </div>
        </motion.section>

        {/* Attended */}
        <motion.section variants={sectionReveal} initial="hidden" animate="show" className="mt-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Attended Exams</h3>
          </div>
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-[2px] rounded-full opacity-60" style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.4), rgba(99,102,241,0.25))" }} />
            <motion.ul variants={listContainer} initial="hidden" animate="show" className="space-y-3">
              <AnimatePresence>
                {attended.map((exam) => (
                  <PillRow
                    key={exam.id}
                    onDetails={() => navigate(exam.route)}
                    title={exam.title}
                    subtitle={formatDateTime(exam.date)}
                    code={exam.code}
                    accent="blue"
                    onShare={() => handleShare(exam.code)}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </motion.section>

        {/* Conducted */}
        <motion.section variants={sectionReveal} initial="hidden" animate="show" className="mt-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Conducted Exams</h3>
          </div>
          <div className="relative">
            <div className="absolute left-1 top-0 bottom-0 w-[2px] rounded-full opacity-60" style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.4), rgba(236,72,153,0.25))" }} />
            <motion.ul variants={listContainer} initial="hidden" animate="show" className="space-y-3">
              <AnimatePresence>
                {conducted.map((exam) => (
                  <PillRow
                    key={exam.id}
                    onDetails={() => navigate(exam.route)}
                    title={exam.title}
                    subtitle={formatDateTime(exam.date)}
                    code={exam.code}
                    accent="violet"
                    onShare={() => handleShare(exam.code)}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </motion.section>

        {/* Copied toast */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-md
                bg-neutral-900 text-white text-sm dark:bg-neutral-800 shadow-lg"
            >
              Link copied for code: {copied}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
