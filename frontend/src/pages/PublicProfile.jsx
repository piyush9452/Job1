import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublicProfile = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(
                    `https://jobone-mrpy.onrender.com/user/${userId}`
                );

                if (typeof data.skills === "string") data.skills = JSON.parse(data.skills);
                if (typeof data.experience === "string") data.experience = JSON.parse(data.experience);

                setProfile(data);
            } catch (error) {
                console.error("Error fetching public profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row content-center w-[100vw] p-8 md:p-16 gap-6">

            {/* LEFT SIDEBAR */}
            <div className="w-full md:w-[400px] flex flex-col gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center">
                    <img
                        src={
                            profile?.profilePicture ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="User"
                        className="w-[100px] h-[100px] rounded-full object-cover"
                    />

                    <div className="text-center mt-2">
                        <h3 className="text-4xl font-semibold">{profile.name}</h3>
                        <p className="text-gray-700 mt-1">{profile.email}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl">
                    <h1 className="text-2xl text-center mb-2">Basic Details</h1>
                    <ul>
                        <li className="bg-white mt-2.5 p-2.5">
                            Phone Number : {profile.phone || "Hidden"}
                        </li>
                        <li className="bg-white mt-2.5 p-2.5">
                            JobOne ID : {profile._id}
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex-1 bg-blue-50 p-8 rounded-2xl flex flex-col gap-5">

                <h1 className="text-4xl text-center mb-5 font-semibold">
                    Professional Profile
                </h1>

                {/* Professional Summary */}
                <div className="bg-white p-4 min-h-[200px] rounded-xl">
                    <h1 className="text-3xl mb-3 font-semibold">Professional Summary</h1>
                    <p>{profile.description || "No summary provided."}</p>
                </div>

                {/* Skills */}
                <div className="bg-white p-4 min-h-[150px] rounded-xl">
                    <h1 className="text-3xl mb-3 font-semibold">Skills</h1>
                    {profile?.skills?.length > 0 ? (
                        <ul className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, i) => (
                                <li
                                    key={i}
                                    className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Skills Listed</p>
                    )}
                </div>

                {/* Experience */}
                <div className="bg-white p-4 min-h-[150px] rounded-xl">
                    <h1 className="text-3xl mb-3 font-semibold">Experience</h1>
                    {profile?.experience?.length > 0 ? (
                        <ul>
                            {profile.experience.map((exp, i) => (
                                <li key={i} className="mb-3">
                                    <p className="font-bold">{exp.role}</p>
                                    <p>
                                        {exp.company} — {exp.duration}
                                    </p>
                                    <p>{exp.description}</p>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Experience Found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
