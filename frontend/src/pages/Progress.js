import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProgressDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = document.cookie.split("=")[1]; // from cookieparser
        const res = await fetch("http://localhost:5000/progress", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProgress(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-blue-600">
        Loading progress...
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Failed to load progress.
      </div>
    );
  }

  const cards = [
    {
      title: "User Details",
      content: (
        <>
          <p className="text-gray-700">Name: {progress.user.name}</p>
          <p className="text-gray-700">Email: {progress.user.email}</p>
          <p className="text-gray-700">Total Exams Attended: {progress.attendedExams.length}</p>
        </>
      ),
      onClick: null,
    },
    {
      title: "Conducted Exams",
      content: (
        <>
          <p className="text-gray-700">Total: {progress.conductedExams.length}</p>
          <p className="text-gray-700">Students Attended: {progress.totalStudents}</p>
        </>
      ),
      onClick: () => navigate("/conducted-exams"),
    },
    {
      title: "Attended Exams",
      content: (
        <>
          <p className="text-gray-700">Total: {progress.attendedExams.length}</p>
          <p className="text-gray-700">Average Score: {progress.averageScore}</p>
        </>
      ),
      onClick: () => navigate("/attended-exams"),
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        📊 Your Progress Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={card.onClick}
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              {card.title}
            </h2>
            <div className="space-y-2">{card.content}</div>
            {card.onClick && (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
              >
                More Details →
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDashboard;
