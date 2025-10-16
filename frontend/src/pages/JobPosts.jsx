import { useEffect, useState } from "react";
import axios from "axios";

export default function JobPosts() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingJobId, setEditingJobId] = useState(null);
    const [editData, setEditData] = useState({ title: "", location: "", salary: "" });

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
    const userId = userInfo?.user?.id;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);

                if (!token || !userId) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`http://localhost:5000/jobs/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setJobs(res.data || []);
            } catch (err) {
                console.error("Error fetching employer jobs:", err.response?.data || err);
                setError(err.response?.data?.message || "Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [token, userId]);

    // --- DELETE JOB ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await axios.delete(`http://localhost:5000/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove deleted job from UI
            setJobs(jobs.filter((job) => job._id !== id));
        } catch (err) {
            console.error("Error deleting job:", err.response?.data || err);
            alert(err.response?.data?.message || "Failed to delete job");
        }
    };

    // --- START EDITING ---
    const startEditing = (job) => {
        setEditingJobId(job._id);
        setEditData({
            title: job.title,
            location: job.location,
            salary: job.salary,
        });
    };

    // --- CANCEL EDIT ---
    const cancelEditing = () => {
        setEditingJobId(null);
        setEditData({ title: "", location: "", salary: "" });
    };

    // --- SAVE EDIT ---
    const saveEdit = async (id) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/jobs/${id}`,
                editData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update job in UI
            setJobs(jobs.map((job) => (job._id === id ? res.data.job : job)));
            cancelEditing();
        } catch (err) {
            console.error("Error updating job:", err.response?.data || err);
            alert(err.response?.data?.message || "Failed to update job");
        }
    };

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading jobs...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Posted Jobs</h1>

            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">You haven’t created any jobs yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white shadow-lg rounded-xl p-6">
                            {editingJobId === job._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        className="border p-1 mb-2 w-full rounded"
                                    />
                                    <input
                                        type="text"
                                        value={editData.location}
                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                        className="border p-1 mb-2 w-full rounded"
                                    />
                                    <input
                                        type="number"
                                        value={editData.salary}
                                        onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                                        className="border p-1 mb-2 w-full rounded"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => saveEdit(job._id)}
                                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                    <p className="text-gray-600 mt-1">{job.location}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Applicants: {job.applicants?.length || 0}
                                    </p>
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            onClick={() => startEditing(job)}
                                            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
