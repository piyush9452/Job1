import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);

  // ✅ Fetch job details by ID
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${jobId}`
        );
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const token = localStorage.getItem("userToken");
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!token || !user?.userId) {
        setFeedback("You must be logged in as user to apply.");
        setLoading(false);
        return;
      }

      const payload = {
        jobId,
        message: message.trim(),
      };

      await axios.post(
        "https://jobone-mrpy.onrender.com/applications",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFeedback("✅ Application submitted successfully!");
      setMessage("");

      setTimeout(() => navigate("/jobs"), 1500);
    } catch (error) {
      console.error("Error applying:", error);
      setFeedback("❌ Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-100"
      >
        {/* Job Details Section */}
        {jobLoading ? (
          <p className="text-gray-500 text-center">Loading job details...</p>
        ) : job ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {job.title}
            </h2>
            <p className="text-gray-600 text-center mb-2">
              {job.company || "Company not specified"} •{" "}
              {job.location || "Remote"}
            </p>
            <p className="text-gray-500 text-sm text-center max-w-lg mx-auto">
              {job.description?.substring(0, 200)}...
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center mb-8">
            Failed to load job details.
          </p>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Why should we hire you for this job?{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="5"
              placeholder="Write a brief statement about why you’re a good fit..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </motion.button>
        </form>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center ${
              feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
