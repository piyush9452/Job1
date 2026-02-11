import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Clock,
} from "lucide-react";

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const application = state?.application;

  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    application?.status || "applied",
  );

  if (!application)
    return (
      <div className="h-screen flex items-center justify-center">
        No data found.
      </div>
    );

  // FIX: Destructure 'appliedBy' instead of 'applicant'
  const { appliedBy } = application;
  if (!appliedBy)
    return (
      <div className="h-screen flex items-center justify-center">
        Candidate data missing.
      </div>
    );

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Mark as ${newStatus}?`)) return;
    setLoading(true);
    try {
      const stored = localStorage.getItem("employerInfo");
      const { token } = JSON.parse(stored);
      await axios.patch(
        `https://jobone-mrpy.onrender.com/applications/${application._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCurrentStatus(newStatus);
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex gap-3">
            {/* Action Buttons using currentStatus state */}
            <button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={loading}
              className="px-5 py-2 border border-red-200 text-red-600 bg-white rounded-lg hover:bg-red-50 font-bold flex gap-2 items-center"
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              onClick={() => handleStatusUpdate("hired")}
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex gap-2 items-center shadow-md"
            >
              <CheckCircle size={18} /> Hire
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <img
                src={
                  appliedBy.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-50 shadow-sm"
              />
              <h2 className="text-2xl font-bold text-slate-900 mt-4">
                {appliedBy.name}
              </h2>
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-sm text-slate-700 break-all">
                    {appliedBy.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="text-green-500" size={18} />
                  <span className="text-sm text-slate-700">
                    {appliedBy.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Professional Summary
              </h3>
              <p className="text-slate-600">
                {appliedBy.description || "No summary provided."}
              </p>
            </div>
            {/* Add Experience/Education sections here using appliedBy.experience etc. */}
          </div>
        </div>
      </div>
    </div>
  );
}
