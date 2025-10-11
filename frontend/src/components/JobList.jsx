import React, { useState, useEffect } from "react";
import { FaHome, FaClock } from "react-icons/fa";
import axios from "axios";
import JobDetailsModal from "./JobDetailsModal";

export default function JobList() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Default hard-coded job
    const defaultJob = {
        title: "Video Editor",
        company: "Job1",
        type: "Work from home",
        stipend: "₹10,000 - ₹13,000 /month",
        duration: "6 Months",
        tags: ["Video Editing", "Adobe Premiere Pro", "Time Management"],
        time: "Few hours ago",
        description:
            "Company XYZ is seeking a driven and organized Human Resources Assistant to support our high-performance HR team. This role offers valuable experience in a variety of HR functions and contributes to building a superior workforce through a commitment to employee development and continuous improvement.",
        responsibilities: [
            "Assist with employee orientation and training logistics and maintain accurate records.",
            "Provide direct support to employees regarding the implementation of HR services, policies, and programs.",
        ],
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/jobs");
                // res.data.data contains the jobs array from your backend
                setJobs([defaultJob, ...res.data.data]);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs.");
                setJobs([defaultJob]); // fallback to default job
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Loading jobs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                {error}
            </div>
        );
    }

    return (
        <main className="flex-1 p-8 space-y-6 relative">
            {jobs.map((job, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedJob(job)}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                        <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Actively hiring
            </span>
                    </div>

                    <p className="text-gray-600 font-medium">{job.company}</p>

                    <div className="flex flex-wrap gap-6 mt-3 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <FaHome /> {job.type}
            </span>
                        <span>{job.stipend || job.salary || "Not specified"}</span>
                        <span className="flex items-center gap-1">
              <FaClock /> {job.duration || job.expiringAt || "Ongoing"}
            </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags?.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                {tag}
              </span>
                        ))}
                    </div>

                    <div className="text-green-600 text-sm mt-3">⏰ {job.time || "Recently posted"}</div>
                </div>
            ))}

            {/* Modal */}
            {selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </main>
    );
}
