import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/connection";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if password is strong
  const isStrongPassword = (pwd) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setMsg("Password is not strong enough.");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/register", { name, email, password });
      setSuccess(true);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = isStrongPassword(password);

  return (
    <div
      className="
      min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-neutral-50 to-neutral-100
      dark:from-[#0b1020] dark:to-[#0f172a]
    "
    >
      <div
        className="
        relative w-full max-w-md p-10 rounded-2xl shadow-2xl
        border border-neutral-200/60 bg-white/85 backdrop-blur
        dark:border-blue-900/60 dark:bg-[#0f172a]/70
      "
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 rounded-2xl z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
            <div className="w-6 h-6 border-2 border-blue-500/80 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4 text-center text-blue-700 dark:text-blue-400">
          Register
        </h2>

        {success ? (
          <p className="text-green-600 dark:text-green-400 text-center">
            ✅ Check your email to verify your account.
          </p>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {msg && (
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {msg}
              </p>
            )}

            <input
              type="text"
              placeholder="Name"
              className="
                w-full p-3 rounded theme-transition
                bg-white dark:bg-[#0b1020]
                border border-neutral-300 dark:border-blue-800
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                focus:outline-none focus:ring-2
                focus:ring-blue-500 dark:focus:ring-blue-500
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="
                w-full p-3 rounded theme-transition
                bg-white dark:bg-[#0b1020]
                border border-neutral-300 dark:border-blue-800
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                focus:outline-none focus:ring-2
                focus:ring-blue-500 dark:focus:ring-blue-500
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password field with strength indicator */}
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xl">
                {password ? (
                  passwordValid ? (
                    <FaCheckCircle className="text-green-500 dark:text-green-400" />
                  ) : (
                    <FaTimesCircle className="text-red-600 dark:text-red-500" />
                  )
                ) : (
                  <FaTimesCircle className="text-neutral-400 dark:text-neutral-500" />
                )}
              </span>
              <input
                type="password"
                placeholder="Password"
                className="
                  w-full pl-9 p-3 rounded theme-transition
                  bg-white dark:bg-[#0b1020]
                  border border-neutral-300 dark:border-blue-800
                  text-neutral-900 dark:text-neutral-100
                  placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 dark:focus:ring-blue-500
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              The password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
            </p>

            <button
              type="submit"
              className={`w-full py-2 rounded transition flex items-center justify-center ${
                passwordValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-neutral-300 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300 cursor-not-allowed"
              }`}
              disabled={loading || !passwordValid}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
