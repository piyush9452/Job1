import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
import login from "../assets/login.jpg"; // adjust path to your actual file
import { useLocation } from "react-router-dom"; // Import this
import { AlertTriangle, X } from "lucide-react"; // Import icons

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const endpoint =
        activeTab === "employer"
          ? "https://jobone-mrpy.onrender.com/employer/google-login"
          : "https://jobone-mrpy.onrender.com/user/google-login";

      const { data } = await axios.post(endpoint, {
        token: credentialResponse.credential,
      });

      // ---------------------------------------------------------
      // EMPLOYER LOGIC
      // ---------------------------------------------------------
      if (activeTab === "employer") {
        // 1. Strict LocalStorage Logic (As requested)
        localStorage.setItem("employerToken", data.token);
        localStorage.setItem("employerInfo", JSON.stringify(data));
        console.log("Employer Data Saved:", data);

        // 2. Check Profile Completion
        if (data.isProfileComplete === false) {
          // Redirect to Edit Profile with Popup
          navigate("/employereditprofile", { state: { showWarning: true } });
        } else {
          // Redirect to Dashboard
          navigate("/employerdashboard");
        }
      }
      // ---------------------------------------------------------
      // USER LOGIC
      // ---------------------------------------------------------
      else {
        // 1. Strict LocalStorage Logic (As requested)
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log("User Data Saved:", data);

        // 2. Check Profile Completion
        if (data.isProfileComplete === false) {
          navigate("/editprofile", { state: { showWarning: true } });
        } else {
          navigate("/"); // Or "/userdashboard" if that route exists
        }
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Login failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // backend endpoint based on active tab
      const endpoint =
        activeTab === "employer"
          ? "https://jobone-mrpy.onrender.com/employer/login"
          : "https://jobone-mrpy.onrender.com/user/login";

      const { data } = await axios.post(endpoint, { email, password });
      console.log(data); // ✅ check what backend returns

      // store different keys based on user type
      if (activeTab === "employer") {
        localStorage.setItem("employerToken", data.token); // add userId for consistency
        localStorage.setItem("employerInfo", JSON.stringify(data));
        console.log("this is required data");
        navigate("/employerdashboard"); // redirect to employer dashboard
      } else {
        localStorage.setItem("userToken", data.token);
        console.log(data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));

        navigate("/userdashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${login})` }}
    >
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6">
        {/* Tabs */}
        <div className="flex justify-around border-b mb-5">
          <button
            className={`pb-2 font-medium text-sm ${
              activeTab === "user"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User
          </button>
          <button
            className={`pb-2 font-medium text-sm ${
              activeTab === "employer"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("employer")}
          >
            Employer
          </button>
        </div>

        {/* Google Login (for both user and employer) */}
        <div className="flex justify-center w-full mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="outline"
            size="large"
            width="320" // Adjust width to match your form
          />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="enter password"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {activeTab === "employer" ? "Login as Employer" : "Login"}
          </button>
        </form>

        {/* Register Links */}
        <p className="text-center text-gray-600 text-sm mt-4">
          New to Job1? Register{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            (User
          </Link>{" "}
          /{" "}
          <Link
            to="/employerregisteroption"
            className="text-blue-600 hover:underline"
          >
            Employer)
          </Link>
        </p>
      </div>
    </div>
  );
}
