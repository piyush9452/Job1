import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Building2,
  Briefcase,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboard() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" or "employers"
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      setLoading(true);
      const storedAdmin = localStorage.getItem("adminInfo");
      if (!storedAdmin) return navigate("/admin/login");

      const { token } = JSON.parse(storedAdmin);
      const headers = { Authorization: `Bearer ${token}` };

      const [jobsRes, employersRes] = await Promise.all([
        axios.get("https://jobone-mrpy.onrender.com/api/admin/jobs/pending", {
          headers,
        }),
        axios.get(
          "https://jobone-mrpy.onrender.com/api/admin/employers/pending",
          { headers },
        ),
      ]);

      setPendingJobs(jobsRes.data);
      setPendingEmployers(employersRes.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
      if (err.response?.status === 401) navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewJob = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(
        `https://jobone-mrpy.onrender.com/api/admin/jobs/${id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to review job.");
    }
  };

  const handleReviewEmployer = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(
        `https://jobone-mrpy.onrender.com/api/admin/employers/${id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingEmployers((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert("Failed to review employer.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <ShieldAlert className="text-rose-500" size={32} /> Admin Control
              Center
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Review and approve platform content.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminInfo");
              navigate("/admin/login");
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors border border-slate-700"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === "jobs" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <Briefcase size={18} /> Pending Jobs ({pendingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("employers")}
            className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === "employers" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <Building2 size={18} /> Pending Employers ({pendingEmployers.length}
            )
          </button>
        </div>

        {/* Tab Content: JOBS */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {pendingJobs.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
                <CheckCircle
                  className="mx-auto text-emerald-400 mb-3"
                  size={48}
                />
                <h3 className="text-lg font-bold text-slate-800">
                  No Pending Jobs
                </h3>
              </div>
            ) : (
              pendingJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2">
                      <Building2 size={14} />{" "}
                      {job.postedBy?.companyName || "Unknown Company"}
                    </p>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleReviewJob(job._id, "rejected")}
                      className="px-5 py-2.5 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 hover:bg-rose-100 flex items-center gap-2"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                    <button
                      onClick={() => handleReviewJob(job._id, "active")}
                      className="px-5 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: EMPLOYERS */}
        {activeTab === "employers" && (
          <div className="space-y-4">
            {pendingEmployers.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
                <CheckCircle
                  className="mx-auto text-emerald-400 mb-3"
                  size={48}
                />
                <h3 className="text-lg font-bold text-slate-800">
                  No Pending Employers
                </h3>
              </div>
            ) : (
              pendingEmployers.map((emp) => (
                <div
                  key={emp._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {emp.companyName || emp.name}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      {emp.email}
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleReviewEmployer(emp._id, "rejected")}
                      className="px-5 py-2.5 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 hover:bg-rose-100 flex items-center gap-2"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                    <button
                      onClick={() => handleReviewEmployer(emp._id, "approved")}
                      className="px-5 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
