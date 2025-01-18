import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const UserNavbar = () => {

  //handle logout 
  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, {
        method: "POST", // Use POST or GET depending on your API
        credentials: "include", // Include cookies if needed for session-based authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Successfully logged out
        console.log("User logged out");
        // Clear user data from localStorage
        localStorage.removeItem("user");

        // Redirect to the login page or home page
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  // Retrieving the data
const userData = JSON.parse(localStorage.getItem('user'));
  return (
    <>
      <nav className="navbar navbar-expand-md sticky-top py-3 navbar-dark" id="mainNav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <span className="bs-icon-sm bs-icon-circle bs-icon-primary shadow d-flex justify-content-center align-items-center me-2 bs-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-bezier">
                <path fillRule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"></path>
                <path d="M6 4.5H1.866a1 1 0=" />
              </svg>
            </span>
            <span>User</span>
          </a>
          <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1">
            <span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><Link className="nav-link" to="/index.html">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/services.html">Exams</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/projects.html">Results</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/pricing.html">Help</Link></li>
              <li className="nav-item"><Link className="nav-link active" to="/contacts.html">Feedback</Link></li>
            </ul>
            <p class=" text-light p-3 rounded shadow-sm mb-0">
            {userData.name}
        </p>
            <a className="btn btn-danger shadow " role="button" href="/login"  onClick={handleLogout}>logout</a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default UserNavbar;
