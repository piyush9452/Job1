import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditEmployerProfile() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        companyName: "",
        companyLogo: "",
        location: "",
        industry: "",
        hiringSince: "",
        employeeCount: "",
        candidatesHired: "",
        about: "",
    });

    const [loading, setLoading] = useState(true);

    // ---------------- Fetch Current Employer Profile ----------------
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("employerToken");

            const { data } = await axios.get(
                "https://jobone-mrpy.onrender.com/employer/profile/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setForm({
                companyName: data.companyName || "",
                companyLogo: data.companyLogo || "",
                location: data.location || "",
                industry: data.industry || "",
                hiringSince: data.hiringSince || "",
                employeeCount: data.employeeCount || "",
                candidatesHired: data.candidatesHired || "",
                about: data.about || "",
            });

            setLoading(false);
        } catch (err) {
            console.error("Failed to load profile:", err);
            setLoading(false);
        }
    };

    // ---------------- Handle Input Change ----------------
    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ---------------- Submit Update ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("employerToken");

            await axios.post(
                "https://jobone-mrpy.onrender.com/employer/updateProfile",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate(`/employerprofile`);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-400">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-15 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">

                <h1 className="text-2xl font-bold font-sans text-gray-800 mb-6">
                    Edit Profile
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Company Name */}
                    <div>
                        <label className="block text-gray-600 mb-1">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={onChange}
                            required
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Company Logo URL */}
                    <div>
                        <label className="block text-gray-600 mb-1">Company Logo URL</label>
                        <input
                            type="text"
                            name="companyLogo"
                            value={form.companyLogo}
                            onChange={onChange}
                            placeholder="https://example.com/logo.png"
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-gray-600 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={onChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-gray-600 mb-1">Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={form.industry}
                            onChange={onChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Hiring Since */}
                    <div>
                        <label className="block text-gray-600 mb-1">Hiring Since</label>
                        <input
                            type="text"
                            name="hiringSince"
                            value={form.hiringSince}
                            onChange={onChange}
                            placeholder="2020 / 2018 / etc"
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Employee Count */}
                    <div>
                        <label className="block text-gray-600 mb-1">Employee Count</label>
                        <input
                            type="number"
                            name="employeeCount"
                            value={form.employeeCount}
                            onChange={onChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Candidates Hired */}
                    <div>
                        <label className="block text-gray-600 mb-1">Candidates Hired</label>
                        <input
                            type="number"
                            name="candidatesHired"
                            value={form.candidatesHired}
                            onChange={onChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-gray-600 mb-1">About Company</label>
                        <textarea
                            name="about"
                            value={form.about}
                            onChange={onChange}
                            rows={5}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
