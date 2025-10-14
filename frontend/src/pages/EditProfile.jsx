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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("userInfo"));
                const userId = storedUser?.user?._id || storedUser?.user?.id;
                const token = storedUser?.token;

                const { data } = await axios.get(`http://localhost:5000/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Parse JSON strings if backend stored arrays as strings
                if (typeof data.skills === "string") data.skills = JSON.parse(data.skills);
                if (typeof data.experience === "string") data.experience = JSON.parse(data.experience);

                setProfile(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                alert("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

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

    const handleAddExperience = () => {
        if (expForm.company && expForm.role) {
            setProfile((prev) => ({
                ...prev,
                experience: [...prev.experience, expForm],
            }));
            setExpForm({ company: "", role: "", duration: "", description: "" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProfile((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem("userInfo"));
            const userId = storedUser?.user?._id || storedUser?.user?.id;
            const token = storedUser?.token;

            const formData = new FormData();

            // Convert arrays to JSON strings
            Object.entries(profile).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const { data: updatedUser } = await axios.patch(
                `http://localhost:5000/user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // ✅ Update localStorage with fresh user data
            localStorage.setItem(
                "userInfo",
                JSON.stringify({ token, user: updatedUser })
            );

            alert("Profile updated successfully!");
            navigate("/profile"); // go back to profile page
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
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            className="mt-2 text-sm"
                            onChange={handleFileChange}
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
