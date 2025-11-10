import { useEffect, useState } from "react";
import axios from "axios";
import { FaLock, FaMapMarkerAlt, FaClock, FaGlobe } from "react-icons/fa";
import JobDetailsModal from "../components/JobDetailsModal";

/**
 * FeaturedJobs (updated)
 * - Job cards now match the job list style (rounded-2xl, border, avatar fallback, meta row).
 * - Clicking a featured job opens the JobDetailsModal (same behavior as Jobs.jsx).
 */

const badgeColors = {
    "part-time": "bg-purple-100 text-purple-600",
    "short-term": "bg-green-100 text-green-600",
    "daily": "bg-yellow-100 text-yellow-600",
};

function timeAgoFrom(dateString) {
    if (!dateString) return "Recently posted";
    const postedDate = new Date(dateString);
    const diff = (Date.now() - postedDate.getTime()) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get("https://jobone-mrpy.onrender.com/jobs");
                const jobArray = data?.data || [];
                const latestJobs = jobArray.slice(-6).reverse();
                setJobs(latestJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <section className="py-12 bg-gray-50 text-center">
                <p className="text-gray-500">Loading featured jobs...</p>
            </section>
        );
    }

    if (jobs.length === 0) {
        return (
            <section className="py-12 bg-gray-50 text-center">
                <p className="text-gray-500">No jobs posted yet.</p>
            </section>
        );
    }

    // Recruiter name fallback, matching Jobs.jsx behavior (pull from localStorage)
    const userInfo = (() => {
        try {
            return JSON.parse(localStorage.getItem("userInfo"));
        } catch {
            return null;
        }
    })();
    const recruiterName = userInfo?.name || "Recruiter";

    return (
        <section className="py-12 bg-gray-50 w-full">
            <div className="w-full">
                <div className="max-w-screen-2xl mx-auto px-10">
                    <h2 className="text-3xl font-bold text-center mb-2">Featured Jobs</h2>
                    <p className="text-gray-500 text-center mb-8">
                        Know your worth and find the job that qualifies your life
                    </p>

                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2   ">
                        {jobs.map((job) => {
                            const timeAgo = timeAgoFrom(job.createdAt);
                            const salaryText = job.salary ? `₹${Number(job.salary).toLocaleString()}` : "N/A";

                            const avatar = job.logo ? (
                                <img
                                    src={job.logo}
                                    alt={job.companyName || "Company"}
                                    className="w-14 h-14 rounded-xl object-contain"
                                />
                            ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0">
                                    {recruiterName?.charAt(0).toUpperCase()}
                                </div>
                            );

                            return (
                                <article
                                    key={job._id}
                                    onClick={() => setSelectedJob(job)}
                                    className="bg-white rounded-2xl shadow-sm hover:scale-105 transition cursor-pointer border border-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setSelectedJob(job);
                                        }
                                    }}
                                    aria-label={`Open details for ${job.title}`}
                                >
                                    {avatar}

                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

                                        <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm mt-1">
                                            <span className="flex items-center gap-1">💼 {recruiterName}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">📍 {job.location || "Remote"}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">⏰ {timeAgo}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">💰 {salaryText}</span>
                                        </div>

                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {job.jobType && (
                                                <span
                                                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                                                        badgeColors[job.jobType] || "bg-blue-50 text-blue-700"
                                                    }`}
                                                >
                        {job.jobType}
                      </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-gray-400 hover:text-blue-500 self-start sm:self-auto mt-2 sm:mt-0">
                                        <i className="fa-regular fa-star"></i>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Job details modal */}
            {selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </section>
    );
}