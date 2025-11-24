import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, MapPin } from "lucide-react";

export default function EmployerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchEmployerProfile();
        fetchEmployerJobs();
    }, []);

    // ---------------- Fetch Employer Profile ----------------
    const fetchEmployerProfile = async () => {
        try {
            const info = JSON.parse(localStorage.getItem("employerToken"));

            if (!info?.token || !info?.id) {
                console.error("Employer not logged in");
                return;
            }

            const token = info.token;
            const employerID = info.id;

            const { data } = await axios.get(
                `https://jobone-mrpy.onrender.com/employer/profile/${employerID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(data);
        } catch (err) {
            console.error("Failed to load employer profile:", err);
        }
    };


    // ---------------- Fetch Jobs Posted by Employer ----------------
    const fetchEmployerJobs = async () => {
        try {
            const info = JSON.parse(localStorage.getItem("employerToken"));
            if (!info?.token) return;

            const { data } = await axios.get(
                "https://jobone-mrpy.onrender.com/jobs/employerJobs",
                {
                    headers: { Authorization: `Bearer ${info.token}` },
                }
            );

            setJobs(data.jobs || []);
        } catch (err) {
            console.error("Failed to load employer jobs:", err);
        }
    };


    if (!profile) {
        return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-15">
            {/* ---------------- Header Section ---------------- */}
            <div className="bg-blue-50 py-10 px-4">
                <div className="max-w-5xl mx-auto flex items-center gap-6">
                    <img
                        src={profile.companyLogo || "/placeholder.png"}
                        alt="Logo"
                        className="w-24 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {profile.companyName}
                        </h1>

                        <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {profile.location || "Location not added"}
                        </p>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={() => navigate(`/employereditprofile`)}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* ---------------- Tabs (Static for now) ---------------- */}
            <div className="max-w-5xl mx-auto mt-6">
                <div className="flex gap-8 border-b pb-3">
                    <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                        Overview
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        Openings
                    </button>
                </div>
            </div>

            {/* ---------------- Overview Card ---------------- */}
            <div className="max-w-5xl mx-auto mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>

                <div className="bg-white rounded-2xl shadow p-8">
                    {/* Row group 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-6">
                        <div>
                            <p className="text-gray-500">Hiring since</p>
                            <p className="text-gray-800 font-medium">
                                {profile.hiringSince || "Not mentioned"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Employee count</p>
                            <p className="text-gray-800 font-medium">
                                {profile.employeeCount || "Not mentioned"}
                            </p>
                        </div>
                    </div>

                    {/* Row group 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b py-6">
                        <div>
                            <p className="text-gray-500">Opportunities posted</p>
                            <p className="text-gray-800 font-medium">
                                {profile.opportunitiesPosted || jobs.length}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Candidates hired</p>
                            <p className="text-gray-800 font-medium">
                                {profile.candidatesHired || 0}
                            </p>
                        </div>
                    </div>

                    {/* Row group 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
                        <div>
                            <p className="text-gray-500">Location</p>
                            <p className="text-gray-800 font-medium">
                                {profile.location || "Not mentioned"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Industry</p>
                            <p className="text-gray-800 font-medium">
                                {profile.industry || "Not mentioned"}
                            </p>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            About {profile.companyName}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {profile.about || "The employer has not added an about section yet."}
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- Openings Section ---------------- */}
            <div className="max-w-5xl mx-auto mt-14">
                <h2 className="text-2xl font-semibold text-gray-800 mb-5">Openings</h2>

                {jobs.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">No jobs posted yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <motion.div
                                key={job._id}
                                whileHover={{ scale: 1.02 }}
                                className="cursor-pointer bg-white shadow p-6 rounded-xl border hover:border-blue-300"
                                onClick={() => navigate(`/job/${job._id}`)}
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    {job.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {job.description}
                                </p>
                                <p className="mt-3 text-blue-600 font-medium text-sm">
                                    {job.location}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
