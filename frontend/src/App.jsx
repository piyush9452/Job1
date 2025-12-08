import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister.jsx";
import About from "./pages/About";
import Services from "./pages/Services";
import EditProfile from "./pages/EditProfile.jsx";
import MyApplications from "./pages/MyApplications";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerProfile from "./pages/EmployerProfile";
import EmployerEditProfile from "./pages/EmployerEditProfile.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import ApplyPage from "./pages/ApplyPage";
import EmployerOTP from "./pages/EmployerOTP";
import EmployerJobDetails from "./pages/EmployerJobDetails";
import UserOTP from "./pages/UserOTP";
import EmployerProtectedRoute from "./components/EmployerProtectedRoute";
import DocumentUploadPage from "./pages/EmployerDOC.jsx";
import Applicants from "./pages/Applicants.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import TestLocation from "./pages/TestLocation.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myapplications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createjob"
          element={
            <EmployerProtectedRoute>
              <CreateJob />
            </EmployerProtectedRoute>
          }
        />
        <Route path="/employerregister" element={<EmployerRegister />} />
        <Route path="/employerprofile" element={<EmployerProfile />} />
        <Route path="/employereditprofile" element={<EmployerEditProfile />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/employerotp" element={<EmployerOTP />} />
        <Route path="/job/:id" element={<EmployerJobDetails />} />
        <Route path="/userotp" element={<UserOTP />} />
        <Route path="/apply/:jobId" element={<ApplyPage />} />
        <Route path="/employerdocupload" element={<DocumentUploadPage />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/job/:id/applicants" element={<Applicants />} />
          <Route path="/testlocation" element={<TestLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
