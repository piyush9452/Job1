import { useEffect, useState } from "react";
import axios from "axios";

export default function JobPosts() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);

                // Get user info from localStorage
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const token = userInfo?.token;
                const userId = userInfo?.user?.id; // <-- Important: match JWT payload

                if (!token || !userId) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                // Fetch jobs created by this user
                const res = await axios.get(`http://localhost:5000/jobs/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Use response directly
                setJobs(res.data || []);
            } catch (err) {
                console.error("Error fetching employer jobs:", err.response?.data || err);
                setError(err.response?.data?.message || "Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Loading jobs...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Posted Jobs</h1>

            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">You haven’t created any jobs yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600 mt-1">{job.location}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Applicants: {job.applicants?.length || 0}
                            </p>
                            <div className="flex space-x-4 mt-4">
                                <button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700">
                                    Edit
                                </button>
                                <button className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
