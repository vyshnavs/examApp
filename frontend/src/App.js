import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Progress from "./pages/Progress";
import CreateExam from "./pages/CreateExam";
import AttendExam from "./pages/AttendExam";
import ProtectedRoute from "./helpers/authroutes";
import StartExam from "./pages/StartExam";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createExam"
          element={
            <ProtectedRoute>
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendExam"
          element={
            <ProtectedRoute>
              <AttendExam />
            </ProtectedRoute>
          }
        />
         <Route
          path="/attendExam/:code"
          element={
            <ProtectedRoute>
              <StartExam />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
