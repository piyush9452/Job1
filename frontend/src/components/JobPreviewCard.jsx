import React from "react";
import {
    FaTimes,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaClock,
    FaBuilding
} from "react-icons/fa";
import { BsFacebook, BsWhatsapp, BsLinkedin } from "react-icons/bs";

export default function JobPreviewCard({ job, onClose }) {
    if (!job || !job.title) return null;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const recruiterName = userInfo?.name || "Recruiter";

    const [summaryPart, responsibilitiesPart] = job.description
        ? job.description.split("Key Responsibilities:")
        : ["", ""];

    const jobSummary = summaryPart.replace("Job Summary:", "").trim();
    const keyResponsibilities = responsibilitiesPart
        ? responsibilitiesPart
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((r) => r.trim())
        : [];

    return (
        <div className="relative bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-200 max-w-full sm:max-w-3xl mx-auto sm:my-10">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50"
                title="Close Preview"
            >
                <FaTimes size={20} />
            </button>

            {/* Job Header */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{job.title}</h2>
            <p className="text-gray-600 mb-4 flex items-center gap-2 text-sm sm:text-base">
                <FaBuilding className="text-gray-500" /> {recruiterName}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs sm:text-sm mb-6">
                <div className="flex items-center gap-1 sm:gap-2">
                    <FaMapMarkerAlt className="text-red-500" /> {job.location || "Location not specified"}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <FaClock className="text-blue-500" /> {job.jobType || "Type not specified"}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <FaMoneyBillWave className="text-green-500" /> ₹{job.salary ? job.salary.toLocaleString() : "Not specified"}
                </div>
            </div>

            {/* Job Description */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Job Description</h3>
            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line text-sm sm:text-base">
                {jobSummary || job.description || "No job description provided."}
            </p>

            {/* Key Responsibilities */}
            {keyResponsibilities.length > 0 && (
                <>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Key Responsibilities</h3>
                    <ul className="list-disc ml-4 sm:ml-6 text-gray-700 space-y-1 sm:space-y-2 mb-4 text-sm sm:text-base">
                        {keyResponsibilities.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* Skills */}
            {job.skillsRequired?.length > 0 && (
                <>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {job.skillsRequired.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm"
                            >
                {skill}
              </span>
                        ))}
                    </div>
                </>
            )}

            {/* Share Section */}
            <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Share This Job</h4>
            <div className="flex flex-wrap gap-3 mb-6">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-[#0f6ae1] text-xs sm:text-sm"
                >
                    <BsFacebook size={16} /> <span className="hidden sm:inline">Facebook</span>
                </a>
                <a
                    href={`https://wa.me/?text=Check this job: ${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-[#1ebe5a] text-xs sm:text-sm"
                >
                    <BsWhatsapp size={16} /> <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A66C2] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-[#0959a8] text-xs sm:text-sm"
                >
                    <BsLinkedin size={16} /> <span className="hidden sm:inline">LinkedIn</span>
                </a>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg w-full sm:w-auto"
                >
                    Close
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full sm:w-auto">
                    Post Job
                </button>
            </div>
        </div>
    );
}
