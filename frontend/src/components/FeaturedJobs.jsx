import { useEffect, useState } from "react";
import axios from "axios";
import { FaLock, FaMapMarkerAlt, FaClock, FaGlobe } from "react-icons/fa";

const badgeColors = {
    "part-time": "bg-purple-100 text-purple-600",
    "short-term": "bg-green-100 text-green-600",
    "daily": "bg-yellow-100 text-yellow-600",
};

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/jobs");

                // ✅ Access actual job array via data.data
                const jobArray = data.data || [];

                // ✅ Take the latest 6 jobs (most recent first)
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

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Featured Jobs</h2>
                <p className="text-gray-500 text-center mb-8">
                    Know your worth and find the job that qualifies your life
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4 hover:scale-105 transition"
                        >
                            <img
                                src={job.logo || "https://via.placeholder.com/80?text=Job"}
                                alt={job.companyName || "Company"}
                                className="w-12 h-12 rounded-lg object-contain"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <p className="text-gray-500 text-sm">{job.companyName}</p>

                                <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <FaLock /> {job.companyName}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {job.location || "Remote"}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaClock />{" "}
                                        {job.createdAt
                                            ? new Date(job.createdAt).toLocaleDateString()
                                            : "Recently posted"}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaGlobe /> {job.salary || "Not specified"}
                  </span>
                                </div>

                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {job.jobType && (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                badgeColors[job.jobType] ||
                                                "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                      {job.jobType}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
