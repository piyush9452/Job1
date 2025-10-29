import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ApplyPage() {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [job, setJob] = useState(null);

    const textareaRef = useRef(null);
    const navigate = useNavigate();
    const { jobId } = useParams();

    // ✅ Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(
                    `https://jobone-mrpy.onrender.com/jobs/${jobId}`
                );
                setJob(data);
            } catch (err) {
                console.error("Job fetch error:", err);
            }
        };
        if (jobId) fetchJob();
    }, [jobId]);

    // ✅ File validation
    const validateFile = (f) => {
        if (!f) return "No file selected.";
        if (!ACCEPTED_TYPES.includes(f.type)) {
            return "Unsupported file type. Please upload PDF, DOC or DOCX.";
        }
        if (f.size > MAX_FILE_SIZE) {
            return "File is too large. Max size is 5 MB.";
        }
        return "";
    };

    const handleFile = (f) => {
        const err = validateFile(f);
        if (err) {
            setError(err);
            setFile(null);
            return;
        }
        setError("");
        setFile(f);
    };

    const onFileInput = (e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    // ✅ Submit Application
    const submit = async (e) => {
        e?.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!message.trim()) {
            setError("Please tell us why we should hire you.");
            textareaRef.current?.focus();
            return;
        }
        if (!file) {
            setError("Please upload your resume (PDF / DOC / DOCX).");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", jobId);
        if (job?.title) formData.append("jobTitle", job.title);
        formData.append("message", message.trim());
        formData.append("resume", file);

        setSubmitting(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo || !userInfo.token) {
                alert("Please log in before applying.");
                navigate("/login");
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                "https://jobone-mrpy.onrender.com/applications",
                formData,
                config
            );

            setSuccessMsg(data?.message || "Application submitted successfully!");
            setMessage("");
            setFile(null);

            setTimeout(() => {
                navigate("/jobs");
            }, 1500);
        } catch (err) {
            console.error("Apply submit error:", err);
            setError(
                err?.response?.data?.message ||
                "Failed to submit application. Please try again later."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-25 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Apply for {job?.title || "this job"}
                </h1>
                <p className="text-gray-600 mb-8">
                    Please fill in the details below and upload your resume to apply.
                </p>

                <form onSubmit={submit} className="space-y-8">
                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Why should we hire you?
                        </label>
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            placeholder="Briefly explain your strengths, experience, and why you'd be a great fit..."
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload your resume
                        </label>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                            }}
                            onDrop={onDrop}
                            className={`w-full border border-dashed rounded-md p-6 flex items-center justify-between gap-4 cursor-pointer transition ${
                                dragOver
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-gray-300 bg-gray-50"
                            }`}
                            onClick={() =>
                                document.getElementById("apply-resume-input")?.click()
                            }
                        >
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <div className="text-left">
                                    <div className="text-sm text-gray-700">
                                        {file ? file.name : "Drag & drop or click to upload"}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        PDF, DOC, DOCX — max 5 MB
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById("apply-resume-input")?.click();
                                }}
                                className="px-3 py-1 rounded-md bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Browse
                            </button>

                            <input
                                id="apply-resume-input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={onFileInput}
                                className="hidden"
                            />
                        </div>

                        {file && (
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Error / Success */}
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    {successMsg && (
                        <div className="text-sm text-green-600">{successMsg}</div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
