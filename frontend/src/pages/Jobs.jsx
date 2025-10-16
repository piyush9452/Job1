import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import axios from "axios";
import JobDetailsModal from "../components/JobDetailsModal";

export default function Jobs() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTitle = queryParams.get("title") || "";
    const initialLocation = queryParams.get("location") || "";

    const [filters, setFilters] = useState({
        profile: initialTitle,
        location: initialLocation,
        stipend: 0,
        workFromHome: false,
        partTime: false,
    });

    const [allJobs, setAllJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showFilters, setShowFilters] = useState(false); // Mobile toggle

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://jobone-mrpy.onrender.com/jobs");
                setAllJobs(res.data.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = allJobs.filter((job) => {
        const title = job.title?.toLowerCase() || "";
        const location = job.location?.toLowerCase() || "";
        const salary = Number(job.salary) || 0;
        const jobType = job.jobType?.toLowerCase() || "";

        const matchProfile = filters.profile
            ? title.includes(filters.profile.toLowerCase())
            : true;
        const matchLocation = filters.location
            ? location.includes(filters.location.toLowerCase())
            : true;
        const matchSalary = filters.stipend ? salary >= Number(filters.stipend) : true;
        const matchWFH = filters.workFromHome
            ? jobType.includes("home") || location.includes("remote")
            : true;
        const matchPartTime = filters.partTime ? jobType === "part-time" : true;

        return matchProfile && matchLocation && matchSalary && matchWFH && matchPartTime;
    });

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Loading jobs...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                {error}
            </div>
        );

    return (
        <div className="p-4 md:p-8 py-20 md:pt-[100px] bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex justify-between items-center">
                Job Results
                {/* Mobile filter button */}
                <button
                    className="md:hidden fixed top-20 right-4 bg-white px-3 py-2 rounded shadow z-50 flex items-center gap-2"
                    onClick={() => setShowFilters(true)}
                >
                    <FaFilter /> Filters
                </button>
            </h2>

            <div className="flex flex-col md:flex-row min-h-screen gap-6">
                {/* Sidebar Overlay for Mobile */}
                {showFilters && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowFilters(false)}
                    ></div>
                )}

                {/* Filter Sidebar */}
                {/* Explanation of the class changes:
                    - For mobile we keep `fixed` so the sidebar slides in from the left (as before).
                    - For md+ screens we use `md:sticky md:top-20 md:z-10` so the sidebar sits below the navbar
                      (adjust top-20 to match your navbar height) and will scroll under the navbar rather than over it.
                    - We lower the sidebar z-index on md (`md:z-10`) so the navbar (give it z-50) stays on top.
                */}
                <aside
                    className={`
                        fixed top-20 left-0 h-[calc(100vh-5rem)] w-3/4 max-w-xs bg-white shadow-md p-5 space-y-6 z-40 transform transition-transform duration-300
                        ${showFilters ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0 md:sticky md:top-20 md:h-auto md:w-1/4 md:max-w-none md:shadow-none md:z-10 rounded-lg
                    `}
                >
                    {/* Close button for mobile */}
                    <div className="flex justify-between items-center md:hidden mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-blue-600">⚙️</span> Filters
                        </h2>
                        <button onClick={() => setShowFilters(false)} className="text-gray-600">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="hidden md:block">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-blue-600">⚙️</span> Filters
                        </h2>
                    </div>

                    {/* Profile Filter */}
                    <div>
                        <label className="block text-gray-600 mb-1">Profile</label>
                        <input
                            type="text"
                            placeholder="e.g. Marketing"
                            value={filters.profile}
                            onChange={(e) => setFilters({ ...filters, profile: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="block text-gray-600 mb-1">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Delhi"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Work type checkboxes */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="accent-blue-600"
                                checked={filters.workFromHome}
                                onChange={(e) =>
                                    setFilters({ ...filters, workFromHome: e.target.checked })
                                }
                            />{" "}
                            Work from home
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="accent-blue-600"
                                checked={filters.partTime}
                                onChange={(e) =>
                                    setFilters({ ...filters, partTime: e.target.checked })
                                }
                            />{" "}
                            Part-time
                        </label>
                    </div>

                    {/* Stipend Range */}
                    <div>
                        <label className="block text-gray-600 mb-2">
                            Desired minimum monthly stipend (₹)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="1000"
                            value={filters.stipend}
                            onChange={(e) =>
                                setFilters({ ...filters, stipend: e.target.value })
                            }
                            className="w-full accent-blue-600"
                        />
                        <p className="text-sm text-gray-500 mt-1">₹{filters.stipend}</p>
                    </div>

                    <button
                        className="text-blue-600 text-sm hover:underline"
                        onClick={() =>
                            setFilters({
                                profile: "",
                                location: "",
                                stipend: 0,
                                workFromHome: false,
                                partTime: false,
                            })
                        }
                    >
                        Clear all
                    </button>

                    {/* Keyword Search */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Keyword Search</h3>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <input
                                type="text"
                                placeholder="e.g. Design, Infosys"
                                className="w-full px-3 py-2 rounded-l-lg focus:outline-none"
                            />
                            <button className="bg-blue-600 px-4 py-2 text-white rounded-r-lg">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Job List */}
                <main className="flex-1 p-0 md:p-8 space-y-6">
                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">No jobs found.</p>
                    ) : (
                        filteredJobs.map((job, index) => {
                            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                            const recruiterName = userInfo?.name || "Recruiter";

                            const postedDate = job.createdAt ? new Date(job.createdAt) : null;
                            const timeAgo = postedDate
                                ? (() => {
                                    const diff = (Date.now() - postedDate.getTime()) / 1000;
                                    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                    if (diff < 86400)
                                        return `${Math.floor(diff / 3600)} hours ago`;
                                    return `${Math.floor(diff / 86400)} days ago`;
                                })()
                                : "Recently posted";

                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedJob(job)}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                >
                                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0">
                                        {recruiterName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm mt-1">
                                            <span className="flex items-center gap-1">💼 {recruiterName}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                        📍 {job.location || "Remote"}
                      </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">⏰ {timeAgo}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                        💰 ₹{job.salary ? job.salary.toLocaleString() : "N/A"}
                      </span>
                                        </div>

                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {job.jobType && (
                                                <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 font-medium">
                          {job.jobType}
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-gray-400 hover:text-blue-500 self-start sm:self-auto mt-2 sm:mt-0">
                                        <i className="fa-regular fa-star"></i>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {selectedJob && (
                        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
                    )}
                </main>
            </div>
        </div>
    );
}