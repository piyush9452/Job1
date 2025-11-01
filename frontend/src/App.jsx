import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from "./pages/Home";
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail.jsx";
import About from "./pages/About";
import Services from "./pages/Services";
import EditProfile from "./pages/EditProfile.jsx";
import MyApplications from "./pages/MyApplications";
import JobPosts from "./pages/JobPosts.jsx";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerDashboard from "./pages/EmployerDashboard";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import ApplyPage from "./pages/ApplyPage";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registeremail" element={<RegisterEmail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/myapplications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/jobposts" element={<ProtectedRoute><JobPosts /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/createjob" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
            <Route path="/employerregister" element={<EmployerRegister />} />
            <Route path="/employerdashboard" element={<EmployerDashboard />} />
            <Route path="/apply/:jobId" element={<ApplyPage />} />
        </Routes>
    </Router>
  )
}

export default App
