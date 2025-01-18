import React, { useEffect, useState } from 'react';

const Exams = () => {
  const [exams, setExams] = useState([]);

  // Fetch exam data from the backend when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:5000/exams'); // Update with the correct backend URL
        const data = await response.json();

        // Log the data to the console to check if it's received
        console.log('Fetched Exams:', data);

        setExams(data); // Set the fetched exams to state
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <section className="py-5 bg-dark text-light">
      <div className="container py-5">
        <div className="row mb-4 mb-lg-5">
          <div className="col-md-8 col-xl-6 text-center mx-auto">
            <p className="fw-bold text-success mb-2">Exams</p>
            <h3 className="fw-bold">Select the exam to attend</h3>
          </div>
        </div>

       {/* Loop through exams to display each exam */}
<div className="row row-cols-1 row-cols-md-2 mx-auto" style={{ maxWidth: '900px' }}>
  {exams.map(exam => (
    <div key={exam.id} className="col mb-5">
      <div className="card shadow border-0 h-100">
        <img
          className="card-img-top rounded-top"
          src={exam.image}
          alt={exam.title}
        />
        <div className="card-body">
          <h5 className="fw-bold">{exam.title}</h5>
          <p className="text-muted mb-4">{exam.description}</p>
          <button className="btn btn-primary shadow" type="button">
            Learn more
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default Exams;
