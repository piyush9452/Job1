import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; // Import axios
import {
  X,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Globe,
  ArrowRight,
  Share2,
} from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!job) return null;

  const handleApplyClick = async () => {
    // Make async
    setLoading(true);

    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (!storedUserInfo) {
        alert("Please log in to apply.");
        navigate("/login");
        return;
      }

      const userInfo = JSON.parse(storedUserInfo);
      const token = userInfo?.token;

      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      // Make the POST request to apply
      await axios.post(
        "https://jobone-mrpy.onrender.com/applications",
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Application submitted successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Application failed:", error);
      alert(error.response?.data?.message || "Failed to apply for job.");
    } finally {
      setLoading(false);
    }
  };

  const displayLocation =
    typeof job.location === "object"
      ? job.location.address
      : job.location || "Remote";
  const companyName =
    job.postedByCompany || job.postedByName || "Company Confidential";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Sticky Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm">
              {companyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 font-medium mt-1">
                <Building2 size={16} />
                {companyName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Salary
              </p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <IndianRupee size={14} />{" "}
                {job.salary?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                ₹{job.paymentPerHour}/hr
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Type
              </p>
              <p className="font-bold text-gray-900 capitalize">
                {job.jobType}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium capitalize">
                {job.mode}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Schedule
              </p>
              <p className="font-bold text-gray-900">
                {job.dailyWorkingHours} Hrs/Day
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {job.noOfDays} Days
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Location
              </p>
              <p
                className="font-bold text-gray-900 truncate"
                title={displayLocation}
              >
                {displayLocation.split(",")[0]}
              </p>
              <p
                className="text-xs text-gray-500 mt-1 truncate"
                title={displayLocation}
              >
                {displayLocation}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="text-blue-500" size={20} /> Job Description
            </h3>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap prose-sm">
              {job.description}
            </div>
          </div>

          {/* Dates & Openings */}
          <div className="flex flex-wrap gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                Start Date
              </p>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                {new Date(job.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                End Date
              </p>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                {new Date(job.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                Openings
              </p>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                {job.noOfPeopleRequired} Spots
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} /> Required
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
          <button
            onClick={handleApplyClick}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Apply Now <ArrowRight size={18} />
              </>
            )}
          </button>
          <button className="p-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
