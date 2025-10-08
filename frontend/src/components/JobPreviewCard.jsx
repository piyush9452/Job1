import React from "react";
import { FaTimes } from "react-icons/fa";

export default function JobPreviewCard({ job, onClose }) {
    if (!job.title) return null;

    return (
        <div className="relative bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Close (Cut) Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                title="Close Preview"
            >
                <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{job.location}</p>
            <p className="mt-4 text-gray-700">{job.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <p>💼 {job.jobType}</p>
                <p>💰 ₹{job.salary}</p>
            </div>
        </div>
    );
}
