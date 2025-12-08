import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import axios from "axios";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  // ✅ Fetch user's job posts using token only
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // 1. Get Token
        const stored = localStorage.getItem("employerInfo");
        if (!stored) {
          console.warn("No employer info found in local storage.");
          return;
        }

        const employerInfo = JSON.parse(stored);
        const token = employerInfo?.token;

        if (!token) {
          console.error("No token found inside employerInfo.");
          return;
        }

        // 2. API Call
        console.log(
          "Fetching jobs with token:",
          token.substring(0, 10) + "..."
        ); // Debug log

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/employerJobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Success:", data); // See what you actually got back

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.jobs) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        // 3. Detailed Error Logging
        console.error("❌ API Error:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
        });

        setJobs([]);

        // Optional: Redirect on 401 (Unauthorized)
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchJobs();
  }, [navigate]);

  return (
    <div className="min-h-screen py-20 bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        My Dashboard
      </h1>

      {/* ✨ Decorative Post a Job Card */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-3xl mx-auto bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-md
                   border border-blue-100 rounded-3xl shadow-lg p-10 flex flex-col items-center overflow-hidden"
      >
        {/* Floating background shapes */}
        <motion.div
          className="absolute w-64 h-64 bg-blue-200 rounded-full top-[-60px] right-[-70px] blur-3xl opacity-60"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 bg-indigo-200 rounded-full bottom-[-50px] left-[-50px] blur-3xl opacity-50"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-200/10 to-indigo-200/10 opacity-70"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Card Content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PlusCircle className="w-16 h-16 text-blue-600 mx-auto mb-4 drop-shadow-md" />
          </motion.div>

          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Post a New Job
          </h2>
          <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
            Easily post a new job opening and reach thousands of qualified
            candidates. Manage your listings and get applications directly in
            your dashboard.
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/createjob")}
            className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3
                       rounded-lg font-semibold overflow-hidden shadow-md hover:shadow-lg
                       transition-all duration-300"
          >
            <span className="relative z-10">Post a Job</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* My Job Posts Section */}
      <div className="max-w-5xl mx-auto mt-14">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          My Job Posts
        </h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            You haven’t posted any jobs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/job/${job._id}`)}
                className="cursor-pointer bg-white shadow-md rounded-xl p-5 hover:shadow-xl hover:border hover:border-blue-300 transition"
              >
                <h3 className="text-lg font-semibold text-gray-800  mr-30 ">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.description}
                </p>
                <div className="mt-3 text-blue-600 font-medium text-sm">
                  {job.location.address || "Remote"}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
