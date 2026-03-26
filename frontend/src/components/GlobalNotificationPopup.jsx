import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function GlobalNotificationPopup() {
  const [unreadQueue, setUnreadQueue] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    const fetchUnreadApplications = async () => {
      try {
        // Only run this for Jobseekers, not Employers
        const storedUser = localStorage.getItem("userInfo");
        if (!storedUser) return;

        const userInfo = JSON.parse(storedUser);
        const { token, id } = userInfo;
        const userId = id || userInfo.userId;

        if (!token || !userId) return;

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/applications/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const apps = data.applications || [];

        // Filter ONLY unread applications that have a status change
        const unread = apps.filter(
          (app) => app.applicantHasSeen === false && app.status !== "applied",
        );

        if (unread.length > 0) {
          setUnreadQueue(unread);
          setActiveNotification(unread[0]);
        }
      } catch (error) {
        console.error("Error fetching global notifications:", error);
      }
    };

    fetchUnreadApplications();
    // Set up an interval to check every 30 seconds if they leave the tab open
    const intervalId = setInterval(fetchUnreadApplications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAcknowledge = async () => {
    if (!activeNotification) return;

    try {
      const storedUser = localStorage.getItem("userInfo");
      const { token } = JSON.parse(storedUser);

      // Tell the database this specific notification has been read
      await axios.patch(
        `https://jobone-mrpy.onrender.com/applications/${activeNotification.applicationId}/seen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Move to the next notification in the queue, if any
      const nextQueue = unreadQueue.slice(1);
      setUnreadQueue(nextQueue);
      setActiveNotification(nextQueue.length > 0 ? nextQueue[0] : null);
    } catch (error) {
      console.error("Failed to mark as seen", error);
      setActiveNotification(null); // Failsafe close
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return (
          <span className="flex justify-center items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 size={12} /> Hired
          </span>
        );
      case "NCTT":
        return (
          <span className="flex justify-center items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border border-rose-200">
            <XCircle size={12} /> Not Considered
          </span>
        );
      case "Interview Scheduled":
        return (
          <span className="flex justify-center items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border border-purple-200">
            <Clock size={12} /> Interview
          </span>
        );
      case "Assignment Scheduled":
        return (
          <span className="flex justify-center items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border border-orange-200">
            <FileText size={12} /> Assignment
          </span>
        );
      case "shortlisted":
        return (
          <span className="flex justify-center items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border border-blue-200">
            <CheckCircle2 size={12} /> Shortlisted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activeNotification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden border-t-8 border-indigo-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full animate-pulse">
                <BellRing size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Application Update!
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Status changed for{" "}
                  <span className="text-indigo-600">
                    {activeNotification.job?.title}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="px-6 py-2 bg-slate-100 rounded-xl border border-slate-200 w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center mb-1">
                  New Status
                </span>
                {getStatusBadge(activeNotification.status)}
              </div>
            </div>

            {activeNotification.employerMessage && (
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 mb-6">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MessageCircle size={14} /> Message from Employer
                </p>
                <div className="text-indigo-950 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                  {activeNotification.employerMessage}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {unreadQueue.length > 1 && (
                <span className="text-xs font-bold text-slate-400 self-center mr-auto">
                  {unreadQueue.length - 1} more update(s) pending
                </span>
              )}
              <button
                onClick={handleAcknowledge}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all w-full"
              >
                Acknowledge & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
