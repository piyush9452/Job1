import React from "react";
import { motion } from "framer-motion";
import { 
  X, MapPin, Briefcase, IndianRupee, Calendar, 
  Building2, CheckCircle2, XCircle, Clock, AlertCircle, MessageSquare
} from "lucide-react";

export default function ApplicationDetailsModal({ application, onClose }) {
  if (!application) return null;

  const { job, status, appliedAt } = application;
  const companyName = job.postedBy?.name || "Company Confidential";

  // Helper for Status UI
  const getStatusUI = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "hired":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 size={24} />,
          title: "You're Hired!",
          message: "Congratulations! The HR team has accepted your application. They will be in touch shortly regarding the next steps."
        };
      case "rejected":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={24} />,
          title: "Application Rejected",
          message: "Thank you for your interest. Unfortunately, the employer has decided not to move forward with your application at this time."
        };
      case "interview":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Clock size={24} />,
          title: "Interview Scheduled",
          message: "Good news! You have been shortlisted for an interview. Please check your email for the schedule."
        };
      default: // applied
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <AlertCircle size={24} />,
          title: "Application Under Review",
          message: "Your application has been sent to the employer. We will notify you once they review your profile."
        };
    }
  };

  const statusUI = getStatusUI(status);
  const displayLocation = typeof job.location === 'object' ? job.location.address : job.location || "Remote";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-gray-100"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white">
          <div className="flex gap-4">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm shrink-0">
                {companyName.charAt(0).toUpperCase()}
             </div>
             <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight line-clamp-1">{job.title}</h2>
                <div className="flex items-center gap-2 text-gray-500 font-medium mt-1 text-sm">
                    <Building2 size={14} />
                    {companyName}
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            
            {/* 1. Status Section (Word from HR) */}
            <div className={`p-6 rounded-2xl border ${statusUI.color} flex flex-col gap-3`}>
                <div className="flex items-center gap-3 font-bold text-lg">
                    {statusUI.icon}
                    {statusUI.title}
                </div>
                <div className="flex gap-3">
                    <MessageSquare size={18} className="shrink-0 mt-1 opacity-70"/>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                        {statusUI.message}
                    </p>
                </div>
                <div className="mt-2 pt-3 border-t border-black/5 flex items-center gap-2 text-xs font-semibold opacity-70">
                    <Calendar size={12} />
                    Applied on {new Date(appliedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* 2. Job Snapshot */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Job Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Salary</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <IndianRupee size={14}/> {job.salary?.toLocaleString() || "N/A"}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Job Type</p>
                        <p className="font-semibold text-gray-900 capitalize">{job.jobType}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2">
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400"/> {displayLocation}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Description Snippet */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Job Description</h3>
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto">
                    {job.description}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
            >
                Close
            </button>
        </div>

      </motion.div>
    </div>
  );
}