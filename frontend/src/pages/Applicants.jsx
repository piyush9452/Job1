import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function ApplicantsPage() {
    const { id } = useParams(); // jobId
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const stored = localStorage.getItem("employerInfo");
                if (!stored) return;

                const { token } = JSON.parse(stored);

                const { data } = await axios.get(
                    `https://jobone-mrpy.onrender.com/jobs/${id}/applicants`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setApplicants(data || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [id]);

    if (loading)
        return (
            <p className="text-center text-xl font-semibold mt-20">Loading applicants...</p>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Applicants for This Job
            </h1>

            {applicants.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No applications yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {applicants.map((user) => (
                        <motion.div
                            key={user._id}
                            whileHover={{ scale: 1.03 }}
                            className="cursor-pointer bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition border"
                            onClick={() => navigate(`/profile/${user._id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={user.profilePicture || "https://via.placeholder.com/80"}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                                    <p className="text-gray-600 text-sm">{user.email}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-700 text-sm">
                                    <strong>Skills:</strong> {user.skills?.join(", ") || "Not added"}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
