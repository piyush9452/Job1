import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
        skills: [],
        experience: [],
        resume: null,
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

    // ✅ Fetch user info on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                if (!userInfo) return;

                const token = localStorage.getItem("token");
                const { data } = await axios.get(
                    `http://localhost:5000/user/${userInfo.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProfile((prev) => ({
                    ...prev,
                    ...data,
                }));
            } catch (error) {
                console.error("Error fetching user:", error);
                alert("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ✅ Add new skill
    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    // ✅ Remove skill
    const handleRemoveSkill = (skill) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    // ✅ Add new experience
    const handleAddExperience = () => {
        if (expForm.company && expForm.role) {
            setProfile((prev) => ({
                ...prev,
                experience: [...prev.experience, expForm],
            }));
            setExpForm({ company: "", role: "", duration: "", description: "" });
        }
    };

    // ✅ Handle general input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle file uploads
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };

    // ✅ Submit updated profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = localStorage.getItem("token");

            if (!userInfo || !token) {
                alert("You are not logged in!");
                return;
            }

            const formData = new FormData();
            Object.entries(profile).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            await axios.patch(
                `http://localhost:5000/user/${userInfo.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update profile");
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
                <h2 className="text-3xl font-bold text-center text-gray-800">User Profile</h2>

                {/* Profile Info */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src={
                                profile.profilePicture
                                    ? typeof profile.profilePicture === "string"
                                        ? profile.profilePicture
                                        : URL.createObjectURL(profile.profilePicture)
                                    : "https://via.placeholder.com/150"
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
                        <p><span className="font-semibold">Name:</span> {profile.name}</p>
                        <p><span className="font-semibold">Email:</span> {profile.email}</p>
                        <p><span className="font-semibold">Phone:</span> {profile.phone}</p>

                        <div>
                            <label className="block font-semibold mb-1">Description</label>
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
                </div>

                {/* Skills Section */}
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

                {/* Experience Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Experience</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="company"
                            value={expForm.company}
                            onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                            placeholder="Company"
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            name="role"
                            value={expForm.role}
                            onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                            placeholder="Role"
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            name="duration"
                            value={expForm.duration}
                            onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                            placeholder="Duration (e.g., 6 months)"
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            name="description"
                            value={expForm.description}
                            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                            placeholder="Description"
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddExperience}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Experience
                    </button>

                    {/* Display Experiences */}
                    <ul className="mt-4 space-y-2">
                        {profile.experience.map((exp, index) => (
                            <li key={index} className="border rounded-lg p-3 bg-gray-50">
                                <p className="font-semibold">{exp.role}</p>
                                <p className="text-sm text-gray-600">{exp.company} — {exp.duration}</p>
                                <p className="text-sm">{exp.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resume Upload */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Resume</h3>
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                {/* Save Button */}
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
