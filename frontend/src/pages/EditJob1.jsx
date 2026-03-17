import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Sparkles,
  X,
  Target,
  Plus,
} from "lucide-react";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [originalLocation, setOriginalLocation] = useState(null);
  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");

  // FACT: Initialized with the new Phase 1 Schema structure
  const [job, setJob] = useState({
    title: "",
    description: "",
    workDays: [],
    skillsRequired: [],
    locationAddress: "",
    salaryAmount: "",
    salaryFrequency: "Monthly",
    durationType: "Month",
    startDate: "",
    endDate: "",
    isLongTerm: false,
    shifts: [{ shiftName: "Shift 1", startTime: "", endTime: "" }],
    mode: "Work from Home",
    noOfDays: "",
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
  });

  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // --- FETCH EXISTING JOB ---
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) return navigate("/login");

        const token = JSON.parse(stored).token;

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const jobData = data.job || data;

        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().split("T")[0];
        };

        setOriginalLocation(jobData.location);

        const rawDesc = jobData.description || "";
        const [summaryPart, resPart] = rawDesc.split("Key Responsibilities:");
        setJobSummary(
          summaryPart
            ? summaryPart.replace("Job Summary:", "").trim()
            : rawDesc,
        );
        setKeyResponsibilities(resPart ? resPart.trim() : "");

        // FACT: Mapping fetched data to the NEW schema
        setJob({
          title: jobData.title || "",
          description: jobData.description || "",
          workDays: jobData.workDays || [],
          skillsRequired: jobData.skillsRequired || [],
          locationAddress:
            typeof jobData.location === "object"
              ? jobData.location?.address
              : jobData.location || "",
          salaryAmount: jobData.salaryAmount || "",
          salaryFrequency: jobData.salaryFrequency || "Monthly",
          durationType: jobData.durationType || "Month",
          startDate: formatDate(jobData.startDate),
          endDate: formatDate(jobData.endDate),
          isLongTerm: jobData.isLongTerm || false,
          shifts:
            jobData.shifts?.length > 0
              ? jobData.shifts
              : [{ shiftName: "Shift 1", startTime: "", endTime: "" }],
          mode: jobData.mode || "Work from Home",
          noOfDays: jobData.noOfDays || "",
          noOfPeopleRequired: jobData.noOfPeopleRequired || "",
          genderPreference: jobData.genderPreference || "No Preference",
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

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const toggleWorkDay = (day) => {
    setJob((prev) => {
      const isSelected = prev.workDays.includes(day);
      return {
        ...prev,
        workDays: isSelected
          ? prev.workDays.filter((d) => d !== day)
          : [...prev.workDays, day],
      };
    });
  };

  const updateShift = (index, field, value) => {
    setJob((prev) => {
      const updatedShifts = [...prev.shifts];
      updatedShifts[index][field] = value;
      return { ...prev, shifts: updatedShifts };
    });
  };

  const addShift = () => {
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
  };

  const removeShift = (index) => {
    setJob((prev) => ({
      ...prev,
      shifts: prev.shifts
        .filter((_, i) => i !== index)
        .map((shift, i) => ({ ...shift, shiftName: `Shift ${i + 1}` })),
    }));
  };

  const handleSkills = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const skill = skillsInput.trim();
      if (skill && !job.skillsRequired.includes(skill)) {
        setJob({ ...job, skillsRequired: [...job.skillsRequired, skill] });
        setSkillsInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setJob({
      ...job,
      skillsRequired: job.skillsRequired.filter((s) => s !== skillToRemove),
    });
  };

  // --- SAVE UPDATES ---
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Safety checks
    if (!job.title || !job.salaryAmount || job.workDays.length === 0) {
      return alert("Title, Salary, and Work Days are required.");
    }

    setSaving(true);

    try {
      const stored = localStorage.getItem("employerInfo");
      const token = JSON.parse(stored).token;
      const combinedDescription =
        `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim();
      // Construct payload according to Phase 1 schema
      const payload = {
        ...job,
        description: combinedDescription,
        salaryAmount: Number(job.salaryAmount),
        noOfDays: job.noOfDays ? Number(job.noOfDays) : undefined,
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
      };

      if (job.mode === "Work from Home") {
        payload.location = { address: "Remote" };
      } else if (originalLocation && originalLocation.coordinates) {
        payload.location = {
          ...originalLocation,
          address: job.locationAddress,
        };
      }

      delete payload.locationAddress;

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
        <p className="text-slate-500 font-medium animate-pulse">
          Loading workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900 mt-20">
      {/* STICKY HEADER */}
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
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <form className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT COLUMN - CORE DETAILS */}
          <div className="xl:col-span-2 space-y-8">
            {/* Bento Box 1: Primary Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Core Identity
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Job Title
                  </label>
                  <input
                    name="title"
                    value={job.title}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Work Mode
                  </label>
                  <select
                    name="mode"
                    value={job.mode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="Work from Home">Work from Home</option>
                    <option value="Work from Office/Field">
                      Work from Office/Field
                    </option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {job.mode !== "Work from Home" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Office Address
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        name="locationAddress"
                        value={job.locationAddress}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Bento Box 2: Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <AlignLeft size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Job Description
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Job Summary
                  </label>
                  <textarea
                    value={jobSummary}
                    onChange={(e) => setJobSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[300px] resize-y leading-relaxed"
                    placeholder="Briefly describe the role..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={keyResponsibilities}
                    onChange={(e) => setKeyResponsibilities(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[300px] resize-y leading-relaxed"
                    placeholder="List main tasks and duties..."
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - METADATA */}
          <div className="space-y-8">
            {/* Compensation Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl p-8 shadow-sm border border-emerald-200 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                  <IndianRupee size={20} />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  Compensation
                </h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {["Monthly", "Weekly", "Daily", "Hourly", "Lump-Sum"].map(
                    (freq) => (
                      <label
                        key={freq}
                        className={`cursor-pointer py-2 px-1 text-center text-[10px] font-extrabold uppercase tracking-wide rounded-lg border transition-all ${job.salaryFrequency === freq ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
                      >
                        <input
                          type="radio"
                          name="salaryFrequency"
                          value={freq}
                          checked={job.salaryFrequency === freq}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {freq}
                      </label>
                    ),
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Salary Amount
                  </label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                      size={16}
                    />
                    <input
                      type="number"
                      name="salaryAmount"
                      value={job.salaryAmount}
                      onChange={handleChange}
                      className="w-full bg-white border border-emerald-200 text-emerald-900 font-bold rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Schedule Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Schedule
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={job.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={job.isLongTerm ? "" : job.endDate}
                      onChange={handleChange}
                      disabled={job.isLongTerm}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none ${job.isLongTerm ? "bg-slate-100 border-slate-200 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500"}`}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={job.isLongTerm}
                    onChange={(e) =>
                      setJob((prev) => ({
                        ...prev,
                        isLongTerm: e.target.checked,
                        endDate: e.target.checked ? "" : prev.endDate,
                      }))
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  Long Term Role (No fixed end date)
                </label>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Work Days
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleWorkDay(day)}
                        className={`py-1.5 text-[10px] font-bold rounded border transition-all ${job.workDays.includes(day) ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                    Shifts
                    <button
                      type="button"
                      onClick={addShift}
                      className="text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </label>
                  <div className="space-y-3">
                    {job.shifts.map((shift, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <input
                            value={shift.shiftName}
                            onChange={(e) =>
                              updateShift(index, "shiftName", e.target.value)
                            }
                            className="bg-transparent font-bold text-xs text-indigo-600 outline-none w-24"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeShift(index)}
                              className="text-rose-400 hover:text-rose-600"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            value={shift.startTime}
                            onChange={(e) =>
                              updateShift(index, "startTime", e.target.value)
                            }
                            className="flex-1 p-1.5 border border-slate-200 rounded text-xs outline-none focus:border-indigo-500"
                          />
                          <input
                            type="time"
                            value={shift.endTime}
                            onChange={(e) =>
                              updateShift(index, "endTime", e.target.value)
                            }
                            className="flex-1 p-1.5 border border-slate-200 rounded text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Requirements Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Requirements
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Openings
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="number"
                      name="noOfPeopleRequired"
                      value={job.noOfPeopleRequired}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={handleSkills}
                      className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. React, Node.js"
                    />
                    <button
                      type="button"
                      onClick={handleSkills}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 rounded-xl font-bold text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        No skills added yet.
                      </span>
                    ) : (
                      job.skillsRequired.map((skill, i) => (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={i}
                          className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
                        >
                          <Sparkles size={12} className="text-indigo-300" />{" "}
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-rose-400 transition-colors ml-1"
                          >
                            <X size={14} />
                          </button>
                        </motion.span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
