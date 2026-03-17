import React from "react";
import {
  X,
  MapPin,
  IndianRupee,
  Clock,
  Building2,
  CalendarDays,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

export default function JobPreviewCard({ job, onClose }) {
  if (!job || !job.title) return null;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const recruiterName = userInfo?.name || "Recruiter";

  const [summaryPart, responsibilitiesPart] = job.description
    ? job.description.split("Key Responsibilities:")
    : ["", ""];

  const jobSummary = summaryPart.replace("Job Summary:", "").trim();
  const keyResponsibilities = responsibilitiesPart
    ? responsibilitiesPart
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((r) => r.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative bg-white shadow-2xl rounded-3xl p-8 border border-slate-100 max-w-full mx-auto overflow-hidden overflow-y-auto max-h-[85vh] custom-scrollbar"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-50"
      >
        <X size={18} />
      </button>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
          <Briefcase size={14} /> Preview Mode
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">
          {job.title}
        </h2>
        <p className="text-slate-500 flex items-center gap-2 font-medium">
          <Building2 size={16} /> {recruiterName}
        </p>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
          <p className="text-xs font-bold text-emerald-600/70 uppercase mb-1">
            Compensation
          </p>
          <p className="text-lg font-extrabold text-emerald-700 flex items-center gap-1">
            <IndianRupee size={16} />{" "}
            {job.salaryAmount
              ? Number(job.salaryAmount).toLocaleString()
              : "TBD"}
          </p>
          <p className="text-xs font-medium text-emerald-600/70 mt-0.5">
            {job.salaryFrequency}
          </p>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
          <p className="text-xs font-bold text-blue-600/70 uppercase mb-1">
            Location & Mode
          </p>
          <p
            className="text-sm font-extrabold text-blue-700 truncate"
            title={job.location || job.mode}
          >
            {job.mode === "Work from Home"
              ? "Remote"
              : job.location || "Office/Field"}
          </p>
          <p className="text-xs font-medium text-blue-600/70 mt-0.5">
            {job.mode}
          </p>
        </div>

        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-purple-600/70 uppercase mb-1">
            Work Days
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {job.workDays?.length > 0 ? (
              job.workDays.map((day, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold"
                >
                  {day.substring(0, 3)}
                </span>
              ))
            ) : (
              <span className="text-sm font-bold text-purple-700">
                Flexible
              </span>
            )}
          </div>
        </div>

        <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-orange-600/70 uppercase mb-1">
            Duration
          </p>
          <p className="text-sm font-extrabold text-orange-700">
            {job.startDate
              ? new Date(job.startDate).toLocaleDateString()
              : "TBD"}
            {" → "}
            {job.isLongTerm
              ? "Long Term"
              : job.endDate
                ? new Date(job.endDate).toLocaleDateString()
                : "TBD"}
          </p>
        </div>
      </div>

      {/* Shifts Section */}
      {job.shifts?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <Clock size={16} className="text-indigo-500" /> Shift Timings
          </h3>
          <div className="space-y-2">
            {job.shifts.map((shift, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl"
              >
                <span className="font-bold text-slate-700 text-sm">
                  {shift.shiftName}
                </span>
                <span className="font-mono text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  {shift.startTime || "--:--"} - {shift.endTime || "--:--"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          About the Role
        </h3>
        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {jobSummary || job.description || "No job description provided."}
        </p>
      </div>

      {/* Key Responsibilities */}
      {keyResponsibilities.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Key Responsibilities
          </h3>
          <ul className="space-y-3">
            {keyResponsibilities.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-600 text-sm"
              >
                <CheckCircle2
                  size={18}
                  className="text-emerald-500 shrink-0 mt-0.5"
                />
                <span className="leading-relaxed">{r.replace(/^- /, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
