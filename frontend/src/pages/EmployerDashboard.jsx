import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Briefcase,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  RefreshCw,
  Power,
  Clock,
  ShieldAlert,
  XOctagon,
} from "lucide-react";
import axios from "axios";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [employerName, setEmployerName] = useState("Employer");
  const [loading, setLoading] = useState(true);

  // FACT: Added approval status state to lock the dashboard
  const [approvalStatus, setApprovalStatus] = useState("pending");

  // Dynamic Stats
  const activeListings = jobs.filter((j) => j.status === "active").length;
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.stats?.total || 0),
    0,
  );
  const totalHired = jobs.reduce(
    (sum, job) => sum + (job.stats?.hired || 0),
    0,
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) {
          navigate("/login");
          return;
        }

        const employerInfo = JSON.parse(stored);
        const token = employerInfo?.token;

        if (employerInfo.id || employerInfo.employerId) {
          try {
            const profileRes = await axios.get(
              `https://jobone-mrpy.onrender.com/employer/profile/${employerInfo.id || employerInfo.employerId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            setEmployerName(
              profileRes.data.name || profileRes.data.companyName || "Employer",
            );

            // FACT: Extract the security status directly from the database response
            setApprovalStatus(profileRes.data.isApproved || "pending");
          } catch (profileErr) {
            console.error("Could not load employer profile name", profileErr);
          }
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/employerJobs`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      const stored = localStorage.getItem("employerInfo");
      const token = JSON.parse(stored).token;

      await axios.put(
        `https://jobone-mrpy.onrender.com/jobs/${jobId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setJobs(
        jobs.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j)),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update job status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employerInfo");
    navigate("/login");
  };

  const handleRepost = (job) => {
    navigate("/createjob", { state: { repostData: job } });
  };

  return (
    <div className="min-h-screen py-20 bg-slate-50 p-10 font-sans">
      {/* Sidebar */}

      <aside className="fixed left-0 top-15 hidden h-full w-64 border-r border-slate-200 bg-white p-6 md:block z-20">
        <div className="h-[50px] w-[100%]"></div>
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Briefcase size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            JobOne
          </span>
        </div>
        <nav className="space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          {/* FACT: Only show these tabs if approved */}
          {approvalStatus === "approved" && (
            <>
              <NavItem icon={<Users size={20} />} label="Candidates" />
              <NavItem icon={<Settings size={20} />} label="Settings" />
            </>
          )}
        </nav>
        <div className="absolute bottom-8 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 px-4 sm:px-8 relative">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Welcome back, {employerName}!
            </h1>
            <p className="mt-1 text-slate-500">
              {approvalStatus === "approved"
                ? "Here's a live overview of your hiring pipeline."
                : "Your account security status overview."}
            </p>
          </div>

          {/* FACT: Hide Post Job button if not approved */}
          {approvalStatus === "approved" && (
            <button
              onClick={() => navigate("/createjob")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
            >
              <PlusCircle size={18} /> Post New Job
            </button>
          )}
        </header>

        {loading ? (
          <div className="p-20 flex justify-center text-slate-400">
            <RefreshCw size={32} className="animate-spin" />
          </div>
        ) : approvalStatus === "pending" ? (
          /* FACT: The Pending Lock Screen */
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-16 text-center flex flex-col items-center justify-center max-w-3xl mx-auto mt-10">
            <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 border-8 border-orange-100/50">
              <Clock size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Account Pending Review
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
              To ensure the highest quality of opportunities on our platform,
              our administration team manually verifies all new employer
              accounts.
              <br />
              <br />
              You will be granted full access to post jobs and review candidates
              once your profile is approved.
            </p>
            <div className="mt-8 flex items-center gap-2 bg-slate-50 text-slate-600 px-6 py-3 rounded-xl border border-slate-200 font-bold text-sm">
              <ShieldAlert size={18} className="text-slate-400" /> Current
              Status: <span className="text-orange-500">Under Review</span>
            </div>
          </div>
        ) : approvalStatus === "rejected" ? (
          /* FACT: The Rejected Lock Screen */
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-16 text-center flex flex-col items-center justify-center max-w-3xl mx-auto mt-10">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 border-8 border-rose-100/50">
              <XOctagon size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Registration Denied
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
              Unfortunately, our administration team has declined your employer
              registration at this time. If you believe this is a mistake,
              please contact support.
            </p>
          </div>
        ) : (
          /* FACT: The Normal Approved Dashboard */
          <>
            {/* Quick Stats Grid */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <StatCard
                label="Active Listings"
                value={activeListings}
                color="blue"
              />
              <StatCard
                label="Total Applicants"
                value={totalApplicants}
                color="purple"
              />
              <StatCard
                label="Total Hired"
                value={totalHired}
                color="emerald"
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Job Management Tracker
                </h2>
              </div>

              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No job posts yet
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Get started by creating your first listing.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                        <th className="p-4 font-bold">Job Title & Details</th>
                        <th className="p-4 font-bold text-center">Status</th>
                        <th className="p-4 font-bold text-center border-l border-slate-100 bg-slate-50/50">
                          Total
                        </th>
                        <th className="p-4 font-bold text-center text-blue-600 bg-blue-50/30">
                          Shortlisted
                        </th>
                        <th className="p-4 font-bold text-center text-purple-600 bg-purple-50/30">
                          Int. Scheduled
                        </th>
                        <th className="p-4 font-bold text-center text-orange-600 bg-orange-50/30">
                          Int. Conducted
                        </th>
                        <th className="p-4 font-bold text-center text-orange-600 bg-orange-50/30">
                          Assignment Scheduled
                        </th>
                        <th className="p-4 font-bold text-center text-emerald-600 bg-emerald-50/30">
                          Hired
                        </th>
                        <th className="p-4 font-bold text-center text-rose-600 bg-rose-50/30">
                          NCTT
                        </th>
                        <th className="p-4 font-bold text-right border-l border-slate-100">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs.map((job) => (
                        <tr
                          key={job._id}
                          onClick={() => navigate(`/job/${job._id}`)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          {/* Job Title & Details */}
                          <td className="p-4">
                            <div className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                              <Clock size={12} /> Posted:{" "}
                              {new Date(job.postedAt).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                job.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>

                          {/* Metrics */}
                          <td className="p-4 text-center font-extrabold text-slate-700 border-l border-slate-100 bg-slate-50/50">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/job/${job._id}/applicants`);
                              }}
                              className="cursor-pointer hover:text-indigo-600 hover:underline transition-colors block w-full"
                              title="View All Applicants"
                            >
                              {job.stats?.total || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-blue-700 bg-blue-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=shortlisted`,
                                );
                              }}
                              className="cursor-pointer hover:text-blue-900 hover:underline transition-colors block w-full"
                              title="View Shortlisted"
                            >
                              {job.stats?.shortlisted || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-purple-700 bg-purple-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=Interview Scheduled`,
                                );
                              }}
                              className="cursor-pointer hover:text-purple-900 hover:underline transition-colors block w-full"
                              title="View Interview Scheduled"
                            >
                              {job.stats?.interviewScheduled || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-orange-700 bg-orange-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=Interview Conducted`,
                                );
                              }}
                              className="cursor-pointer hover:text-orange-900 hover:underline transition-colors block w-full"
                              title="View Interview Conducted"
                            >
                              {job.stats?.interviewConducted || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-amber-700 bg-amber-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=Assignment Scheduled`,
                                );
                              }}
                              className="cursor-pointer hover:text-amber-900 hover:underline transition-colors block w-full"
                              title="View Assignment Scheduled"
                            >
                              {job.stats?.assignmentScheduled || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-emerald-700 bg-emerald-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=hired`,
                                );
                              }}
                              className="cursor-pointer hover:text-emerald-900 hover:underline transition-colors block w-full"
                              title="View Hired"
                            >
                              {job.stats?.hired || 0}
                            </span>
                          </td>

                          <td className="p-4 text-center font-bold text-rose-700 bg-rose-50/30">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job/${job._id}/applicants?status=NCTT`,
                                );
                              }}
                              className="cursor-pointer hover:text-rose-900 hover:underline transition-colors block w-full"
                              title="View NCTT"
                            >
                              {job.stats?.nctt || 0}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right border-l border-slate-100">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRepost(job);
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Repost Job"
                              >
                                <RefreshCw size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleJobStatus(job._id, job.status);
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  job.status === "active"
                                    ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                                }`}
                                title={
                                  job.status === "active"
                                    ? "Close Job"
                                    : "Reactivate Job"
                                }
                              >
                                <Power size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <h4 className="text-3xl font-extrabold text-slate-900">{value}</h4>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold ${colors[color]}`}
        >
          Live
        </span>
      </div>
    </div>
  );
}
