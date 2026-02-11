import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

export default function JobApplicants() {
  const { id } = useParams(); // Job ID
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) return navigate("/login");

        const { token } = JSON.parse(stored);

        // 1. Get Applications
        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/applications/job/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setApplicants(data);

        // 2. Get Job Title
        const jobRes = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setJobTitle(jobRes.data.title || jobRes.data.job?.title || "Job");
      } catch (err) {
        console.error("Failed to load applicants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    const styles = {
      applied: "bg-blue-50 text-blue-700 border-blue-200",
      shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",
      interview: "bg-purple-50 text-purple-700 border-purple-200",
      hired: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.applied}`}
      >
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-2 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Back to Job
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Applicants for {jobTitle}
            </h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            Total: <span className="text-blue-600">{applicants.length}</span>
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No applications yet
            </h3>
            <p className="text-slate-500">
              Candidates will appear here once they apply.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((app) => {
              // FIX: Use 'appliedBy' instead of 'applicant'
              const candidate = app.appliedBy;
              if (!candidate) return null; // Safety check

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={
                          candidate.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm bg-slate-100"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 leading-tight truncate">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Applied:{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">{getStatusBadge(app.status)}</div>

                    <div className="space-y-3 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span>{candidate.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50">
                    <button
                      onClick={() =>
                        navigate(`/application/${app._id}`, {
                          state: { application: app },
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                    >
                      View Full Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
