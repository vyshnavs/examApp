import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const userExams = () => {
  const exams = [
    { id: 1, name: "Math Test", date: "2025-01-20" },
    { id: 2, name: "Physics Test", date: "2025-01-22" },
    { id: 3, name: "Chemistry Test", date: "2025-01-25" },
  ];

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-dark">
      <div className="w-75">
        <h1 className="text-center text-light mb-4">Exam List</h1>
        <ul className="list-group">
          {exams.map((exam) => (
            <li
              key={exam.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{exam.name}</span>
              <span className="badge bg-info text-dark">{exam.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default userExams;
