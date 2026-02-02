import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google"; // Import Google Component
import login from "../assets/login.jpg";
import NetworkBackground from "../components/NetworkBackground";
import BackgroundJoin from "../components/BackgroundJoin";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  // --- GOOGLE LOGIN HANDLER ---
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
        // 1. Strict LocalStorage Logic
        localStorage.setItem("employerToken", data.token);
        localStorage.setItem("employerInfo", JSON.stringify(data));
        console.log("Employer Data Saved:", data);

        // 2. Check Profile Completion
        if (data.isProfileComplete === false) {
          navigate("/employereditprofile", { state: { showWarning: true } });
        } else {
          navigate("/employerdashboard");
        }
      }
      // ---------------------------------------------------------
      // USER LOGIC
      // ---------------------------------------------------------
      else {
        // 1. Strict LocalStorage Logic
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log("User Data Saved:", data);

        // 2. Check Profile Completion
        if (data.isProfileComplete === false) {
          navigate("/editprofile", { state: { showWarning: true } });
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Login failed. Please try again.");
    }
  };

  // --- MANUAL LOGIN HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        activeTab === "employer"
          ? "https://jobone-mrpy.onrender.com/employer/login"
          : "https://jobone-mrpy.onrender.com/user/login";

      const { data } = await axios.post(endpoint, { email, password });
      console.log("Manual Login Data:", data);

      if (activeTab === "employer") {
        localStorage.setItem("employerToken", data.token);
        localStorage.setItem("employerInfo", JSON.stringify(data));
        navigate("/employerdashboard");
      } else {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundColor: `transparent` }}
    >
      <BackgroundJoin radius={50} force={-1} />
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

        {/* --- GOOGLE LOGIN BUTTON --- */}
        <div className="flex justify-center w-full mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="outline"
            size="large"
            width="320" // Adjusts width to fit container
            text="continue_with"
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
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading
              ? "Logging in..."
              : activeTab === "employer"
                ? "Login as Employer"
                : "Login"}
          </button>
        </form>

        {/* Register Links */}
        <p className="text-center text-gray-600 text-sm mt-4">
          New to Job1? Register{" "}
          <Link to="/userregister" className="text-blue-600 hover:underline">
            (User
          </Link>{" "}
          /{" "}
          <Link
            to="/employerregister"
            className="text-blue-600 hover:underline"
          >
            Employer)
          </Link>
        </p>
      </div>
    </div>
  );
}
