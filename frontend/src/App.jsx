import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Jobs from "./pages/Jobs";
import Navbar from "./components/NavBar";
function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/employeedashboard" element={<EmployeeDashboard />} />
            <Route path="/employerdashboard" element={<EmployerDashboard />} />
            <Route path="/jobs" element={<Jobs />} />
        </Routes>
    </Router>
  )
}

export default App
