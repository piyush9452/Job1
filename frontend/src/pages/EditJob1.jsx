import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LocationPicker from "../components/LocationPicker.jsx";
import ElasticTitleDropdown from "../components/ElasticTitleDropdown.jsx";
import {
  Loader2,
  Save,
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  CalendarDays,
  Users,
  AlignLeft,
  X,
  Target,
  Plus,
  Building,
  Globe,
  Monitor,
  Zap,
  GraduationCap,
  Languages,
  UserCircle2,
  Calendar,
} from "lucide-react";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [job, setJob] = useState({
    title: "",
    status: "active", // FACT: Added Status field
    description: "",
    jobFeatures: ["", ""],
    skillsRequired: [],
    jobType: [],
    workDaysPattern: "Mon to Fri",
    customWorkDaysDescription: "",
    mode: [],
    salaryAmount: "",
    salaryFrequency: "Monthly",
    incentives: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    isLongTerm: false,
    shifts: [{ shiftName: "Shift 1", startTime: "", endTime: "" }],
    isFlexibleShifts: false,
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
    qualifications: [],
    courses: [],
    ageLimit: { min: "", max: "", isAny: true },
    languages: [],
    useOfficeLocation: false,
    location: "",
    latitude: null,
    longitude: null,
  });

  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [originalLocation, setOriginalLocation] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) return navigate("/login");
        const token = JSON.parse(stored).token;

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const jobData = data.job || data;
        setOriginalLocation(jobData.location);

        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().split("T")[0];
        };

        const rawDesc = jobData.description || "";
        const parts = rawDesc.split("Key Responsibilities:");
        setJobSummary(
          parts[0] ? parts[0].replace("Job Summary:", "").trim() : rawDesc,
        );
        setKeyResponsibilities(parts[1] ? parts[1].trim() : "");

        const safeArray = (val, defaultVal) => {
          if (!val) return defaultVal ? [defaultVal] : [];
          return Array.isArray(val) ? val : [val];
        };

        setJob({
          title: jobData.title || "",
          status: jobData.status || "active", // FACT: Set status from DB
          description: "",
          jobFeatures:
            jobData.jobFeatures?.length >= 2
              ? jobData.jobFeatures
              : [
                  jobData.jobFeatures?.[0] || "",
                  jobData.jobFeatures?.[1] || "",
                ],
          skillsRequired: jobData.skillsRequired || [],
          jobType: safeArray(jobData.jobType, "full-time"),
          workDaysPattern: jobData.workDaysPattern || "Mon to Fri",
          customWorkDaysDescription: jobData.customWorkDaysDescription || "",
          mode: safeArray(jobData.mode, "Work from office"),
          salaryAmount: jobData.salaryAmount || "",
          salaryFrequency: jobData.salaryFrequency || "Monthly",
          incentives: jobData.incentives || "",
          startDate: formatDate(jobData.startDate),
          endDate: formatDate(jobData.endDate),
          applicationDeadline: formatDate(jobData.applicationDeadline),
          isLongTerm: jobData.isLongTerm || false,
          shifts:
            jobData.shifts?.length > 0
              ? jobData.shifts
              : [{ shiftName: "Shift 1", startTime: "", endTime: "" }],
          isFlexibleShifts: jobData.isFlexibleShifts || false,
          noOfPeopleRequired: jobData.noOfPeopleRequired || "",
          genderPreference: jobData.genderPreference || "No Preference",
          qualifications: jobData.qualifications || [],
          courses: jobData.courses || [],
          ageLimit: jobData.ageLimit || { min: "", max: "", isAny: true },
          languages: jobData.languages || [],
          useOfficeLocation: false,
          location:
            typeof jobData.location === "object"
              ? jobData.location?.address
              : jobData.location || "",
          latitude:
            typeof jobData.location === "object"
              ? jobData.location?.coordinates?.[1]
              : null,
          longitude:
            typeof jobData.location === "object"
              ? jobData.location?.coordinates?.[0]
              : null,
        });
      } catch (err) {
        console.error("Error fetching job:", err);
        alert("Could not load job details.");
        navigate("/employerdashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAgeChange = (field, value) => {
    setJob((prev) => ({
      ...prev,
      ageLimit: { ...prev.ageLimit, [field]: value, isAny: false },
    }));
  };

  const toggleArrayItem = (field, value) => {
    setJob((prev) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((i) => i !== value)
          : [...arr, value],
      };
    });
  };

  const addTag = (field, inputState, setInputState) => {
    if (
      inputState.trim() !== "" &&
      !(job[field] || []).includes(inputState.trim())
    ) {
      setJob((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), inputState.trim()],
      }));
    }
    setInputState("");
  };

  const removeTag = (field, index) => {
    setJob((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateShift = (index, field, value) => {
    setJob((prev) => {
      const updatedShifts = [...prev.shifts];
      updatedShifts[index][field] = value;
      return { ...prev, shifts: updatedShifts };
    });
  };

  const addShift = () =>
    setJob((prev) => ({
      ...prev,
      shifts: [
        ...prev.shifts,
        {
          shiftName: `Shift ${prev.shifts.length + 1}`,
          startTime: "",
          endTime: "",
        },
      ],
    }));
  const removeShift = (index) =>
    setJob((prev) => ({
      ...prev,
      shifts: prev.shifts
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, shiftName: `Shift ${i + 1}` })),
    }));

  const handleLocationSelect = useCallback((locData) => {
    setJob((prev) => ({
      ...prev,
      location: locData.address,
      latitude: locData.latitude,
      longitude: locData.longitude,
    }));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !job.title ||
      !job.salaryAmount ||
      job.mode.length === 0 ||
      job.jobType.length === 0
    ) {
      return alert("Title, Salary, Mode, and Job Type are required.");
    }

    setSaving(true);

    try {
      const stored = localStorage.getItem("employerInfo");
      const token = JSON.parse(stored).token;

      const combinedDescription =
        `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim();

      const payload = {
        ...job,
        description: combinedDescription,
        salaryAmount: Number(job.salaryAmount),
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
      };

      if (!payload.applicationDeadline) delete payload.applicationDeadline;
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      const needsLocation =
        job.mode.includes("Work from office") ||
        job.mode.includes("Work from field");

      if (
        !job.useOfficeLocation &&
        needsLocation &&
        job.latitude &&
        job.longitude
      ) {
        payload.location = {
          type: "Point",
          coordinates: [Number(job.longitude), Number(job.latitude)],
          address: job.location,
        };
      } else if (!needsLocation) {
        payload.location = {
          type: "Point",
          coordinates: [0, 0],
          address: "Remote",
        };
      } else if (!job.useOfficeLocation) {
        payload.location = originalLocation;
      } else {
        delete payload.location;
      }

      delete payload.latitude;
      delete payload.longitude;

      await axios.patch(
        `https://jobone-mrpy.onrender.com/jobs/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Job updated successfully!");
      navigate(`/job/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert(
        "Failed to update job: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans mt-16 sm:mt-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                Edit Posting
              </h1>
              <p className="text-xs font-medium text-slate-500 truncate max-w-[200px] md:max-w-md">
                {job.title || "Untitled Job"}
              </p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 active:scale-95"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save Changes"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* CORE DETAILS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Briefcase size={20} className="text-indigo-600" /> Core Details
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Job Title
                </label>
                <ElasticTitleDropdown
                  value={job.title}
                  onChange={(val) =>
                    setJob((prev) => ({ ...prev, title: val }))
                  }
                />
              </div>

              {/* FACT: Status Editor Added Here */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Job Status
                </label>
                <select
                  name="status"
                  value={job.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                  <option value="closed">Closed</option>
                  <option value="deadline passed">Deadline Passed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "permanent",
                    "temporary",
                    "internship",
                    "part-time",
                    "full-time",
                    "contractual",
                    "freelance",
                  ].map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl border transition-all capitalize ${job.jobType.includes(type) ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        onChange={() => toggleArrayItem("jobType", type)}
                      />{" "}
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* FACT: Openings moved out of Compensation */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Openings Required
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="number"
                    name="noOfPeopleRequired"
                    value={job.noOfPeopleRequired}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* FACT: Work Mode is now underneath Job Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Work Mode
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { val: "Work from home", icon: <Monitor size={14} /> },
                  { val: "Work from office", icon: <Building size={14} /> },
                  { val: "Work from field", icon: <Globe size={14} /> },
                ].map((m) => (
                  <label
                    key={m.val}
                    className={`flex-1 min-w-[150px] cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${job.mode.includes(m.val) ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      onChange={() => toggleArrayItem("mode", m.val)}
                    />
                    {m.icon} <span className="text-sm font-bold">{m.val}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMPENSATION */}
        <section className="bg-emerald-50/50 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Salary Amount & Frequency
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IndianRupee
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                    size={16}
                  />
                  <input
                    type="number"
                    name="salaryAmount"
                    value={job.salaryAmount}
                    onChange={handleChange}
                    className="w-full bg-white border border-emerald-200 text-emerald-900 font-bold rounded-xl pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <select
                  name="salaryFrequency"
                  value={job.salaryFrequency}
                  onChange={handleChange}
                  className="bg-white border border-emerald-200 text-emerald-900 font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {["Hourly", "Daily", "Weekly", "Monthly", "Lump-Sum"].map(
                    (f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Incentives & Perks (Optional)
              </label>
              <input
                type="text"
                name="incentives"
                value={job.incentives}
                onChange={handleChange}
                placeholder="e.g. Performance Bonus, Health Insurance..."
                className="w-full bg-white border border-emerald-200 text-emerald-900 font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* DEMOGRAPHICS & SKILLS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <UserCircle2 size={20} className="text-blue-600" /> Candidate
            Profile & Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Qualifications
              </label>
              <div className="flex flex-wrap gap-2.5">
                {/* FACT: Made Qualification Buttons Larger */}
                {[
                  "10th Pass",
                  "12th Pass",
                  "Diploma",
                  "Graduation",
                  "Post-Graduation",
                  "Any",
                ].map((q) => (
                  <label
                    key={q}
                    className={`cursor-pointer px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${job.qualifications.includes(q) ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      onChange={() => toggleArrayItem("qualifications", q)}
                    />{" "}
                    {q}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Courses / Streams
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {job.courses.map((course, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded flex items-center font-bold"
                  >
                    {course}{" "}
                    <button
                      type="button"
                      onClick={() => removeTag("courses", idx)}
                      className="ml-1 text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addTag("courses", courseInput, setCourseInput))
                  }
                  placeholder="e.g. Commerce, B.Tech..."
                  className="flex-1 p-2.5 border rounded-xl outline-none text-sm focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => addTag("courses", courseInput, setCourseInput)}
                  className="bg-slate-100 px-4 rounded-xl text-sm font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Age Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={job.ageLimit.min}
                  onChange={(e) => handleAgeChange("min", e.target.value)}
                  disabled={job.ageLimit.isAny}
                  className="w-20 p-2.5 border rounded-xl text-sm outline-none disabled:bg-slate-100 focus:border-indigo-500"
                />
                <span className="text-sm text-slate-400 font-bold">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={job.ageLimit.max}
                  onChange={(e) => handleAgeChange("max", e.target.value)}
                  disabled={job.ageLimit.isAny}
                  className="w-20 p-2.5 border rounded-xl text-sm outline-none disabled:bg-slate-100 focus:border-indigo-500"
                />
                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 ml-2 bg-indigo-50 px-3 py-2.5 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={job.ageLimit.isAny}
                    onChange={(e) =>
                      setJob((prev) => ({
                        ...prev,
                        ageLimit: { min: "", max: "", isAny: e.target.checked },
                      }))
                    }
                    className="rounded"
                  />{" "}
                  Any
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Gender Preference
              </label>
              <select
                name="genderPreference"
                value={job.genderPreference}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-xl text-sm outline-none font-bold text-slate-700 bg-white focus:border-indigo-500"
              >
                <option value="No Preference">No Preference</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Languages
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {job.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded flex items-center font-bold"
                  >
                    {lang}{" "}
                    <button
                      type="button"
                      onClick={() => removeTag("languages", idx)}
                      className="ml-1 text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addTag("languages", languageInput, setLanguageInput))
                  }
                  placeholder="e.g. Hindi, English..."
                  className="flex-1 p-2.5 border rounded-xl text-sm outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag("languages", languageInput, setLanguageInput)
                  }
                  className="bg-slate-100 px-4 rounded-xl font-bold text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    {skill}{" "}
                    <button
                      type="button"
                      onClick={() => removeTag("skillsRequired", i)}
                      className="hover:text-rose-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addTag("skillsRequired", skillsInput, setSkillsInput))
                  }
                  placeholder="Type a skill and press Add..."
                  className="p-3 border border-slate-200 rounded-xl text-sm w-full md:w-1/2 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag("skillsRequired", skillsInput, setSkillsInput)
                  }
                  className="bg-slate-100 hover:bg-slate-200 px-5 rounded-xl font-bold text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TIMINGS & DATES */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Clock size={20} className="text-purple-600" /> Schedule & Deadlines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Work Days
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {["Mon to Fri", "Mon to Sat", "Sat to Sun", "Custom"].map(
                    (p) => (
                      <label
                        key={p}
                        className={`cursor-pointer py-2.5 text-center text-xs font-bold rounded-xl border transition-all ${job.workDaysPattern === p ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                      >
                        <input
                          type="radio"
                          name="workDaysPattern"
                          value={p}
                          checked={job.workDaysPattern === p}
                          onChange={handleChange}
                          className="hidden"
                        />{" "}
                        {p}
                      </label>
                    ),
                  )}
                </div>
                {job.workDaysPattern === "Custom" && (
                  <input
                    type="text"
                    name="customWorkDaysDescription"
                    value={job.customWorkDaysDescription}
                    onChange={handleChange}
                    placeholder="Describe custom days..."
                    className="w-full p-3 border rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                )}
              </div>

              {/* FACT: Shifts are always visible now, with flexible as a modifier */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Shift Timings
                  </label>
                  <label className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg">
                    <input
                      type="checkbox"
                      name="isFlexibleShifts"
                      checked={job.isFlexibleShifts}
                      onChange={handleChange}
                      className="rounded"
                    />{" "}
                    Flexible
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mb-3 font-medium">
                  Set the standard expected hours. Check 'Flexible' if
                  candidates can adjust these.
                </p>
                <div className="space-y-2">
                  {job.shifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <input
                        value={shift.shiftName}
                        onChange={(e) =>
                          updateShift(index, "shiftName", e.target.value)
                        }
                        className="w-20 bg-transparent text-xs font-bold outline-none text-slate-700"
                        placeholder="Shift Name"
                      />
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) =>
                          updateShift(index, "startTime", e.target.value)
                        }
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono font-bold"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) =>
                          updateShift(index, "endTime", e.target.value)
                        }
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono font-bold"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeShift(index)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addShift}
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-2 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Add Shift
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={job.startDate}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold text-slate-700"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={job.isLongTerm ? "" : job.endDate}
                    onChange={handleChange}
                    disabled={job.isLongTerm}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 bg-white font-bold text-slate-700 focus:border-indigo-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <input
                  type="checkbox"
                  name="isLongTerm"
                  checked={job.isLongTerm}
                  onChange={handleChange}
                  className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />{" "}
                Long Term Role (No fixed end date)
              </label>

              <div className="pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1 block">
                  <Calendar size={14} /> Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={job.applicationDeadline}
                  onChange={handleChange}
                  className="w-full p-3 border border-rose-200 bg-white rounded-xl text-sm outline-none focus:border-rose-500 font-bold text-rose-700 shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES & DESCRIPTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <AlignLeft size={20} className="text-amber-500" /> Description &
            Highlights
          </h2>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-6 mb-8 shadow-sm">
            <label className="block text-sm font-extrabold text-amber-900 uppercase mb-3 flex items-center gap-1.5">
              <Zap size={16} /> Job Highlights / Features
            </label>
            <p className="text-xs text-amber-700 mb-4 font-medium">
              Add two key selling points about this role.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={job.jobFeatures[0] || ""}
                onChange={(e) =>
                  setJob((p) => {
                    const arr = [...p.jobFeatures];
                    arr[0] = e.target.value;
                    return { ...p, jobFeatures: arr };
                  })
                }
                placeholder="Feature 1 (e.g., Fast-paced startup environment)"
                className="p-3.5 rounded-xl border border-amber-200 text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
              <input
                type="text"
                value={job.jobFeatures[1] || ""}
                onChange={(e) =>
                  setJob((p) => {
                    const arr = [...p.jobFeatures];
                    arr[1] = e.target.value;
                    return { ...p, jobFeatures: arr };
                  })
                }
                placeholder="Feature 2 (e.g., Weekly team lunches)"
                className="p-3.5 rounded-xl border border-amber-200 text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Job Summary
              </label>
              <textarea
                value={jobSummary}
                onChange={(e) => setJobSummary(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm min-h-[150px] outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Key Responsibilities
              </label>
              <textarea
                value={keyResponsibilities}
                onChange={(e) => setKeyResponsibilities(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm min-h-[150px] outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
              />
            </div>
          </div>
        </section>

        {/* LOCATION */}
        {(job.mode.includes("Work from office") ||
          job.mode.includes("Work from field")) && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <MapPin size={20} className="text-rose-500" /> Office Location
              </h2>
              <label className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                <input
                  type="checkbox"
                  name="useOfficeLocation"
                  checked={job.useOfficeLocation}
                  onChange={handleChange}
                  className="rounded text-indigo-600"
                />{" "}
                Use Profile Office Location
              </label>
            </div>
            {!job.useOfficeLocation && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="rounded-xl overflow-hidden border border-slate-300 mb-4 shadow-sm">
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
                <input
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="Refine specific address..."
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
