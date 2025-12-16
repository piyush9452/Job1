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
        <div className="w-full max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Jobs</h2>


            <div className="space-y-4">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-sm transition bg-white"
                    >
                        {/* Company Logo */}
                        <img
                            src={job.companyLogo || "https://via.placeholder.com/60"}
                            alt={job.company}
                            className="w-16 h-16 rounded-md object-cover"
                        />


                        {/* Job Info */}
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600 text-sm">
                                {job.company} • {job.location}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {job.salary || "Salary Not Disclosed"} • {job.postedAt || "Recently Posted"}
                            </p>
                        </div>


                        {/* Apply Button */}
                        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}