import { useMemo, useState, useEffect, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { ChevronDown, LogOut, Moon, Sun, User2 } from "lucide-react";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-500 shadow-glow" />
    <span className="font-semibold text-lg">ExamX</span>
  </div>
);

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          image: decoded.picture || "",
        });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const el = dropdownRef.current;
      if (el && !el.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const menuItems = useMemo(
    () => [
      { label: "About Us", href: "#about" },
      ...(user
        ? [
            { label: "Create Exam", href: "createexam" },
            { label: "Attend Exam", href: "/attendexam" },
            { label: "Progress & Activity", href: "progress" },
          ]
        : []),
    ],
    [user]
  );

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setOpen(false);
    // Refresh entire app (hard reset)
    window.location.replace("/");
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/80 dark:bg-neutral-900/70 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-neutral-900 dark:text-neutral-100">
          <Logo />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 transition"
            >
              {item.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="p-2 rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 transition"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-indigo-500" />
            )}
          </button>

          {/* Auth */}
          {!user ? (
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-all text-white text-sm font-semibold"
            >
              Login
            </a>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <User2 size={18} />
                <span className="text-sm">{user.name}</span>
                <ChevronDown size={16} />
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg transition"
                  role="menu"
                >
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile */}
        <MobileMenu
          menuItems={menuItems}
          theme={theme}
          onToggleTheme={toggle}
          user={user}
          setUser={setUser}
          onLogout={handleLogout}
        />
      </nav>
    </header>
  );
}

function MobileMenu({ menuItems, theme, onToggleTheme, user, setUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const el = popRef.current;
      if (el && !el.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="md:hidden" ref={popRef}>
      {/* Hamburger */}
      <button
        className="p-2 rounded-md border border-neutral-200 dark:border-neutral-700 transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <div className={clsx("h-0.5 w-6 bg-current mb-1")} />
        <div className={clsx("h-0.5 w-6 bg-current mb-1")} />
        <div className={clsx("h-0.5 w-6 bg-current")} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-16 right-4 left-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg p-4 flex flex-col gap-3 transition">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 transition"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => {
              onToggleTheme();
              setOpen(false);
            }}
            className="px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 transition"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>

          {/* Auth */}
          {!user ? (
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition"
              onClick={() => setOpen(false)}
            >
              Login
            </a>
          ) : (
            <>
              <a
                href="#profile"
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                Profile
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
