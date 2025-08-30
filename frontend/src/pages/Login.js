import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/connection";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.accessToken);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-neutral-50 to-neutral-100
      dark:from-[#0b1020] dark:to-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-md rounded-2xl p-10 shadow-2xl
          border border-neutral-200/60 bg-white/80 backdrop-blur-md
          dark:border-blue-900/60 dark:bg-[#0f172a]/70"
      >
        {loading && (
          <div className="absolute inset-0 z-50 rounded-2xl
            bg-white/60 dark:bg-black/50
            flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500/70 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4 text-center
          text-blue-700 dark:text-blue-400">
          Login
        </h2>

        {msg && (
          <p className="text-red-600 dark:text-red-400 mb-3 text-sm text-center font-semibold">
            {msg}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded theme-transition
              bg-white dark:bg-[#0b1020]
              border border-neutral-300 dark:border-blue-800
              text-neutral-900 dark:text-neutral-100
              placeholder:text-neutral-500 dark:placeholder:text-neutral-400
              focus:outline-none focus:ring-2
              focus:ring-blue-400 dark:focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded theme-transition
              bg-white dark:bg-[#0b1020]
              border border-neutral-300 dark:border-blue-800
              text-neutral-900 dark:text-neutral-100
              placeholder:text-neutral-500 dark:placeholder:text-neutral-400
              focus:outline-none focus:ring-2
              focus:ring-blue-400 dark:focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 rounded font-medium
              bg-blue-600 hover:bg-blue-700 text-white
              disabled:opacity-70 disabled:cursor-not-allowed
              transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Example Google button (wire to your Google One Tap or button) */}
          {/* <button
            type="button"
            onClick={() => {/* trigger Google flow then call handleGoogleSuccess */ /*}}
            className="w-full py-2 rounded font-medium
              border border-neutral-300 dark:border-neutral-700
              bg-white dark:bg-neutral-900
              text-neutral-900 dark:text-neutral-100
              hover:border-blue-500 dark:hover:border-blue-500
              transition-colors"
            disabled={loading}
          >
            Continue with Google
          </button> */}
        </div>

        <div className="mt-6 text-center text-sm
          text-neutral-600 dark:text-neutral-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
