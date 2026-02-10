import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  User,
} from "lucide-react";

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const application = state?.application;

  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    application?.status || "applied",
  );

  if (!application) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Applicant data missing.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { applicant } = application;

  const handleStatusUpdate = async (newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this candidate as ${newStatus.toUpperCase()}?`,
      )
    )
      return;

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
      alert(`Candidate successfully ${newStatus}!`);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* NAV & ACTIONS Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Back to Applicants
          </button>

          <div className="flex gap-3">
            {currentStatus === "hired" ? (
              <span className="px-6 py-2 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle size={18} /> Hired
              </span>
            ) : currentStatus === "rejected" ? (
              <span className="px-6 py-2 bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-2">
                <XCircle size={18} /> Rejected
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={loading}
                  className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}{" "}
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate("hired")}
                  disabled={loading}
                  className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}{" "}
                  Hire Candidate
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <img
                src={
                  applicant.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-50 shadow-sm"
              />
              <h2 className="text-2xl font-bold text-slate-900 mt-4">
                {applicant.name}
              </h2>
              <p className="text-slate-500 font-medium">Job Applicant</p>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-sm text-slate-700 break-all">
                    {applicant.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="text-green-500" size={18} />
                  <span className="text-sm text-slate-700">
                    {applicant.phone || "No Phone"}
                  </span>
                </div>
              </div>

              {application.resume && (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                >
                  <Download size={18} /> Download Resume
                </a>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={18} className="text-orange-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Professional Summary
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {applicant.description || "No summary provided by candidate."}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500" size={20} /> Work
                Experience
              </h3>
              <div className="space-y-8">
                {applicant.experience?.length > 0 ? (
                  applicant.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="relative pl-6 border-l-2 border-indigo-100"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-50 border-2 border-indigo-500"></div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {exp.role}
                      </h4>
                      <p className="text-indigo-600 font-semibold">
                        {exp.company}
                      </p>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mt-1 mb-2">
                        {exp.duration}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No experience listed.</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="text-green-500" size={20} /> Education
              </h3>
              <div className="space-y-6">
                {applicant.education?.length > 0 ? (
                  applicant.education.map((edu, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {edu.degree}
                        </h4>
                        <p className="text-slate-600 font-medium">
                          {edu.university}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-slate-400 uppercase">
                          {edu.ended}
                        </span>
                        {edu.CGPA && (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1 inline-block">
                            GPA: {edu.CGPA}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No education listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
