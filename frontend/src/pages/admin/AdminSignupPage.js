import React, { useState, useEffect } from "react";

function AdminSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For displaying success or error message
  const [loading, setLoading] = useState(false); // For loading state while submitting

  // useEffect to log formData whenever it changes
  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
        `${process.env.REACT_APP_BACKEND_URL}/admin/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data); // Log response data from backend

      if (response.ok && data.success) {
        // On success, reset formData and show success message
        setMessage("Signup successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        // Handle error
        setMessage("Signup failed. Please try again.");
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
      <div className="card" style={{ width: "30rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center">Signup</h5>

          {/* Show success/error message */}
          {message && (
            <div
              className={`alert ${
                message.includes("successful")
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={handleChange}
                name="name"
                required
              />
            </div>
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
              {loading ? "Signing Up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignupPage;
