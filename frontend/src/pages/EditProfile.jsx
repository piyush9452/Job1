import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
        skills: [],
        experience: [],
        profilePicture: null,
    });

    const [newSkill, setNewSkill] = useState("");
    const [expForm, setExpForm] = useState({
        company: "",
        role: "",
        duration: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ----------------------------
    //   LOAD USER PROFILE
    // ----------------------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const storedUser = JSON.parse(localStorage.getItem("userInfo"));
                const userId = storedUser?.id || storedUser?._id || storedUser?.user?.id;

                if (!token || !userId) {
                    alert("Please log in again.");
                    navigate("/login");
                    return;
                }

                const { data } = await axios.get(
                    `https://jobone-mrpy.onrender.com/user/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Backend is already returning arrays
                setProfile({
                    ...data,
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    experience: Array.isArray(data.experience) ? data.experience : [],
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                alert("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ----------------------------
    //   SKILL HANDLERS
    // ----------------------------
    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skill) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    // ----------------------------
    //   EXPERIENCE HANDLERS
    // ----------------------------
    const handleAddExperience = () => {
        if (expForm.company && expForm.role) {
            setProfile((prev) => ({
                ...prev,
                experience: [...prev.experience, expForm],
            }));
            setExpForm({ company: "", role: "", duration: "", description: "" });
        }
    };

    // ----------------------------
    //   INPUT CHANGE HANDLER
    // ----------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // ----------------------------
    //   SUBMIT UPDATE
    // ----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("userToken");
            const storedUser = JSON.parse(localStorage.getItem("userInfo"));
            const userId = storedUser?.id || storedUser?._id || storedUser?.user?.id;

            if (!token || !userId) {
                alert("Session expired. Please log in again.");
                navigate("/login");
                return;
            }

            const payload = { ...profile };
            delete payload.profilePicture;

            const { data: updatedUser } = await axios.patch(
                `https://jobone-mrpy.onrender.com/user/${userId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Save updated info back to localStorage
            localStorage.setItem(
                "userInfo",
                JSON.stringify({ ...updatedUser })
            );

            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">Loading profile...</div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Edit Profile
                </h2>

                {/* PROFILE PHOTO + BASIC INFO */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src={
                                profile.profilePicture
                                    ? typeof profile.profilePicture === "string"
                                        ? profile.profilePicture
                                        : URL.createObjectURL(profile.profilePicture)
                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <textarea
                            name="description"
                            value={profile.description || ""}
                            onChange={handleChange}
                            placeholder="Write something about yourself..."
                            className="w-full border rounded-lg px-3 py-2"
                            rows="3"
                        />
                    </div>
                </div>

                {/* SKILLS */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Skills</h3>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill"
                            className="flex-1 border rounded-lg px-3 py-2"
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-red-500 ml-1"
                                >
                  ×
                </button>
              </span>
                        ))}
                    </div>
                </div>

                {/* EXPERIENCE */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Experience</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {["company", "role", "duration", "description"].map((field) => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                value={expForm[field]}
                                onChange={(e) =>
                                    setExpForm({ ...expForm, [field]: e.target.value })
                                }
                                placeholder={field[0].toUpperCase() + field.slice(1)}
                                className="border rounded-lg px-3 py-2"
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddExperience}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Experience
                    </button>

                    <ul className="mt-4 space-y-2">
                        {profile.experience.map((exp, index) => (
                            <li key={index} className="border rounded-lg p-3 bg-gray-50">
                                <p className="font-semibold">{exp.role}</p>
                                <p className="text-sm text-gray-600">
                                    {exp.company} — {exp.duration}
                                </p>
                                <p className="text-sm">{exp.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}
