import React, { useState } from "react";
import {
    FaTimes,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaClock,
    FaBuilding,
} from "react-icons/fa";
import { BsFacebook, BsWhatsapp, BsLinkedin } from "react-icons/bs";
import axios from "axios";

export default function JobDetailsModal({ job, onClose }) {
    if (!job) return null;

    const [loading, setLoading] = useState(false);

    // Get logged-in user info
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const recruiterName = userInfo?.name || "Recruiter";

    // Split the description into summary and responsibilities
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

    // 🧩 Apply Button Handler
    const handleApply = async () => {
        try {
            setLoading(true);
            if (!userInfo || !userInfo.token) {
                alert("Please log in first!");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                "http://localhost:5000/applications",
                {
                    jobId: job._id,
                    jobHost: job.user, // recruiter ID from Job model
                },
                config
            );

            alert(data.message || "Application submitted successfully!");
        } catch (error) {
            console.error("Apply error:", error);
            alert(
                error.response?.data?.message || "Failed to apply for this job."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>

                {/* Job Header */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {job.title}
                </h2>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    {recruiterName}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        {job.location || "Location not specified"}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-blue-500" />
                        {job.jobType || "Type not specified"}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-500" />
                        ₹{job.salary
                        ? job.salary.toLocaleString()
                        : "Not specified"}
                    </div>
                </div>

                {/* Job Description */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                    {jobSummary || job.description || "No job description provided."}
                </p>

                {/* Key Responsibilities */}
                {keyResponsibilities.length > 0 && (
                    <>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Key Responsibilities
                        </h3>
                        <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                            {keyResponsibilities.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Skills */}
                {job.skillsRequired?.length > 0 && (
                    <>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {job.skillsRequired.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {/* Share Section */}
                <h4 className="font-semibold text-gray-800 mb-3">
                    Share This Job
                </h4>
                <div className="flex gap-3 mb-6">
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0f6ae1]"
                    >
                        <BsFacebook size={18} /> Facebook
                    </a>
                    <a
                        href={`https://wa.me/?text=Check this job: ${window.location.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1ebe5a]"
                    >
                        <BsWhatsapp size={18} /> WhatsApp
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0959a8]"
                    >
                        <BsLinkedin size={18} /> LinkedIn
                    </a>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={loading}
                        className={`${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white px-5 py-2 rounded-lg`}
                    >
                        {loading ? "Applying..." : "Apply Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
