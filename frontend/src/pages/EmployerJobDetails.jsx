import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Briefcase,
  Globe,
  Monitor,
  Building,
} from "lucide-react";

export default function EmployerJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) {
          alert("Please log in first.");
          navigate("/login");
          return;
        }

        const employerInfo = JSON.parse(stored);
        const token = employerInfo?.token;

        if (!token) {
          alert("Session expired. Please log in again.");
          return navigate("/login"); // Assuming route is /login based on previous context
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setJob(data.job || data); // Handle potential response wrapper
      } catch (err) {
        console.error("Failed to load job", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    )
      return;

    try {
      const stored = localStorage.getItem("employerInfo");
      const employerInfo = stored ? JSON.parse(stored) : null;
      const token = employerInfo?.token;

      if (!token) return alert("Authentication error.");

      await axios.delete(`https://jobone-mrpy.onrender.com/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job deleted successfully.");
      navigate("/employerdashboard");
    } catch (err) {
      console.error("Delete failed", err);
      alert(
        "Failed to delete job: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Online":
        return <Monitor size={16} />;
      case "Offline":
        return <Building size={16} />;
      case "Hybrid":
        return <Globe size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-slate-500 bg-slate-50">
        <Loader2 className="animate-spin mb-4 text-indigo-600" size={48} />
        <p className="text-lg font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            The job posting you are looking for does not exist or has been
            deleted.
          </p>
          <button
            onClick={() => navigate("/employerdashboard")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* --- HEADER SECTION --- */}
        <header className="bg-white shadow-sm rounded-2xl p-6 sm:p-10 border border-slate-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                    ${
                      job.mode === "Online"
                        ? "bg-green-100 text-green-700"
                        : job.mode === "Hybrid"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {job.mode}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                  {job.jobType}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {job.title}
              </h1>
              <div className="flex items-center text-slate-500 text-sm sm:text-base gap-2">
                <MapPin size={18} className="text-slate-400" />
                <span className="font-medium">
                  {job.location.address || "Remote"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/job/${job._id}/applicants`)}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                <Users size={18} /> View Applicants
              </button>
              <button
                onClick={() => navigate(`/editjob/${job._id}`)}
                className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
              >
                <Pencil size={18} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-rose-50 transition-colors border border-slate-200 shadow-sm"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
          {/* Decorative gradient blob */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-indigo-500" size={20} /> Job
                Description
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="text-indigo-500" size={20} /> Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* --- SIDEBAR DETAILS (RIGHT) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Stats Card */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Job Details
              </h3>

              <div className="space-y-4">
                <DetailRow
                  icon={<Calendar className="text-blue-500" size={18} />}
                  label="Start Date"
                  value={
                    job.startDate
                      ? new Date(job.startDate).toLocaleDateString()
                      : "N/A"
                  }
                />
                <DetailRow
                  icon={<Calendar className="text-rose-500" size={18} />}
                  label="End Date"
                  value={
                    job.endDate
                      ? new Date(job.endDate).toLocaleDateString()
                      : "N/A"
                  }
                />
                <div className="h-px bg-slate-100 my-2"></div>
                <DetailRow
                  icon={<Clock className="text-orange-500" size={18} />}
                  label="Daily Hours"
                  value={`${job.dailyWorkingHours} hrs`}
                />
                <DetailRow
                  icon={getModeIcon(job.mode)}
                  label="Work Mode"
                  value={job.mode}
                />
                <div className="h-px bg-slate-100 my-2"></div>
                <DetailRow
                  icon={<Users className="text-purple-500" size={18} />}
                  label="Openings"
                  value={`${job.noOfPeopleRequired} Spots`}
                />
              </div>
            </section>

            {/* Compensation Card */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Compensation
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Total Salary</p>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee size={24} className="text-green-400" />
                    <span className="text-3xl font-bold tracking-tight">
                      {job.salary?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Rate per hour</span>
                    <span className="font-semibold">₹{job.paymentPerHour}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper Component for Sidebar Rows
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
        <span className="text-slate-500 text-sm font-medium">{label}</span>
      </div>
      <span className="text-slate-900 font-semibold text-sm">{value}</span>
    </div>
  );
}
