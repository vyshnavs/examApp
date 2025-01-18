import React from 'react';
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/user/LoginPage';
import UserPage from './pages/user/UserPage';
import AdminPage from './pages/admin/AdminPage';
import SignupPage from './pages/user/SignupPage';
import Navbar from './components/homepage/Navbar';
import UserNavbar from './components/userpage/UserNavbar';
import AdminNavbar from './components/adminpage/AdminNavbar';
import Footer from './components/Footer';  
import AdminLoginPage from './pages/admin/AdminLoginpage';
import AdminSignupPage from './pages/admin/AdminSignupPage';
import { useLocation } from 'react-router-dom';  // Import useLocation here

const App = () => {
    return (
        // Wrap the entire app inside Router
        <Router>
            <NavbarSelector />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/login" element={<AdminLoginPage/>} />
                <Route path="/admin/signup" element={<AdminSignupPage/>} />
                
            </Routes>
         <Footer/>
        </Router>
    );
};

// This component handles dynamic navbar selection based on the location
const NavbarSelector = () => {
    const location = useLocation();  // useLocation inside Router context

    const renderNavbar = () => {
        switch (location.pathname) {
            case '/user':
                return <UserNavbar />;
            case '/admin':
                return <AdminNavbar />;
            default:
                return <Navbar />;
        }
    };

    return renderNavbar();
};

export default App;
