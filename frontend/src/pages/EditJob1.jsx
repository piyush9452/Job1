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
} from "lucide-react";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [originalLocation, setOriginalLocation] = useState(null);

  const [job, setJob] = useState({
    title: "",
    description: "",
    jobType: "Daily",
    skillsRequired: [],
    locationAddress: "",
    salary: "",
    salaryFrequency: "Hourly",
    durationType: "Day",
    startDate: "",
    endDate: "",
    dailyWorkingHours: "",
    mode: "Work from Home",
    workFrom: "",
    workTo: "",
    noOfDays: "",
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
    paymentPerHour: "",
  });

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

        // Safely format dates for HTML inputs
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().split("T")[0];
        };

        // Preserve original location object to prevent overwriting coordinates with undefined
        setOriginalLocation(jobData.location);

        setJob({
          title: jobData.title || "",
          description: jobData.description || "",
          jobType: jobData.jobType || "Daily",
          skillsRequired: jobData.skillsRequired || [],
          locationAddress:
            typeof jobData.location === "object"
              ? jobData.location?.address
              : jobData.location || "",
          salary: jobData.salary || "",
          salaryFrequency: jobData.salaryFrequency || "Hourly",
          durationType: jobData.durationType || "Day",
          startDate: formatDate(jobData.startDate),
          endDate: formatDate(jobData.endDate),
          dailyWorkingHours: jobData.dailyWorkingHours || "",
          mode: jobData.mode || "Work from Home",
          workFrom: jobData.workFrom || "",
          workTo: jobData.workTo || "",
          noOfDays: jobData.noOfDays || "",
          noOfPeopleRequired: jobData.noOfPeopleRequired || "",
          genderPreference: jobData.genderPreference || "No Preference",
          paymentPerHour: jobData.paymentPerHour || "",
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
    setJob((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate Salary if hours/days/rate change
      if (
        [
          "noOfDays",
          "dailyWorkingHours",
          "paymentPerHour",
          "salaryFrequency",
        ].includes(name)
      ) {
        const days = Number(updated.noOfDays) || 0;
        const hours = Number(updated.dailyWorkingHours) || 0;
        const rate = Number(updated.paymentPerHour) || 0;
        let total = 0;

        if (updated.salaryFrequency === "Hourly") total = days * hours * rate;
        else if (updated.salaryFrequency === "Daily") total = days * rate;
        else if (updated.salaryFrequency === "Weekly")
          total = (days / 7) * rate;
        else if (updated.salaryFrequency === "Monthly")
          total = (days / 30) * rate;

        updated.salary = Math.round(total);
      }
      return updated;
    });
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
    setSaving(true);

    try {
      const stored = localStorage.getItem("employerInfo");
      const token = JSON.parse(stored).token;

      // Construct payload, carefully handling the GeoJSON location object
      const payload = {
        ...job,
        salary: Number(job.salary),
        paymentPerHour: Number(job.paymentPerHour),
        noOfDays: Number(job.noOfDays),
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
        dailyWorkingHours: Number(job.dailyWorkingHours),
      };

      if (job.mode === "Work from Home") {
        payload.location = { address: "Remote" }; // Wipe coordinates safely
      } else if (originalLocation && originalLocation.coordinates) {
        payload.location = {
          ...originalLocation,
          address: job.locationAddress,
        };
      }

      delete payload.locationAddress; // Clean up temporary UI field

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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900 ">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm mt-20">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      <option value="Work from Office">Work from Office</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={job.jobType}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="Daily">Daily</option>
                      <option value="7 days">7 Days</option>
                      <option value="Mon-Fri">Mon-Fri</option>
                      <option value="Sat-Sun">Sat-Sun</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
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
                        placeholder="e.g. 123 Business Park, City"
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
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[250px] resize-y leading-relaxed"
                placeholder="Detail the responsibilities, requirements, and perks..."
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN - METADATA */}
          <div className="space-y-8">
            {/* Compensation Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl backdrop-blur-md">
                  <IndianRupee size={20} />
                </div>
                <h2 className="text-xl font-bold">Compensation</h2>
              </div>

              <div className="space-y-5 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Pay Per Hour
                  </label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="number"
                      name="paymentPerHour"
                      value={job.paymentPerHour}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:bg-white/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Total Estimated Salary
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-emerald-400">
                      ₹{job.salary ? Number(job.salary).toLocaleString() : "0"}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / total
                    </span>
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

              <div className="space-y-5">
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
                      value={job.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Days
                    </label>
                    <div className="relative">
                      <CalendarDays
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="number"
                        name="noOfDays"
                        value={job.noOfDays}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Daily Hrs
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="number"
                        name="dailyWorkingHours"
                        value={job.dailyWorkingHours}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
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

                  {/* Skill Chips */}
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
