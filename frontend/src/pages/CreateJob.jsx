import React, { useState } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";

export default function CreateJob() {
    const [job, setJob] = useState({
        title: "",
        description: "",
        jobType: "daily",
        skillsRequired: [],
        location: "",
        pinCode: "",
        salary: "",
        durationType: "Day",
        startDate: "",
        endDate: "",
        dailyWorkingHours: "",
        mode: "Online",
        workFrom: "",
        workTo: "",
        noOfDays: "",
        noOfPeopleRequired: "",
        genderPreference: "No Preference",
        paymentPerHour: "",
    });

    const [jobSummary, setJobSummary] = useState("");
    const [keyResponsibilities, setKeyResponsibilities] = useState("");
    const [skillsInput, setSkillsInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSkills = () => {
        const skill = skillsInput.trim();
        if (skill && !job.skillsRequired.includes(skill)) {
            setJob({
                ...job,
                skillsRequired: [...job.skillsRequired, skill],
            });
            setSkillsInput("");
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            const combinedDescription = `
Job Summary:
${jobSummary}

Key Responsibilities:
${keyResponsibilities}
      `.trim();

            const payload = {
                ...job,
                description: combinedDescription,
                pinCode: job.pinCode ? Number(job.pinCode) : undefined,
                salary: Number(job.salary),
                paymentPerHour: Number(job.paymentPerHour),
                noOfDays: Number(job.noOfDays),
                noOfPeopleRequired: Number(job.noOfPeopleRequired),
            };

            const res = await axios.post(
                "https://jobone-mrpy.onrender.com/jobs",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Job posted successfully!");
            console.log(res.data);

            setJob({
                title: "",
                description: "",
                jobType: "daily",
                skillsRequired: [],
                location: "",
                pinCode: "",
                salary: "",
                durationType: "Day",
                startDate: "",
                endDate: "",
                dailyWorkingHours: "",
                mode: "Online",
                workFrom: "",
                workTo: "",
                noOfDays: "",
                noOfPeopleRequired: "",
                genderPreference: "No Preference",
                paymentPerHour: "",
            });
            setJobSummary("");
            setKeyResponsibilities("");
            setSkillsInput("");
            setPreview(false);
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col py-20 md:flex-row gap-10 p-8 bg-gray-50 min-h-screen">
            {/* LEFT SECTION: FORM */}
            <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md border border-gray-200 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a Job</h1>

                <div className="space-y-4">
                    <input
                        name="title"
                        value={job.title}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <textarea
                        value={jobSummary}
                        onChange={(e) => setJobSummary(e.target.value)}
                        placeholder="Job Summary"
                        className="w-full p-3 border rounded-md outline-none h-24"
                    />

                    <textarea
                        value={keyResponsibilities}
                        onChange={(e) => setKeyResponsibilities(e.target.value)}
                        placeholder="Key Responsibilities"
                        className="w-full p-3 border rounded-md outline-none h-24"
                    />

                    <select
                        name="jobType"
                        value={job.jobType}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md outline-none"
                    >
                        <option value="daily">Daily</option>
                        <option value="short-term">Short-term</option>
                        <option value="part-time">Part-time</option>
                    </select>

                    {/* Skills */}
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="Add skill (e.g. React)"
                                className="flex-1 p-3 border rounded-md outline-none"
                            />
                            <button
                                onClick={handleSkills}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {job.skillsRequired.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    <input
                        name="location"
                        value={job.location}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <input
                        name="pinCode"
                        value={job.pinCode}
                        onChange={handleChange}
                        placeholder="Pin Code"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <input
                        name="salary"
                        value={job.salary}
                        onChange={handleChange}
                        placeholder="Salary (in ₹)"
                        type="number"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    {/* --- Additional Fields (from Screenshot) --- */}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-600 mb-1">Duration</label>
                            <select
                                name="durationType"
                                value={job.durationType}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md outline-none"
                            >
                                <option value="Day">Day</option>
                                <option value="Week">Week</option>
                                <option value="Month">Month</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Mode</label>
                            <select
                                name="mode"
                                value={job.mode}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md outline-none"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-600 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={job.startDate}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={job.endDate}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md outline-none"
                            />
                        </div>
                    </div>

                    <input
                        type="number"
                        name="dailyWorkingHours"
                        value={job.dailyWorkingHours}
                        onChange={handleChange}
                        placeholder="Daily Working Hours"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <div>
                        <label className="block text-gray-600 mb-1">
                            Working Time (From – To)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="time"
                                name="workFrom"
                                value={job.workFrom}
                                onChange={handleChange}
                                className="p-3 border rounded-md outline-none"
                            />
                            <input
                                type="time"
                                name="workTo"
                                value={job.workTo}
                                onChange={handleChange}
                                className="p-3 border rounded-md outline-none"
                            />
                        </div>
                    </div>

                    <input
                        type="number"
                        name="noOfDays"
                        value={job.noOfDays}
                        onChange={handleChange}
                        placeholder="No. of Days (e.g. 5)"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <input
                        type="number"
                        name="noOfPeopleRequired"
                        value={job.noOfPeopleRequired}
                        onChange={handleChange}
                        placeholder="No. of People Required (e.g. 4)"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    <div>
                        <label className="block text-gray-600 mb-1">Gender Preference</label>
                        <select
                            name="genderPreference"
                            value={job.genderPreference}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md outline-none"
                        >
                            <option value="No Preference">No Preference</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <input
                        type="number"
                        name="paymentPerHour"
                        value={job.paymentPerHour}
                        onChange={handleChange}
                        placeholder="Payment per Hour (₹)"
                        className="w-full p-3 border rounded-md outline-none"
                    />

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => {
                                setJob({
                                    ...job,
                                    description: `
Job Summary:
${jobSummary}

Key Responsibilities:
${keyResponsibilities}
                  `.trim(),
                                });
                                setPreview(true);
                            }}
                            className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300"
                        >
                            Preview
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? "Posting..." : "Post Job"}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: LIVE PREVIEW */}
            <div className="w-full md:w-1/2">
                {preview ? (
                    <JobPreviewCard job={job} onClose={() => setPreview(false)} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Click “Preview” to see your job summary
                    </div>
                )}
            </div>
        </div>
    );
}
