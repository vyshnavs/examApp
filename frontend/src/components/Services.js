import { motion } from "framer-motion";
import { BarChart3, ClipboardList, FileBarChart, Layers, PlayCircle, Settings } from "lucide-react";

const items = [
  { icon: ClipboardList, title: "Create Exams", desc: "Build question papers with sections, timing, and difficulty.", anchor: "#create" },
  { icon: PlayCircle, title: "Attend Exams", desc: "Take scheduled or practice tests with safe navigation.", anchor: "#attend" },
  { icon: BarChart3, title: "Analyze Progress", desc: "See accuracy, speed, topic mastery, and trends." },
  { icon: FileBarChart, title: "Results & Reports", desc: "Instant scoring, detailed breakdowns, exportable reports." },
  { icon: Layers, title: "Question Bank", desc: "Organize questions by tags, topics, and difficulty." },
  { icon: Settings, title: "Admin Tools", desc: "Manage users, permissions, schedules, and results." },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-neutral-950 theme-transition">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50"
        >
          Services
        </motion.h2>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.a
              key={it.title}
              href={it.anchor || "#"}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:shadow-xl hover:border-brand-500 dark:hover:border-brand-400 theme-transition"
            >
              <div className="flex items-start gap-4">
                <it.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {it.desc}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
