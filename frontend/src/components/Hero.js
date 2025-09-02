import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-16 md:pb-24 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 theme-transition">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Quote and CTA */}
        <div className="relative">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 14 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            Master Exams with <span className="text-brand-600 dark:text-brand-500">Clarity</span> and <span className="text-brand-600 dark:text-brand-500">Confidence</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
            className="mt-4 text-neutral-700 dark:text-neutral-300 max-w-prose"
          >
            Precision practice, instant analytics, and adaptive insights to turn preparation into performance. Achieve more with ExamX. 
          </motion.p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.2 } }}
            className="mt-6 flex gap-4"
          >
            <a
              href="attendExam"
              className="px-5 py-3 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-glow theme-transition"
            >
              Attend an Exam
            </a>
            <a
              href="/createExam"
              className="px-5 py-3 rounded-md border border-neutral-300 dark:border-neutral-700 hover:border-brand-500 dark:hover:border-brand-400 text-neutral-900 dark:text-neutral-100 theme-transition"
            >
              Create an Exam
            </a>
          </motion.div>

          {/* Floating aura accent */}
          <motion.div
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-600/20 blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [0.9, 1.05, 0.95] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        </div>

        {/* Right: Advertising image */}
        <div className="relative">
          <motion.div
            initial={{ x: 60, opacity: 0, rotate: 2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop"
              alt="Exam preparation"
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl"
            />
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-xl ring-2 ring-brand-600/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
