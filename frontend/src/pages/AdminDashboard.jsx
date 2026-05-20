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
  ExternalLink,
  Download,
  Search,
  Snowflake,
  Flame,
} from "lucide-react";

export default function AdminDashboard() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingEmployers, setPendingEmployers] = useState([]);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [adminRole, setAdminRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (!storedAdmin) return navigate("/admin/login");

    const parsedAdmin = JSON.parse(storedAdmin);
    setAdminRole(parsedAdmin.role);

    // FACT: Set default tab based on RBAC Role
    if (parsedAdmin.role === "jobseekerAdmin") {
      setActiveTab("searchJobseekers");
    } else {
      setActiveTab("jobs");
    }

    fetchPendingData(parsedAdmin);
  }, []);

  // ─── API CALLS ──────────────────────────────────────────────────────────

  const fetchPendingData = async (admin) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${admin.token}` };

      // Only fetch pending data if the admin is allowed to see employers/jobs
      if (admin.role === "superAdmin" || admin.role === "employerAdmin") {
        const [jobsRes, employersRes] = await Promise.all([
          axios
            .get("https://jobone-mrpy.onrender.com/admin/jobs/pending", {
              headers,
            })
            .catch(() => ({ data: [] })),
          axios
            .get("https://jobone-mrpy.onrender.com/admin/employers/pending", {
              headers,
            })
            .catch(() => ({ data: [] })),
        ]);
        setPendingJobs(jobsRes.data);
        setPendingEmployers(employersRes.data);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const endpoint =
        activeTab === "searchJobseekers"
          ? "/admin/search/users"
          : "/admin/search/employers";

      const { data } = await axios.get(
        `https://jobone-mrpy.onrender.com${endpoint}?q=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSearchResults(data);
    } catch (err) {
      alert("Search failed. Check permissions.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFreezeToggle = async (id, isCurrentlyFrozen, type) => {
    if (
      !window.confirm(
        `Are you sure you want to ${isCurrentlyFrozen ? "UNFREEZE" : "FREEZE"} this account?`,
      )
    )
      return;

    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const endpoint =
        type === "user"
          ? `/admin/freeze-user/${id}`
          : `/admin/freeze-employer/${id}`;

      await axios.put(
        `https://jobone-mrpy.onrender.com${endpoint}`,
        { freeze: !isCurrentlyFrozen },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local search state to reflect the change
      setSearchResults((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isFrozen: !isCurrentlyFrozen } : item,
        ),
      );
      alert(
        `Account successfully ${isCurrentlyFrozen ? "unfrozen" : "frozen"}.`,
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update freeze status.");
    }
  };

  // ... (Keep existing handleReviewJob, handleReviewEmployer, handleExportProfiles here) ...
  const handleReviewJob = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(
        `https://jobone-mrpy.onrender.com/admin/jobs/${id}/review`,
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
        `https://jobone-mrpy.onrender.com/admin/employers/${id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingEmployers((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert("Failed to review employer.");
    }
  };

  const handleExportProfiles = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const response = await axios.get(
        "https://jobone-mrpy.onrender.com/admin/export",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Platform_Profiles_Extraction.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to extract profiles.");
    }
  };

  if (loading || !adminRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  // FACT: Permissions Logic based on Role
  const canManageEmployers =
    adminRole === "superAdmin" || adminRole === "employerAdmin";
  const canManageJobseekers =
    adminRole === "superAdmin" || adminRole === "jobseekerAdmin";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <ShieldAlert className="text-rose-500" size={32} /> Admin Control
              Center
            </h1>
            <p className="text-slate-400 font-medium mt-2 capitalize tracking-wide">
              Logged in as: <span className="text-indigo-400">{adminRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {adminRole === "superAdmin" && (
              <button
                onClick={handleExportProfiles}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
              >
                <Download size={18} /> Export Data
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem("adminInfo");
                navigate("/admin/login");
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold border border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* FACT: RBAC TABS */}
        <div className="flex gap-4 border-b border-slate-200 pb-px overflow-x-auto">
          {canManageEmployers && (
            <>
              <button
                onClick={() => {
                  setActiveTab("jobs");
                  setSearchResults([]);
                }}
                className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "jobs" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Briefcase size={18} /> Pending Jobs ({pendingJobs.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("employers");
                  setSearchResults([]);
                }}
                className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "employers" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Building2 size={18} /> Pending Employers (
                {pendingEmployers.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("searchEmployers");
                  setSearchResults([]);
                  setSearchQuery("");
                }}
                className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "searchEmployers" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Search size={18} /> Search & Freeze Employers
              </button>
            </>
          )}
          {canManageJobseekers && (
            <button
              onClick={() => {
                setActiveTab("searchJobseekers");
                setSearchResults([]);
                setSearchQuery("");
              }}
              className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "searchJobseekers" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              <Search size={18} /> Search & Freeze Jobseekers
            </button>
          )}
        </div>

        {/* ─── TAB CONTENT ────────────────────────────────────────── */}

        {/* PENDING JOBS */}
        {activeTab === "jobs" && canManageEmployers && (
          <div className="space-y-4">
            {pendingJobs.length === 0 ? (
              <p className="text-slate-500 p-4">No pending jobs.</p>
            ) : (
              pendingJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-slate-500">
                      {job.postedByCompany}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(`/admin/job/${job._id}`, "_blank")
                      }
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleReviewJob(job._id, "active")}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewJob(job._id, "rejected")}
                      className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PENDING EMPLOYERS */}
        {activeTab === "employers" && canManageEmployers && (
          <div className="space-y-4">
            {pendingEmployers.length === 0 ? (
              <p className="text-slate-500 p-4">No pending employers.</p>
            ) : (
              pendingEmployers.map((emp) => (
                <div
                  key={emp._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      {emp.companyName || emp.name}
                    </h3>
                    <p className="text-sm text-slate-500">{emp.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(`/admin/employer/${emp._id}`, "_blank")
                      }
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleReviewEmployer(emp._id, "approved")}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewEmployer(emp._id, "rejected")}
                      className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* FACT: SEARCH & FREEZE PANELS */}
        {(activeTab === "searchJobseekers" ||
          activeTab === "searchEmployers") && (
          <div className="space-y-6">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
            >
              <input
                type="text"
                placeholder={`Search by name, email${activeTab === "searchEmployers" ? ", or company" : ""}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-indigo-600 text-white px-6 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700"
              >
                {isSearching ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Search size={18} />
                )}{" "}
                Search
              </button>
            </form>

            <div className="space-y-4">
              {searchResults.length === 0 && !isSearching && (
                <p className="text-slate-500 ml-2">No results found.</p>
              )}
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className={`bg-white p-6 rounded-2xl border ${result.isFrozen ? "border-rose-300 bg-rose-50/30" : "border-slate-200"} flex flex-col sm:flex-row justify-between items-center gap-4`}
                >
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {result.companyName || result.name}
                      {result.isFrozen && (
                        <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-1 rounded-md uppercase tracking-wider">
                          Frozen
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {result.email} • {result.phone || "No phone"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Joined: {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* View Profile Button based on type */}
                    <button
                      onClick={() =>
                        window.open(
                          activeTab === "searchEmployers"
                            ? `/admin/employer/${result._id}`
                            : `/profile/${result._id}`,
                          "_blank",
                        )
                      }
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                      <ExternalLink size={16} /> Profile
                    </button>

                    {/* FACT: The Freeze/Unfreeze Action */}
                    <button
                      onClick={() =>
                        handleFreezeToggle(
                          result._id,
                          result.isFrozen,
                          activeTab === "searchJobseekers"
                            ? "user"
                            : "employer",
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 text-white ${result.isFrozen ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"}`}
                    >
                      {result.isFrozen ? (
                        <>
                          <Flame size={16} /> Unfreeze
                        </>
                      ) : (
                        <>
                          <Snowflake size={16} /> Freeze Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
