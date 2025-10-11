import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import JobDetailsModal from "../components/JobDetailsModal";

export default function Jobs() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTitle = queryParams.get("title") || "";
    const initialLocation = queryParams.get("location") || "";

    // Filters state
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

    // Fetch jobs from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/jobs/user/:id");
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

    // Compute filtered jobs
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
        <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Results</h2>

            <div className="flex min-h-screen">
                {/* Filter Sidebar */}
                <aside className="w-1/4 bg-white shadow-md p-5 space-y-6 sticky top-0 h-screen">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-blue-600">⚙️</span> Filters
                    </h2>

                    <div>
                        <label className="block text-gray-600 mb-1">Profile</label>
                        <input
                            type="text"
                            placeholder="e.g. Marketing"
                            value={filters.profile}
                            onChange={(e) =>
                                setFilters({ ...filters, profile: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Delhi"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters({ ...filters, location: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

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
                <main className="flex-1 p-8 space-y-6 relative">
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
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 p-5 flex items-center gap-4"
                                >
                                    {/* Logo or Placeholder */}
                                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg font-bold">
                                        {recruiterName?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Job Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                💼 {recruiterName}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                📍 {job.location || "Remote"}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                ⏰ {timeAgo}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                💰 ₹{job.salary ? job.salary.toLocaleString() : "N/A"}
                                            </span>
                                        </div>

                                        {/* Job Type Tag */}
                                        <div className="flex gap-2 mt-3">
                                            {job.jobType && (
                                                <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 font-medium">
                                                    {job.jobType}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Optional Save Icon */}
                                    <div className="text-gray-400 hover:text-blue-500">
                                        <i className="fa-regular fa-star"></i>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {selectedJob && (
                        <JobDetailsModal
                            job={selectedJob}
                            onClose={() => setSelectedJob(null)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
