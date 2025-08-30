import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Progress from "./pages/Progress"

export default function App() {
  return (
      <Router>
        
        <Routes>
            {/* Add routes here */}
            <Route path="/" element={<Homepage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/progress" element={<Progress />} />

        </Routes>
    </Router>
  
  );
}
