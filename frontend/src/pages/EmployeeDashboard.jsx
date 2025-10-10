import { useEffect, useState } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard";

export default function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
                const { data } = await axios.get("http://localhost:5000/jobs/myjobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobs(data);
            } catch (error) {
                console.error("Error fetching employer jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <p>Loading your jobs...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Your Posted Jobs</h1>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <JobPreviewCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
}
