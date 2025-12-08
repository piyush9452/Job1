import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Filter,
  X,
  ChevronDown,
  Building2,
  Globe,
} from "lucide-react";
import JobDetailsModal from "../components/JobDetailsModal"; // Assuming this exists

export default function Jobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Initial Filters
  const [filters, setFilters] = useState({
    profile: queryParams.get("title") || "",
    location: queryParams.get("location") || "",
    stipend: 0,
    workFromHome: false,
    partTime: false,
    jobType: "all", // 'daily', 'short-term', 'part-time', 'all'
  });

  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // --- 1. FETCH JOBS ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetching all jobs (Client-side filtering for now as per your logic)
        const res = await axios.get("https://jobone-mrpy.onrender.com/jobs");

        // Support both response structures just in case
        const jobsData = res.data.data || res.data;
        setAllJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- 2. FILTER LOGIC (FIXED) ---
  const filteredJobs = allJobs.filter((job) => {
    // Helper to handle the new Location Object vs Old String
    const jobLocation =
      typeof job.location === "object"
        ? job.location?.address?.toLowerCase() || ""
        : job.location?.toLowerCase() || "";

    const title = job.title?.toLowerCase() || "";
    const salary = Number(job.salary) || 0;
    const jobType = job.jobType?.toLowerCase() || "";
    const mode = job.mode?.toLowerCase() || "";

    const matchProfile = filters.profile
      ? title.includes(filters.profile.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.profile.toLowerCase())
      : true;

    const matchLocation = filters.location
      ? jobLocation.includes(filters.location.toLowerCase())
      : true;

    const matchSalary = filters.stipend
      ? salary >= Number(filters.stipend)
      : true;

    // Enhanced logic for checkboxes
    const matchWFH = filters.workFromHome
      ? mode === "online" || title.includes("remote")
      : true;

    const matchPartTime = filters.partTime ? jobType === "part-time" : true;

    return (
      matchProfile && matchLocation && matchSalary && matchWFH && matchPartTime
    );
  });

  // --- HELPERS ---
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER & MOBILE FILTER TOGGLE */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Find Your Next Role
            </h1>
            <p className="text-gray-500 mt-2">
              Browse {filteredJobs.length} open positions matching your
              criteria.
            </p>
          </div>
          <button
            className="md:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium active:scale-95 transition-transform"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* --- SIDEBAR FILTERS --- */}
          <aside
            className={`
            fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 p-6 overflow-y-auto
            md:relative md:translate-x-0 md:w-1/4 md:shadow-none md:bg-transparent md:p-0 md:h-auto md:overflow-visible
            ${showMobileFilters ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <div className="flex justify-between items-center md:hidden mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-8 md:sticky md:top-24">
              {/* Search Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Keywords
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={filters.profile}
                      onChange={(e) =>
                        setFilters({ ...filters, profile: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="City or Zip code"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Salary Range */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 block">
                  Min Salary (Monthly)
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.stipend}
                  onChange={(e) =>
                    setFilters({ ...filters, stipend: e.target.value })
                  }
                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
                  <span>₹{Number(filters.stipend).toLocaleString()}</span>
                  <span className="text-gray-400">₹2L+</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      filters.workFromHome
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 bg-white group-hover:border-blue-400"
                    }`}
                  >
                    {filters.workFromHome && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.workFromHome}
                    onChange={(e) =>
                      setFilters({ ...filters, workFromHome: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Work from home
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      filters.partTime
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 bg-white group-hover:border-blue-400"
                    }`}
                  >
                    {filters.partTime && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.partTime}
                    onChange={(e) =>
                      setFilters({ ...filters, partTime: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Part-time only
                  </span>
                </label>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    profile: "",
                    location: "",
                    stipend: 0,
                    workFromHome: false,
                    partTime: false,
                    jobType: "all",
                  })
                }
                className="w-full py-2.5 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* --- MOBILE OVERLAY --- */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* --- JOB LIST --- */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-40 animate-pulse shadow-sm border border-gray-100"
                  ></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  No jobs found
                </h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map((job) => {
                  // Handle location object vs string
                  const displayLocation =
                    typeof job.location === "object"
                      ? job.location.address
                      : job.location || "Remote";

                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        {/* Left: Info */}
                        <div className="flex gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0">
                            {job.postedByName ? (
                              job.postedByName.charAt(0)
                            ) : (
                              <Building2 size={24} className="text-blue-400" />
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-1">
                              {job.companyName || "Company Confidential"}
                              {/* <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span> */}
                            </p>
                            <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-1">
                              {job.postedByName || "Company Confidential"}
                              {/* <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span> */}
                            </p>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                <MapPin size={14} className="text-gray-400" />
                                {displayLocation}
                              </span>
                              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                <Briefcase
                                  size={14}
                                  className="text-gray-400"
                                />
                                <span className="capitalize">
                                  {job.jobType}
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                <IndianRupee
                                  size={14}
                                  className="text-gray-400"
                                />
                                {job.salary?.toLocaleString() ||
                                  "Not disclosed"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Metadata */}
                        <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end min-w-fit">
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {formatTimeAgo(job.createdAt)}
                          </span>
                          <button className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* JOB DETAILS MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
