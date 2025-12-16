import { useEffect, useState } from "react";
import axios from "axios";
import JobDetailsModal from "../components/JobDetailsModal";

const badgeColors = {
    "part-time": "bg-purple-100 text-purple-600",
    "short-term": "bg-green-100 text-green-600",
    daily: "bg-yellow-100 text-yellow-600",
};

function timeAgoFrom(dateString) {
    if (!dateString) return "Recently posted";
    const postedDate = new Date(dateString);
    const diff = (Date.now() - postedDate.getTime()) / 1000;
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
            <section className="py-16 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-gray-600 animate-pulse">Loading featured jobs…</p>
            </section>
        );
    }

    if (jobs.length === 0) {
        return (
            <section className="py-16 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-gray-600">No jobs posted yet.</p>
            </section>
        );
    }

    const userInfo = (() => {
        try {
            return JSON.parse(localStorage.getItem("userInfo"));
        } catch {
            return null;
        }
    })();

    const recruiterName = userInfo?.name || "Recruiter";

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 w-full">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
                <h2 className="text-4xl font-extrabold text-center tracking-tight text-gray-800 mb-3">
                    Featured Jobs
                </h2>
                <p className="text-gray-500 text-center mb-10">
                    Opportunities tailored for your next career move
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {jobs.map((job) => {
                        const avatar = job.logo ? (
                            <img
                                src={job.logo}
                                alt={job.companyName || "Company"}
                                className="w-16 h-16 rounded-xl object-contain shadow-sm bg-white"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 text-xl font-bold">
                                {recruiterName?.charAt(0).toUpperCase()}
                            </div>
                        );

                        return (
                            <div
                                key={job._id}
                                onClick={() => setSelectedJob(job)}
                                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    {avatar}

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                                            {job.title}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm mt-1">
                                            <span>💼 {recruiterName}</span>
                                            <span>•</span>
                                            <span>📍 {job.location || "Remote"}</span>
                                        </div>

                                        <div className="mt-3 text-gray-600 text-sm flex flex-wrap gap-3">
                                            <span className="flex items-center gap-1">⏰ {timeAgoFrom(job.createdAt)}</span>
                                            <span className="flex items-center gap-1">
                        💰 ₹{Number(job.salary).toLocaleString()}
                      </span>
                                        </div>

                                        {job.jobType && (
                                            <span
                                                className={`inline-block mt-3 px-3 py-1 text-sm rounded-full font-medium ${badgeColors[job.jobType] || "bg-blue-50 text-blue-700"}`}
                                            >
                        {job.jobType}
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedJob && (
                    <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
                )}
            </div>
        </section>
    );
}
