import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Download,
  User,
  Clock,
} from "lucide-react";

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get Application Context if available (passed from JobApplicants page)
  const applicationId = location.state?.applicationId;
  const initialStatus = location.state?.status || "applied";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initialStatus);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        const token = stored ? JSON.parse(stored).token : null;

        // If viewed by employer, use token. If public, might need public endpoint or standard token.
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/user/${userId}`,
          { headers },
        );

        // Parse JSON fields if necessary
        const safeParse = (val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch (e) {
              return [];
            }
          }
          return [];
        };

        setProfile({
          ...data,
          skills: safeParse(data.skills),
          experience: safeParse(data.experience),
          education: safeParse(data.education),
        });
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleStatusUpdate = async (newStatus) => {
    if (!applicationId) return;
    if (!window.confirm(`Mark this candidate as ${newStatus.toUpperCase()}?`))
      return;

    setActionLoading(true);
    try {
      const stored = localStorage.getItem("employerInfo");
      const { token } = JSON.parse(stored);

      await axios.patch(
        `https://jobone-mrpy.onrender.com/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStatus(newStatus);
      alert(`Candidate status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  if (!profile) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* EMPLOYER ACTIONS (Only show if applicationId exists) */}
          {applicationId && (
            <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              {status === "hired" ? (
                <span className="px-6 py-2 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200 flex items-center gap-2">
                  <CheckCircle size={18} /> Hired
                </span>
              ) : status === "rejected" ? (
                <span className="px-6 py-2 bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-2">
                  <XCircle size={18} /> Rejected
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={actionLoading}
                    className="px-5 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("interview")}
                    disabled={actionLoading}
                    className="px-5 py-2 bg-white border border-purple-200 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Clock size={16} /> Interview
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("hired")}
                    disabled={actionLoading}
                    className="px-5 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2 text-sm"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}{" "}
                    Hire
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <img
                src={
                  profile.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-50 shadow-sm"
              />
              <h2 className="text-2xl font-bold text-slate-900 mt-4">
                {profile.name}
              </h2>
              <p className="text-slate-500 font-medium">Job Seeker</p>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-sm text-slate-700 break-all">
                    {profile.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="text-green-500" size={18} />
                  <span className="text-sm text-slate-700">
                    {profile.phone || "N/A"}
                  </span>
                </div>
              </div>

              {profile.resume && (
                <a
                  href={profile.resume}
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
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No skills listed.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Professional Summary
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.description || "No summary provided."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500" size={20} /> Work
                Experience
              </h3>
              <div className="space-y-8">
                {profile.experience?.length > 0 ? (
                  profile.experience.map((exp, i) => (
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
                  <p className="text-slate-400 italic">No experience added.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="text-green-500" size={20} /> Education
              </h3>
              <div className="space-y-6">
                {profile.education?.length > 0 ? (
                  profile.education.map((edu, i) => (
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
                  <p className="text-slate-400 italic">No education added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
