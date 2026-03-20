import React from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Monitor,
  Building,
  Globe,
} from "lucide-react";

export default function ApplicationDetailsModal({ application, onClose }) {
  if (!application) return null;

  const { job, status, appliedAt, employerMessage } = application;
  const companyName = job.postedBy?.name || "Company Confidential";

  // Helper to style the status section mapped to Phase 1 Schema
  const getStatusUI = (status) => {
    switch (status) {
      case "hired":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 size={24} />,
          title: "You're Hired!",
          message:
            "Congratulations! The employer has accepted your application.",
        };
      case "NCTT":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle size={24} />,
          title: "Not Considered",
          message:
            "The employer has decided not to move forward with your application at this time.",
        };
      case "Interview Scheduled":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Clock size={24} />,
          title: "Interview Scheduled",
          message:
            "You have been shortlisted for an interview! Check the message below for details.",
        };
      case "Assignment Scheduled":
        return {
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <FileText size={24} />,
          title: "Assignment Scheduled",
          message:
            "The employer has assigned you a task. Check the message below for instructions.",
        };
      case "shortlisted":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <CheckCircle2 size={24} />,
          title: "Shortlisted",
          message:
            "You have been shortlisted! The employer will contact you soon.",
        };
      default: // applied
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: <AlertCircle size={24} />,
          title: "Application Under Review",
          message:
            "Your application has been sent. We will notify you once the employer reviews it.",
        };
    }
  };

  const statusUI = getStatusUI(status);

  const isRemote = job.mode === "Work from Home";
  const displayLocation = isRemote
    ? "Remote"
    : typeof job.location === "object"
      ? job.location?.address
      : job.location || "Office";

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Work from Home":
        return <Monitor size={14} className="text-slate-400" />;
      case "Work from Office/Field":
        return <Building size={14} className="text-slate-400" />;
      case "Hybrid":
        return <Globe size={14} className="text-slate-400" />;
      default:
        return <Briefcase size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col relative border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-slate-100 bg-white relative z-10">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-2xl font-extrabold text-indigo-600 shadow-sm shrink-0">
              {job.postedBy?.image ? (
                <img
                  src={job.postedBy.image}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight line-clamp-1">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 font-bold mt-1 text-sm">
                <Building2 size={14} />
                {companyName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1 bg-slate-50/50 custom-scrollbar space-y-6">
          {/* 1. Status Section */}
          <div
            className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${statusUI.color}`}
          >
            <div className="flex items-center gap-3 font-extrabold text-lg relative z-10">
              {statusUI.icon} {statusUI.title}
            </div>
            <p className="text-sm font-bold leading-relaxed opacity-90 pl-9 mt-1 relative z-10">
              {statusUI.message}
            </p>
            <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2 text-xs font-extrabold opacity-70 pl-9 relative z-10">
              <Calendar size={14} /> Applied on{" "}
              {new Date(appliedAt).toLocaleDateString()}
            </div>
          </div>

          {/* FACT: New Employer Message Block */}
          {employerMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <MessageSquare size={100} />
              </div>
              <h3 className="text-sm font-extrabold text-indigo-900 mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-indigo-500" /> Message
                from Employer
              </h3>
              <div className="text-indigo-800 font-medium whitespace-pre-wrap leading-relaxed text-sm bg-white/60 p-4 rounded-xl border border-indigo-100/50">
                {employerMessage}
              </div>
            </motion.div>
          )}

          {/* 2. Job Snapshot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Job Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Salary
                </p>
                <p className="font-extrabold text-slate-900 flex items-center gap-1">
                  <IndianRupee size={14} className="text-slate-500" />{" "}
                  {job.salaryAmount ? job.salaryAmount.toLocaleString() : "TBD"}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  {job.salaryFrequency}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Work Mode
                </p>
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                  {getModeIcon(job.mode)} {job.mode}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400 shrink-0" />{" "}
                  <span className="truncate">{displayLocation}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. Description Snippet */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Job Description
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-sm text-slate-600 font-medium leading-relaxed max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
