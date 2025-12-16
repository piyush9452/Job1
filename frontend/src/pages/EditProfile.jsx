import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Plus,
  X,
  Save,
  Loader2,
  ArrowLeft,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- MAIN PROFILE STATE ---
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    profilePicture: "",
    resume: "",
  });

  // --- LIST STATES ---
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  // --- TEMP INPUT STATES ---
  const [newSkill, setNewSkill] = useState("");

  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  const [eduForm, setEduForm] = useState({
    degree: "",
    university: "",
    started: "",
    ended: "",
    CGPA: "",
  });

  // --- 1. LOAD DATA ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedString = localStorage.getItem("userInfo");
        if (!storedString) {
          navigate("/login");
          return;
        }

        const storedUser = JSON.parse(storedString);
        const { token } = storedUser;
        const id = storedUser?.userId;

        if (!token || !id) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Safe Parsing helper
        const safeParse = (val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch (e) {
              return [];
            }
          }
          return [];
        };

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          description: data.description || "",
          profilePicture: data.profilePicture || "",
          resume: data.resume || "",
        });

        setSkills(safeParse(data.skills));
        setExperience(safeParse(data.experience));
        setEducation(safeParse(data.education));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // --- HANDLERS ---

  // Profile Fields
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (item) =>
    setSkills(skills.filter((s) => s !== item));

  // Experience
  const handleExpChange = (e) =>
    setExpForm({ ...expForm, [e.target.name]: e.target.value });
  const handleAddExperience = () => {
    if (expForm.company && expForm.role) {
      setExperience([...experience, { ...expForm }]);
      setExpForm({ company: "", role: "", duration: "", description: "" });
    } else {
      alert("Company and Role are required.");
    }
  };
  const handleRemoveExperience = (index) => {
    const list = [...experience];
    list.splice(index, 1);
    setExperience(list);
  };

  // Education
  const handleEduChange = (e) =>
    setEduForm({ ...eduForm, [e.target.name]: e.target.value });
  const handleAddEducation = () => {
    if (eduForm.degree && eduForm.university) {
      setEducation([...education, { ...eduForm }]);
      setEduForm({
        degree: "",
        university: "",
        started: "",
        ended: "",
        CGPA: "",
      });
    } else {
      alert("Degree and University are required.");
    }
  };
  const handleRemoveEducation = (index) => {
    const list = [...education];
    list.splice(index, 1);
    setEducation(list);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const { token } = storedUser;
      const id = storedUser?.userId;

      // Construct Payload exactly matching Schema
      const payload = {
        ...profile,
        // Convert phone to number if it's a valid string number, else undefined to avoid cast error
        phone: profile.phone ? Number(profile.phone) : undefined,
        skills,
        experience,
        education,
      };

      await axios.patch(
        `https://jobone-mrpy.onrender.com/user/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        "Failed to update profile. " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Edit Profile
            </h1>
            <p className="text-slate-500 mt-1">
              Update your professional portfolio.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. PERSONAL INFO */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User className="text-blue-500" size={20} /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="John Doe"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="1234567890"
                icon={<Phone size={16} />}
              />
              <div className="md:col-span-2">
                <Input
                  label="Profile Picture URL"
                  name="profilePicture"
                  value={profile.profilePicture}
                  onChange={handleProfileChange}
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Resume Link"
                  name="resume"
                  value={profile.resume}
                  onChange={handleProfileChange}
                  placeholder="https://linkedin.com/in/..."
                  icon={<LinkIcon size={16} />}
                />
              </div>
            </div>
          </div>

          {/* 2. SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FileText className="text-purple-500" size={20} /> Professional
              Summary
            </h2>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleProfileChange}
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-y text-sm"
              placeholder="Tell recruiters about yourself..."
            />
          </div>

          {/* 3. SKILLS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="p-1 bg-orange-100 rounded-lg">
                <User className="text-orange-600" size={16} />
              </div>{" "}
              Skills
            </h2>
            <div className="flex gap-3 mb-4">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. React)"
                className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-all text-sm"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                }
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-orange-500 text-white px-5 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 4. EXPERIENCE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="p-1 bg-indigo-100 rounded-lg">
                <Briefcase className="text-indigo-600" size={16} />
              </div>{" "}
              Work Experience
            </h2>

            {/* Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input
                  name="role"
                  value={expForm.role}
                  onChange={handleExpChange}
                  placeholder="Job Role"
                />
                <Input
                  name="company"
                  value={expForm.company}
                  onChange={handleExpChange}
                  placeholder="Company"
                />
                <Input
                  name="duration"
                  value={expForm.duration}
                  onChange={handleExpChange}
                  placeholder="Duration (e.g. 2 Years)"
                />
                <Input
                  name="description"
                  value={expForm.description}
                  onChange={handleExpChange}
                  placeholder="Description"
                />
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Position
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{exp.role}</h4>
                    <p className="text-sm text-indigo-600 font-medium">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {exp.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDUCATION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="p-1 bg-green-100 rounded-lg">
                <GraduationCap className="text-green-600" size={16} />
              </div>{" "}
              Education
            </h2>

            {/* Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input
                  name="degree"
                  value={eduForm.degree}
                  onChange={handleEduChange}
                  placeholder="Degree (e.g. B.Tech)"
                />
                <Input
                  name="university"
                  value={eduForm.university}
                  onChange={handleEduChange}
                  placeholder="University / College"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="started"
                    value={eduForm.started}
                    onChange={handleEduChange}
                    placeholder="Start Year"
                  />
                  <Input
                    name="ended"
                    value={eduForm.ended}
                    onChange={handleEduChange}
                    placeholder="End Year"
                  />
                </div>
                <Input
                  name="CGPA"
                  value={eduForm.CGPA}
                  onChange={handleEduChange}
                  placeholder="CGPA / Percentage"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start p-4 bg-white border border-slate-100 rounded-xl hover:border-green-100 transition-colors shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                    <p className="text-sm text-green-600 font-medium">
                      {edu.university}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {edu.started} - {edu.ended} • CGPA: {edu.CGPA}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={20} />
              )}{" "}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simple Helper for Inputs
function Input({ label, icon, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
        )}
        <input
          {...props}
          className={`w-full p-3 ${
            icon ? "pl-10" : ""
          } border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm`}
        />
      </div>
    </div>
  );
}
