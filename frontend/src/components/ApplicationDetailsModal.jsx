import React, { useState } from "react";
import axios from "axios";
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
  CalendarClock,
  Loader2,
} from "lucide-react";

export default function ApplicationDetailsModal({ application, onClose }) {
  if (!application) return null;

  // FACT: Added state for the Reschedule Form
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    reason: "",
    proposedTime: "",
  });
  const [rescheduleStatus, setRescheduleStatus] = useState("idle"); // idle, loading, success, error
  const [rescheduleFeedback, setRescheduleFeedback] = useState("");

  const { job, status, appliedAt, employerMessage, applicationId } =
    application;
  const companyName = job.postedBy?.name || "Company Confidential";

  // --- RESCHEDULE HANDLER ---
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleData.reason || !rescheduleData.proposedTime) return;

    setRescheduleStatus("loading");
    setRescheduleFeedback("");

    try {
      const storedUser = localStorage.getItem("userInfo");
      const token = JSON.parse(storedUser)?.token;

      await axios.post(
        `https://jobone-mrpy.onrender.com/applications/${applicationId}/reschedule`,
        rescheduleData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRescheduleStatus("success");
      setRescheduleFeedback(
        "Reschedule request sent successfully! The employer will be notified.",
      );

      // Reset after a few seconds
      setTimeout(() => {
        setIsRescheduling(false);
        setRescheduleStatus("idle");
      }, 4000);
    } catch (err) {
      console.error("Reschedule Error:", err);
      setRescheduleStatus("error");
      setRescheduleFeedback(
        err.response?.data?.message ||
          "Failed to send request. Please try again.",
      );
    }
  };

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

  // FACT: Safe fallback for arrays vs strings
  const renderArray = (val) => {
    if (!val) return "Not specified";
    if (Array.isArray(val))
      return val.length > 0 ? val.join(", ") : "Not specified";
    return String(val);
  };

  const modeStr = renderArray(job.mode);
  const isRemote =
    modeStr.toLowerCase().includes("home") || modeStr === "Online";
  const displayLocation = isRemote
    ? "Remote"
    : typeof job.location === "object"
      ? job.location?.address
      : job.location || "Office";

  const getModeIcon = (modeString) => {
    const m = modeString.toLowerCase();
    if (m.includes("home"))
      return <Monitor size={14} className="text-slate-400" />;
    if (m.includes("hybrid"))
      return <Globe size={14} className="text-slate-400" />;
    return <Building size={14} className="text-slate-400" />;
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
        <div className="flex justify-between items-start p-6 sm:p-8 border-b border-slate-100 bg-white relative z-10 shrink-0">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-2xl font-extrabold text-indigo-600 shadow-sm shrink-0">
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

            {/* FACT: Reschedule Button Appears ONLY if Interview is Scheduled */}
            {status === "Interview Scheduled" && (
              <div className="mt-4 pl-9 relative z-10">
                {application.rescheduleRequest?.isRequested ? (
                  <div
                    className={`p-3 rounded-xl text-sm font-bold border ${
                      application.rescheduleRequest.requestStatus === "pending"
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : application.rescheduleRequest.requestStatus ===
                            "approved"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-rose-50 border-rose-200 text-rose-700"
                    }`}
                  >
                    <span className="uppercase tracking-wider text-[10px] block mb-1">
                      Reschedule Status
                    </span>
                    {application.rescheduleRequest.requestStatus ===
                      "pending" &&
                      "Pending Employer Approval for: " +
                        application.rescheduleRequest.proposedTime}
                    {application.rescheduleRequest.requestStatus ===
                      "approved" &&
                      "Approved! Check employer messages for the final link."}
                    {application.rescheduleRequest.requestStatus ===
                      "rejected" &&
                      "Request Denied. Please attend the original time or message the employer."}
                  </div>
                ) : !isRescheduling ? (
                  <button
                    onClick={() => setIsRescheduling(true)}
                    className="flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors"
                  >
                    <CalendarClock size={16} /> Request Reschedule
                  </button>
                ) : null}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2 text-xs font-extrabold opacity-70 pl-9 relative z-10">
              <Calendar size={14} /> Applied on{" "}
              {new Date(appliedAt).toLocaleDateString()}
            </div>
          </div>

          {/* FACT: Reschedule Form Modal/Dropdown */}
          {isRescheduling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-2xl p-6 border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
            >
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                <CalendarClock size={18} className="text-purple-600" /> Request
                a New Time
              </h3>

              {rescheduleStatus === "success" ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="shrink-0" />{" "}
                  {rescheduleFeedback}
                </div>
              ) : (
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Reason for Rescheduling
                    </label>
                    <textarea
                      required
                      value={rescheduleData.reason}
                      onChange={(e) =>
                        setRescheduleData({
                          ...rescheduleData,
                          reason: e.target.value,
                        })
                      }
                      placeholder="E.g., I have an unexpected medical appointment..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Proposed Date & Time
                    </label>
                    <input
                      type="text"
                      required
                      value={rescheduleData.proposedTime}
                      onChange={(e) =>
                        setRescheduleData({
                          ...rescheduleData,
                          proposedTime: e.target.value,
                        })
                      }
                      placeholder="E.g., Tomorrow at 3:00 PM EST, or Friday morning"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  {rescheduleStatus === "error" && (
                    <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg flex items-center gap-1.5">
                      <AlertCircle size={14} /> {rescheduleFeedback}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={rescheduleStatus === "loading"}
                      className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-purple-200"
                    >
                      {rescheduleStatus === "loading" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CalendarClock size={16} />
                      )}
                      {rescheduleStatus === "loading"
                        ? "Sending..."
                        : "Send Request"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* Employer Message Block */}
          {employerMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <MessageSquare size={120} />
              </div>
              <h3 className="text-sm font-extrabold text-indigo-900 mb-3 flex items-center gap-2 relative z-10">
                <MessageSquare size={16} className="text-indigo-500" /> Message
                from Employer
              </h3>
              <div className="text-indigo-900 font-medium whitespace-pre-wrap leading-relaxed text-sm bg-white/60 p-4 rounded-xl border border-indigo-100/50 relative z-10 shadow-sm">
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
                  {job.salaryFrequency || "Monthly"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Work Mode
                </p>
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                  {getModeIcon(modeStr)} {modeStr}
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
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end relative z-10 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
