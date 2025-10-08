import React, { useState } from "react";
import { FaHome, FaClock } from "react-icons/fa";
import JobDetailsModal from "./JobDetailsModal";

export default function JobList({ jobs }) {

    const [selectedJob, setSelectedJob] = useState(null);
    const job = [
        {
            title: "Video Editor",
            company: "Job1",
            type: "Work from home",
            stipend: "₹10,000 - ₹13,000 /month",
            duration: "6 Months",
            tags: ["Video Editing", "Adobe Premiere Pro", "Time Management"],
            time: "Few hours ago",
            description: "Company XYZ is seeking a driven and organized Human Resources Assistant to support our high-performance HR team. This role offers valuable experience in a variety of HR functions and contributes to building a superior workforce through a commitment to employee development and continuous improvement. ",
            responsibilities: ["Assist with employee orientation and training logistics and maintain accurate records.\n" +
                "Provide direct support to employees regarding the implementation of HR services, policies, and programs."]
        }
    ];

    return (
        <main className="flex-1 p-8 space-y-6 relative">
            {job.map((job, index) => (
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
                        <span>{job.stipend}</span>
                        <span className="flex items-center gap-1">
              <FaClock /> {job.duration}
            </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                {tag}
              </span>
                        ))}
                    </div>

                    <div className="text-green-600 text-sm mt-3">⏰ {job.time}</div>
                </div>
            ))}

            {/* Modal */}
            {selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </main>
    );
}
