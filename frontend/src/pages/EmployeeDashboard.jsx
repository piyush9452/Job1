import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeDashboard() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/user/applied-jobs", {
                    withCredentials: true,
                });
                setJobs(res.data);
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
            }
        };
        fetchAppliedJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Applications</h1>
            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">You haven’t applied for any jobs yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600 mt-1">{job.company}</p>
                            <p className="text-sm text-gray-500 mt-2">Status: {job.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
