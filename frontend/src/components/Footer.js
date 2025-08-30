export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 theme-transition">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-brand-600 dark:bg-brand-500" />
            <span className="font-semibold">ExamX</span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            ExamX is a modern exam platform to create, attempt, and analyze tests with real-time insights.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            <li>Email: support@examx.app</li>
            <li>Phone: +91-98765-43210</li>
            <li>Location: Bengaluru, India</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 theme-transition">About Us</a></li>
            <li><a href="#services" className="hover:text-brand-600 dark:hover:text-brand-400 theme-transition">Services</a></li>
            <li><a href="#attend" className="hover:text-brand-600 dark:hover:text-brand-400 theme-transition">Attend Exam</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 dark:text-neutral-500 py-4">
        © {new Date().getFullYear()} ExamX. All rights reserved.
      </div>
    </footer>
  );
}
