import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="card text-center p-4" style={{ width: "25rem" }}>
        <img
          src="https://via.placeholder.com/150"
          className="card-img-top rounded-circle mx-auto"
          alt="User Profile"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{userData.name}</h5>
          <p className="card-text text-muted">{userData.email}</p>
          <p className="card-text">Welcome!</p>
          <a href="#" className="btn btn-primary">
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
