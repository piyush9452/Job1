import React from "react";
import { FaTimes } from "react-icons/fa";

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null; // If no job selected, don't render modal

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>

                {/* Job Info */}
                <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-4">{job.company}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span>{job.type}</span>
                    <span>{job.duration}</span>
                    <span>{job.stipend}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">Job Description</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{job.description}</p>

                <h3 className="text-lg font-bold text-gray-800 mb-2">Key Responsibilities</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                    {job.responsibilities?.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
