import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Services from "./pages/Services";
import EditProfile from "./pages/EditProfile.jsx";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import Profile from "./pages/Profile.jsx";

import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileDescr from './pages/ProfileDescr';

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />


            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/myapplications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/employerdashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/createjob" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
            <Route path="/profiledescr" element={<ProfileDescr />} />

        </Routes>
    </Router>
  )
}

export default App
