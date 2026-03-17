import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
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
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!job) return null;

  const handleApplyClick = async () => {
    setLoading(true);
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (!storedUserInfo) {
        alert("Please log in to apply.");
        navigate("/login");
        return;
      }

      const token = JSON.parse(storedUserInfo)?.token;
      if (!token) throw new Error("No token");

      await axios.post(
        "https://jobone-mrpy.onrender.com/applications",
        { jobId: job._id || job.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Application failed:", error);
      alert(error.response?.data?.message || "Failed to apply for job.");
    } finally {
      setLoading(false);
    }
  };

  const displayLocation =
    job.mode === "Work from Home"
      ? "Remote"
      : typeof job.location === "object"
        ? job.location.address
        : job.location || "Office";
  const companyName =
    job.postedByCompany || job.postedByName || "Company Confidential";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-500 font-medium mt-1.5 text-sm">
                <span className="flex items-center gap-1.5">
                  <Building2 size={16} className="text-slate-400" />{" "}
                  {companyName}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />{" "}
                  {displayLocation.split(",")[0]}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 bg-slate-50/50 custom-scrollbar">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <IndianRupee size={18} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Compensation
              </p>
              <p className="font-extrabold text-slate-900 mt-1">
                {job.salaryAmount ? job.salaryAmount.toLocaleString() : "TBD"}
              </p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5 uppercase">
                {job.salaryFrequency}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Briefcase size={18} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Work Mode
              </p>
              <p className="font-extrabold text-slate-900 mt-1 truncate">
                {job.mode}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Calendar size={18} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Duration
              </p>
              <p className="font-extrabold text-slate-900 mt-1">
                {job.isLongTerm
                  ? "Long Term"
                  : job.noOfDays
                    ? `${job.noOfDays} Days`
                    : "Fixed"}
              </p>
              <p className="text-[10px] font-bold text-purple-600 mt-0.5 truncate uppercase">
                {job.startDate
                  ? new Date(job.startDate).toLocaleDateString()
                  : "TBD"}{" "}
                START
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                <Users size={18} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Openings
              </p>
              <p className="font-extrabold text-slate-900 mt-1">
                {job.noOfPeopleRequired} Spots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="text-indigo-500" size={20} /> About the
                  Role
                </h3>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  {job.description}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Shifts & Days */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide border-b border-slate-100 pb-3">
                  Schedule Info
                </h3>

                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                    Work Days
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.workDays?.length > 0 ? (
                      job.workDays.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md"
                        >
                          {d.substring(0, 3)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-medium text-slate-600">
                        Flexible Days
                      </span>
                    )}
                  </div>
                </div>

                {job.shifts?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                      Shifts
                    </p>
                    <div className="space-y-2">
                      {job.shifts.map((s, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-indigo-50/50 px-3 py-2 rounded-lg border border-indigo-50/50"
                        >
                          <span className="text-xs font-bold text-indigo-900">
                            {s.shiftName}
                          </span>
                          <span className="text-xs font-mono font-medium text-indigo-700">
                            {s.startTime} - {s.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide border-b border-slate-100 pb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex gap-4 sticky bottom-0 z-20">
          <button
            onClick={handleApplyClick}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Sending
                Application...
              </>
            ) : (
              <>
                Apply for this Job <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
