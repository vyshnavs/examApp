const { getUserData, getUserExams } = require("./dataHelper");

// Core progress logic
async function getProgressData(token) {
  // Get user
  const user = await getUserData(token);

  // Attended exams
  const attendedExams = user.attendedExams || [];

  // Conducted exams
  const conductedExams = await getUserExams(token);

  // Count total students across conducted exams
  let totalStudents = conductedExams.reduce(
    (count, exam) => count + (exam.students?.length || 0),
    0
  );

  // Average score from attended exams
  let averageScore = 0;
  if (attendedExams.length > 0) {
    const totalScore = attendedExams.reduce((sum, e) => sum + (e.score || 0), 0);
    averageScore = (totalScore / attendedExams.length).toFixed(2);
  }

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    attendedExams,
    conductedExams,
    totalStudents,
    averageScore,
  };
}

module.exports = { getProgressData };
