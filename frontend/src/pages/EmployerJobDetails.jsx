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
  CheckCircle2,
  CalendarDays,
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
          return navigate("/login");
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setJob(data.job || data);
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
        "Are you sure you want to delete this job? This action cannot be undone.",
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
        "Failed to delete job: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Work from Home":
        return <Monitor size={16} className="text-blue-500" />;
      case "Work from Office/Field":
        return <Building size={16} className="text-indigo-500" />;
      case "Hybrid":
        return <Globe size={16} className="text-purple-500" />;
      default:
        return <Briefcase size={16} className="text-slate-500" />;
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
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200 max-w-md">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            The job posting you are looking for does not exist or has been
            deleted.
          </p>
          <button
            onClick={() => navigate("/employerdashboard")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isRemote = job.mode === "Work from Home";
  const displayLocation = isRemote
    ? "Remote"
    : typeof job.location === "object"
      ? job.location?.address
      : job.location || "Office/Field";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* --- HEADER SECTION --- */}
        <header className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-10 border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                  {job.status || "Open"}
                </span>
                <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {job.mode}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {job.title}
              </h1>
              <div className="flex items-center text-slate-500 text-sm sm:text-base gap-2 font-medium">
                <MapPin size={18} className="text-slate-400" />
                <span>{displayLocation}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/job/${job._id}/applicants`)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Users size={18} /> View Applicants
              </button>
              <button
                onClick={() => navigate(`/editjob/${job._id}`)}
                className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
              >
                <Pencil size={18} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-100 transition-colors border border-rose-100"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Briefcase size={20} />
                </div>
                Job Description
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed font-medium text-sm sm:text-base">
                {job.description}
              </div>
            </section>

            {/* Schedule & Shifts Array */}
            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Clock size={20} />
                </div>
                Schedule & Shifts
              </h2>

              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Working Days
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.workDays?.length > 0 ? (
                    job.workDays.map((day, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-bold text-slate-500">
                      Flexible Days
                    </span>
                  )}
                </div>
              </div>

              {job.shifts?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Shift Timings
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.shifts.map((shift, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <span className="font-bold text-slate-800 text-sm">
                          {shift.shiftName}
                        </span>
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 border border-indigo-100 rounded-md">
                          {shift.startTime || "--:--"} -{" "}
                          {shift.endTime || "--:--"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Skills */}
            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.length > 0 ? (
                  job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-medium text-slate-500 italic">
                    No specific skills listed.
                  </span>
                )}
              </div>
            </section>
          </div>

          {/* --- SIDEBAR DETAILS (RIGHT) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compensation Card */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">
                Compensation
              </h3>

              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold mb-2 uppercase">
                  Total Salary
                </p>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <IndianRupee size={28} className="text-emerald-400" />
                  <span className="text-4xl font-extrabold tracking-tight">
                    {job.salaryAmount
                      ? job.salaryAmount.toLocaleString()
                      : "TBD"}
                  </span>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-300">Frequency</span>
                    <span className="text-emerald-400 uppercase tracking-wide">
                      {job.salaryFrequency}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Stats Card */}
            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Job Overview
              </h3>

              <div className="space-y-5">
                <DetailRow
                  icon={<CalendarDays className="text-blue-500" size={18} />}
                  label="Start Date"
                  value={
                    job.startDate
                      ? new Date(job.startDate).toLocaleDateString()
                      : "TBD"
                  }
                />
                <DetailRow
                  icon={<Calendar className="text-rose-500" size={18} />}
                  label="End Date"
                  value={
                    job.isLongTerm
                      ? "Long Term Role"
                      : job.endDate
                        ? new Date(job.endDate).toLocaleDateString()
                        : "TBD"
                  }
                />
                <div className="h-px bg-slate-100 my-2"></div>
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
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className="text-slate-900 font-extrabold text-sm truncate max-w-[50%]"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
