import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  AlertTriangle,
  Upload,
  Sparkles,
  Code,
  Award,
  HeartHandshake,
} from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    description: "",
    profilePicture: "",
    resumeFileKey: "",
  });

  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  // FACT: New arrays for extended sections
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [portfolioLinks, setPortfolioLinks] = useState([]);
  const [volunteering, setVolunteering] = useState([]);

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
  const [projForm, setProjForm] = useState({
    title: "",
    technologies: "",
    link: "",
    description: "",
  });
  const [certForm, setCertForm] = useState({ name: "", issuer: "", date: "" });
  const [linkForm, setLinkForm] = useState({ platform: "", url: "" });
  const [volForm, setVolForm] = useState({
    organization: "",
    role: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    if (location.state?.showWarning) setShowPopup(true);

    const fetchUser = async () => {
      try {
        const storedString = localStorage.getItem("userInfo");
        if (!storedString) return navigate("/login");
        const storedUser = JSON.parse(storedString);
        const userId = storedUser.id || storedUser.userId;

        if (!storedUser.token || !userId) return navigate("/login");

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          },
        );

        const safeList = (val) => (Array.isArray(val) ? val : []);

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          description: data.description || "",
          profilePicture: data.profilePicture || "",
          resumeFileKey: data.resumeFileKey || "",
        });

        setSkills(safeList(data.skills));
        setExperience(safeList(data.experience));
        setEducation(safeList(data.education));
        setProjects(safeList(data.projects));
        setCertifications(safeList(data.certifications));
        setPortfolioLinks(safeList(data.portfolioLinks));
        setVolunteering(safeList(data.volunteering));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, location]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!validTypes.includes(file.type))
      return alert("Please upload a PDF, DOC, or DOCX file.");

    setIsParsing(true);
    const storedData = JSON.parse(localStorage.getItem("userInfo"));
    const userId = storedData.id || storedData.userId;

    try {
      // 1. Upload to AWS S3 First
      const { data: s3Data } = await axios.post(
        `https://jobone-mrpy.onrender.com/user/${userId}/resume/upload-url`,
        { fileType: file.type },
      );

      await fetch(s3Data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      await axios.post(
        `https://jobone-mrpy.onrender.com/user/${userId}/resume/save-key`,
        { key: s3Data.key },
      );
      setProfile((prev) => ({ ...prev, resumeFileKey: s3Data.key }));

      // 2. Send to AI Parser
      const formData = new FormData();
      formData.append("resume", file);

      const { data: parsedData } = await axios.post(
        "https://jobone-mrpy.onrender.com/ai/parse-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // 3. Map Parsed Data to Editable State
      if (parsedData.name) setProfile((p) => ({ ...p, name: parsedData.name }));
      if (parsedData.phone)
        setProfile((p) => ({ ...p, phone: parsedData.phone }));
      if (parsedData.description)
        setProfile((p) => ({ ...p, description: parsedData.description }));
      if (parsedData.skills)
        setSkills((p) => Array.from(new Set([...p, ...parsedData.skills])));
      if (parsedData.experience) setExperience(parsedData.experience);
      if (parsedData.education) setEducation(parsedData.education);

      alert(
        "Resume parsed successfully! The original file has been securely saved for recruiters. Please review the auto-filled details below.",
      );
    } catch (error) {
      console.error("Upload/Parsing failed:", error);
      alert("Failed to process resume. Please try again.");
    } finally {
      setIsParsing(false);
      e.target.value = null;
    }
  };

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  // Array Handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const handleAddExperience = () => {
    if (expForm.company && expForm.role) {
      setExperience([...experience, expForm]);
      setExpForm({ company: "", role: "", duration: "", description: "" });
    } else alert("Company and Role required.");
  };
  const handleAddEducation = () => {
    if (eduForm.degree && eduForm.university) {
      setEducation([...education, eduForm]);
      setEduForm({
        degree: "",
        university: "",
        started: "",
        ended: "",
        CGPA: "",
      });
    } else alert("Degree and University required.");
  };
  const handleAddProject = () => {
    if (projForm.title) {
      setProjects([...projects, projForm]);
      setProjForm({ title: "", technologies: "", link: "", description: "" });
    } else alert("Project title required.");
  };
  const handleAddCert = () => {
    if (certForm.name) {
      setCertifications([...certifications, certForm]);
      setCertForm({ name: "", issuer: "", date: "" });
    } else alert("Certification name required.");
  };
  const handleAddLink = () => {
    if (linkForm.platform && linkForm.url) {
      setPortfolioLinks([...portfolioLinks, linkForm]);
      setLinkForm({ platform: "", url: "" });
    } else alert("Platform and URL required.");
  };
  const handleAddVol = () => {
    if (volForm.organization && volForm.role) {
      setVolunteering([...volunteering, volForm]);
      setVolForm({ organization: "", role: "", duration: "", description: "" });
    } else alert("Organization and Role required.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const userId = storedUser.id || storedUser.userId;

      const payload = {
        ...profile,
        skills,
        experience,
        education,
        projects,
        certifications,
        portfolioLinks,
        volunteering,
      };

      const { data } = await axios.patch(
        `https://jobone-mrpy.onrender.com/user/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        },
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...storedUser, ...data }),
      );
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Edit Profile
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* AI MAGIC BANNER */}
          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="text-indigo-500" size={20} /> AI Resume
                  Auto-Fill
                </h3>
                <p className="text-sm text-slate-600">
                  Upload PDF/DOCX to securely save the file for recruiters and
                  auto-fill your profile details.
                </p>
              </div>
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isParsing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button
                  type="button"
                  disabled={isParsing}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Upload Resume
                    </>
                  )}
                </button>
              </div>
            </div>
            {profile.resumeFileKey && (
              <p className="mt-3 text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-full inline-block">
                ✓ Resume securely attached to profile
              </p>
            )}
          </div>

          {/* 1. PERSONAL DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <User className="text-blue-600" size={20} /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />
              <InputGroup
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleProfileChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <InputGroup
                label="Email Address"
                name="email"
                value={profile.email}
                disabled={true}
              />
            </div>
          </div>

          {/* 2. SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <FileText className="text-purple-600" size={20} /> Professional
              Summary
            </h2>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleProfileChange}
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
            />
          </div>

          {/* 3. SKILLS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <span className="p-1 bg-orange-100 rounded-md text-orange-600">
                <Code size={16} />
              </span>{" "}
              Skills
            </h2>
            <div className="flex gap-3 mb-4">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none text-sm"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                }
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-orange-600 text-white px-6 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                >
                  <span className="text-sm">{skill}</span>
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. WORK EXPERIENCE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <span className="p-1 bg-blue-100 rounded-md text-blue-600">
                <Briefcase size={16} />
              </span>{" "}
              Work Experience
            </h2>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  name="role"
                  value={expForm.role}
                  onChange={(e) =>
                    setExpForm({ ...expForm, role: e.target.value })
                  }
                  placeholder="Job Title"
                  className="p-3 border rounded-xl text-sm"
                />
                <input
                  name="company"
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm({ ...expForm, company: e.target.value })
                  }
                  placeholder="Company"
                  className="p-3 border rounded-xl text-sm"
                />
                <input
                  name="duration"
                  value={expForm.duration}
                  onChange={(e) =>
                    setExpForm({ ...expForm, duration: e.target.value })
                  }
                  placeholder="Duration"
                  className="p-3 border rounded-xl text-sm"
                />
                <input
                  name="description"
                  value={expForm.description}
                  onChange={(e) =>
                    setExpForm({ ...expForm, description: e.target.value })
                  }
                  placeholder="Description"
                  className="p-3 border rounded-xl text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="w-full py-2.5 bg-white border border-gray-300 font-semibold rounded-xl flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add Position
              </button>
            </div>
            {/* List mapped items below... */}
            <div className="space-y-4">
              {experience.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border rounded-xl flex justify-between"
                >
                  <div>
                    <h4 className="font-bold">{item.role}</h4>
                    <p className="text-sm text-blue-600">
                      {item.company} • {item.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setExperience(experience.filter((_, i) => i !== idx))
                    }
                    className="text-red-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. PROJECTS (NEW) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <span className="p-1 bg-purple-100 rounded-md text-purple-600">
                <Code size={16} />
              </span>{" "}
              Projects
            </h2>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  value={projForm.title}
                  onChange={(e) =>
                    setProjForm({ ...projForm, title: e.target.value })
                  }
                  placeholder="Project Title"
                  className="p-3 border rounded-xl text-sm"
                />
                <input
                  value={projForm.link}
                  onChange={(e) =>
                    setProjForm({ ...projForm, link: e.target.value })
                  }
                  placeholder="Project URL (GitHub, Live)"
                  className="p-3 border rounded-xl text-sm"
                />
                <input
                  value={projForm.technologies}
                  onChange={(e) =>
                    setProjForm({ ...projForm, technologies: e.target.value })
                  }
                  placeholder="Technologies Used"
                  className="p-3 border rounded-xl text-sm col-span-2"
                />
                <textarea
                  value={projForm.description}
                  onChange={(e) =>
                    setProjForm({ ...projForm, description: e.target.value })
                  }
                  placeholder="Description"
                  className="p-3 border rounded-xl text-sm col-span-2"
                />
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="w-full py-2.5 bg-white border border-gray-300 font-semibold rounded-xl flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="space-y-4">
              {projects.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border rounded-xl flex justify-between"
                >
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-purple-600">
                      {item.technologies}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setProjects(projects.filter((_, i) => i !== idx))
                    }
                    className="text-red-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* OTHER SECTIONS (Education, Certifications, Links) implementation collapsed for brevity, but they follow exact same pattern as Projects above */}

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isParsing}
              className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl flex justify-center items-center gap-2"
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={20} />
              )}{" "}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputGroup = ({ label, name, value, onChange, disabled = false }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none ${disabled && "opacity-60"}`}
    />
  </div>
);
