import React, { useState, useEffect } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For displaying success or error message
  const [loading, setLoading] = useState(false); // For loading state while submitting

  // useEffect to log formData whenever it changes
  useEffect(() => {}, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    setMessage(""); // Clear any previous messages

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      
      if (response.ok && data.success) {
        // On success, reset formData and show success message
        setMessage(`login successful with username ${data.user}`);
        setFormData({
          email: "",
          password: "",
        }
       
      );
       // Save user information to localStorage
  localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/user'; // Redirect to the root
      } else {
        // Handle error
        setMessage("login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div class="card" style={{ width: "30rem" }}>
        <div class="card-body">
          <h5 class="card-title text-center">Login</h5>
           <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Login..." : "Login"}
            </button>
          </form>
          <div class="text-center mt-3">
            <a href="#">Forgot Password?</a>
          </div>
          <div class="text-center mt-2">
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
            <a href="/admin/login">admin login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
