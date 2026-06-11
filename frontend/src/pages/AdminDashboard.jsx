import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Loader2, CheckCircle, XCircle, Building2, Briefcase,
  ShieldAlert, ExternalLink, Download, Search, Snowflake,
  Flame, LayoutDashboard, Users, LogOut, FileText
} from "lucide-react";

export default function AdminDashboard() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [allEmployers, setAllEmployers] = useState([]);
  const [allJobseekers, setAllJobseekers] = useState([]);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Manage Admins States
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("employerAdmin");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [adminRole, setAdminRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (!storedAdmin) return navigate("/admin/login");

    const parsedAdmin = JSON.parse(storedAdmin);
    setAdminRole(parsedAdmin.role);

    if (parsedAdmin.role === "jobseekerAdmin") {
      setActiveTab("allJobseekers");
    } else {
      setActiveTab("pendingJobs");
    }

    fetchInitialData(parsedAdmin);
  }, [navigate]);

  // ─── API CALLS ──────────────────────────────────────────────────────────

  const fetchInitialData = async (admin) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${admin.token}` };

      if (admin.role === "superAdmin" || admin.role === "employerAdmin") {
        const [pJobsRes, aJobsRes, pEmpRes, aEmpRes] = await Promise.all([
          axios.get("https://jobone-mrpy.onrender.com/admin/jobs/pending", { headers }).catch(() => ({ data: [] })),
          axios.get("https://jobone-mrpy.onrender.com/admin/jobs", { headers }).catch(() => ({ data: [] })),
          axios.get("https://jobone-mrpy.onrender.com/admin/employers/pending", { headers }).catch(() => ({ data: [] })),
          axios.get("https://jobone-mrpy.onrender.com/admin/employers", { headers }).catch(() => ({ data: [] }))
        ]);
        setPendingJobs(pJobsRes.data);
        setAllJobs(aJobsRes.data);
        setPendingEmployers(pEmpRes.data);
        setAllEmployers(aEmpRes.data);
      }

      if (admin.role === "superAdmin" || admin.role === "jobseekerAdmin") {
        const usersRes = await axios.get("https://jobone-mrpy.onrender.com/admin/users", { headers }).catch(() => ({ data: [] }));
        setAllJobseekers(usersRes.data);
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
      const endpoint = activeTab === "searchJobseekers" ? "/admin/search/users" : "/admin/search/employers";
      const { data } = await axios.get(`https://jobone-mrpy.onrender.com${endpoint}?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(data);
    } catch (err) {
      alert("Search failed. Check permissions.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFreezeToggle = async (id, isCurrentlyFrozen, type) => {
    if (!window.confirm(`Are you sure you want to ${isCurrentlyFrozen ? "UNFREEZE" : "FREEZE"} this account?`)) return;
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const endpoint = type === "user" ? `/admin/freeze-user/${id}` : `/admin/freeze-employer/${id}`;
      await axios.put(`https://jobone-mrpy.onrender.com${endpoint}`, { freeze: !isCurrentlyFrozen }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update Search Results locally
      setSearchResults((prev) => prev.map((item) => item._id === id ? { ...item, isFrozen: !isCurrentlyFrozen } : item));
      
      // Update All Lists locally
      if (type === "user") {
        setAllJobseekers(prev => prev.map(item => item._id === id ? { ...item, isFrozen: !isCurrentlyFrozen } : item));
      } else {
        setAllEmployers(prev => prev.map(item => item._id === id ? { ...item, isFrozen: !isCurrentlyFrozen } : item));
      }
      
      alert(`Account successfully ${isCurrentlyFrozen ? "unfrozen" : "frozen"}.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update freeze status.");
    }
  };

  const handleReviewJob = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(`https://jobone-mrpy.onrender.com/admin/jobs/${id}/review`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setPendingJobs((prev) => prev.filter((job) => job._id !== id));
      
      // Move it to allJobs conceptually or just refetch, but here we just update local state slightly
      const reviewedJob = pendingJobs.find(j => j._id === id);
      if (reviewedJob) {
        setAllJobs(prev => [{ ...reviewedJob, status }, ...prev.filter(j => j._id !== id)]);
      }
    } catch (err) {
      alert("Failed to review job.");
    }
  };

  const handleReviewEmployer = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(`https://jobone-mrpy.onrender.com/admin/employers/${id}/review`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setPendingEmployers((prev) => prev.filter((emp) => emp._id !== id));
      
      const reviewedEmp = pendingEmployers.find(e => e._id === id);
      if (reviewedEmp) {
        setAllEmployers(prev => [{ ...reviewedEmp, isApproved: status }, ...prev.filter(e => e._id !== id)]);
      }
    } catch (err) {
      alert("Failed to review employer.");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.post("https://jobone-mrpy.onrender.com/admin/create-admin", {
        name: newAdminName, email: newAdminEmail, password: newAdminPassword, role: newAdminRole,
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Admin created successfully!");
      setNewAdminName(""); setNewAdminEmail(""); setNewAdminPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleExportProfiles = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const response = await axios.get("https://jobone-mrpy.onrender.com/admin/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
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

  const canManageEmployers = adminRole === "superAdmin" || adminRole === "employerAdmin";
  const canManageJobseekers = adminRole === "superAdmin" || adminRole === "jobseekerAdmin";

  const SidebarItem = ({ id, icon: Icon, label, badgeCount }) => (
    <button
      onClick={() => { setActiveTab(id); setSearchResults([]); setSearchQuery(""); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold ${activeTab === id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === id ? "bg-white text-indigo-600" : "bg-indigo-100 text-indigo-700"}`}>
          {badgeCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* ─── LEFT SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
            <LayoutDashboard className="text-indigo-600" size={28} /> Admin Portal
          </h1>
          <div className="mt-4 px-3 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" /> 
            Role: <span className="text-indigo-600 capitalize">{adminRole}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {canManageEmployers && (
            <>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4 mb-2 mt-4">Employers & Jobs</p>
              <SidebarItem id="pendingJobs" icon={Briefcase} label="Pending Jobs" badgeCount={pendingJobs.length} />
              <SidebarItem id="pendingEmployers" icon={Building2} label="Pending Employers" badgeCount={pendingEmployers.length} />
              <SidebarItem id="allJobs" icon={FileText} label="All Jobs" badgeCount={allJobs.length} />
              <SidebarItem id="allEmployers" icon={Building2} label="All Employers" badgeCount={allEmployers.length} />
              <SidebarItem id="searchEmployers" icon={Search} label="Search / Freeze" />
            </>
          )}

          {canManageJobseekers && (
            <>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4 mb-2 mt-8">Jobseekers</p>
              <SidebarItem id="allJobseekers" icon={Users} label="All Jobseekers" badgeCount={allJobseekers.length} />
              <SidebarItem id="searchJobseekers" icon={Search} label="Search / Freeze" />
            </>
          )}

          {adminRole === "superAdmin" && (
            <>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest pl-4 mb-2 mt-8">Super Admin</p>
              <SidebarItem id="manageAdmins" icon={ShieldAlert} label="Manage Admins" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {adminRole === "superAdmin" && (
            <button
              onClick={handleExportProfiles}
              className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
              <Download size={18} /> Export DB Data
            </button>
          )}
          <button
            onClick={() => { localStorage.removeItem("adminInfo"); navigate("/admin/login"); }}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-slate-200"
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────────────────── */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* PENDING JOBS */}
          {activeTab === "pendingJobs" && canManageEmployers && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Briefcase className="text-indigo-600"/> Pending Jobs Approval</h2>
              <div className="space-y-4">
                {pendingJobs.length === 0 ? (
                  <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No pending jobs awaiting approval.</p>
                ) : (
                  pendingJobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center gap-4 shadow-sm hover:shadow-md transition">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{job.postedByCompany} • {job.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/admin/job/${job._id}`, "_blank")} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition">View Details</button>
                        <button onClick={() => handleReviewJob(job._id, "active")} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-emerald-200 transition">Approve</button>
                        <button onClick={() => handleReviewJob(job._id, "rejected")} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-bold transition">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PENDING EMPLOYERS */}
          {activeTab === "pendingEmployers" && canManageEmployers && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Building2 className="text-indigo-600"/> Pending Employers</h2>
              <div className="space-y-4">
                {pendingEmployers.length === 0 ? (
                  <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No pending employers awaiting verification.</p>
                ) : (
                  pendingEmployers.map((emp) => (
                    <div key={emp._id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center gap-4 shadow-sm hover:shadow-md transition">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{emp.companyName || emp.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{emp.email} • {emp.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/admin/employer/${emp._id}`, "_blank")} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition">Deep Dive</button>
                        <button onClick={() => handleReviewEmployer(emp._id, "approved")} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-emerald-200 transition">Approve</button>
                        <button onClick={() => handleReviewEmployer(emp._id, "rejected")} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-bold transition">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ALL JOBS */}
          {activeTab === "allJobs" && canManageEmployers && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><FileText className="text-indigo-600"/> All Jobs Database</h2>
              <div className="space-y-4">
                {allJobs.length === 0 ? (
                  <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No jobs posted on the platform yet.</p>
                ) : (
                  allJobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center gap-4 shadow-sm hover:shadow-md transition">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{job.postedByCompany} • {job.location}</p>
                        <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : job.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/admin/job/${job._id}`, "_blank")} className="px-5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition">Admin View</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ALL EMPLOYERS */}
          {activeTab === "allEmployers" && canManageEmployers && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Building2 className="text-indigo-600"/> All Employers Database</h2>
              <div className="space-y-4">
                {allEmployers.length === 0 ? (
                  <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No employers registered.</p>
                ) : (
                  allEmployers.map((emp) => (
                    <div key={emp._id} className={`bg-white p-6 rounded-2xl border ${emp.isFrozen ? "border-rose-300 bg-rose-50/30" : "border-slate-200"} flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition`}>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                          {emp.companyName || emp.name}
                          {emp.isFrozen && <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-black">Frozen</span>}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{emp.email} • {emp.phone || "No phone"}</p>
                        <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${emp.isApproved === 'approved' ? 'bg-emerald-100 text-emerald-700' : emp.isApproved === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {emp.isApproved}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/company/${emp._id}`, "_blank")} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition flex items-center gap-2"><ExternalLink size={16}/> Public View</button>
                        <button onClick={() => window.open(`/admin/employer/${emp._id}`, "_blank")} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition">Admin Deep Dive</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ALL JOBSEEKERS */}
          {activeTab === "allJobseekers" && canManageJobseekers && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Users className="text-indigo-600"/> All Jobseekers Database</h2>
              <div className="space-y-4">
                {allJobseekers.length === 0 ? (
                  <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No jobseekers registered.</p>
                ) : (
                  allJobseekers.map((user) => (
                    <div key={user._id} className={`bg-white p-6 rounded-2xl border ${user.isFrozen ? "border-rose-300 bg-rose-50/30" : "border-slate-200"} flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition`}>
                      <div className="flex items-center gap-4">
                         {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <User size={20} />
                            </div>
                          )}
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            {user.name}
                            {user.isFrozen && <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-black">Frozen</span>}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">{user.email} • {user.phone || "No phone"}</p>
                          <p className="text-xs font-semibold text-indigo-600 mt-1">{user.title || "No Title"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/profile/${user._id}`, "_blank")} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold transition flex items-center gap-2"><ExternalLink size={16}/> Public View</button>
                        <button onClick={() => window.open(`/admin/user/${user._id}`, "_blank")} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition">Admin Deep Dive</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SEARCH & FREEZE PANELS */}
          {(activeTab === "searchJobseekers" || activeTab === "searchEmployers") && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Search className="text-indigo-600"/> Security & Freeze Control</h2>
              <form onSubmit={handleSearch} className="flex gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <input
                  type="text"
                  placeholder={`Search by name, email${activeTab === "searchEmployers" ? ", or company" : ""}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
                <button type="submit" disabled={isSearching} className="bg-indigo-600 text-white px-8 font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-70">
                  {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />} Search
                </button>
              </form>

              <div className="space-y-4">
                {searchResults.length === 0 && !isSearching && searchQuery !== "" && (
                  <p className="text-slate-500 p-4 text-center">No results found.</p>
                )}
                {searchResults.map((result) => (
                  <div key={result._id} className={`bg-white p-6 rounded-2xl border ${result.isFrozen ? "border-rose-300 bg-rose-50" : "border-slate-200"} flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm`}>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                        {result.companyName || result.name}
                        {result.isFrozen && <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-black">Frozen</span>}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{result.email} • {result.phone || "No phone"}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(activeTab === "searchEmployers" ? `/admin/employer/${result._id}` : `/admin/user/${result._id}`, "_blank")}
                        className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 transition"
                      >
                        <ExternalLink size={16} /> Admin Deep Dive
                      </button>
                      <button
                        onClick={() => handleFreezeToggle(result._id, result.isFrozen, activeTab === "searchJobseekers" ? "user" : "employer")}
                        className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 text-white transition ${result.isFrozen ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-200"}`}
                      >
                        {result.isFrozen ? <><Flame size={16} /> Unfreeze</> : <><Snowflake size={16} /> Freeze Account</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MANAGE ADMINS PANEL (Super Admin Only) */}
          {activeTab === "manageAdmins" && adminRole === "superAdmin" && (
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><ShieldAlert className="text-indigo-600"/> Manage Admins</h2>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-xl">
                <h3 className="text-lg font-bold mb-6 text-slate-700">Provision New Sub-Admin</h3>
                <form onSubmit={handleCreateAdmin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Admin Name</label>
                    <input type="text" required value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                    <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="admin@jobone.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Secure Password</label>
                    <input type="password" required value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Role Type</label>
                    <select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800">
                      <option value="employerAdmin">Employer Admin (Approves Companies & Jobs)</option>
                      <option value="jobseekerAdmin">Jobseeker Admin (Manages Users)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isCreatingAdmin} className="w-full bg-indigo-600 text-white p-4 font-black text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-8">
                    {isCreatingAdmin ? <Loader2 className="animate-spin" size={20} /> : <ShieldAlert size={20} />} Create Secure Account
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
