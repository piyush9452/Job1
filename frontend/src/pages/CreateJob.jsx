import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import JobConfirmModal from "../components/JobConfirmModal.jsx";
import { useNavigate } from "react-router-dom"; // <-- ADD THIS LINE

import {
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  CalendarDays,
  Clock,
  IndianRupee,
  Users,
  Globe,
  Monitor,
  Building,
  FileText,
  ListChecks,
  Plus,
  X,
} from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    description: "",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // FACT: Replaced jobType with Array for Grid selection
    skillsRequired: [],
    location: "",
    latitude: null,
    longitude: null,
    pinCode: "",
    salaryAmount: "", // FACT: Unified salary field
    salaryFrequency: "Monthly", // FACT: Default to Monthly per meeting notes
    durationType: "Month",
    startDate: "",
    endDate: "",
    isLongTerm: false, // FACT: Dedicated boolean flag
    shifts: [{ shiftName: "Shift 1", startTime: "", endTime: "" }], // FACT: Multi-shift array
    mode: "Work from Home",
    noOfDays: "",
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
  });

  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [titleTypingTimeout, setTitleTypingTimeout] = useState(null);
  const [step, setStep] = useState(1);
  const [generatingAI, setGeneratingAI] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const skillSuggestions = [
    "React",
    "Redux",
    "Node.js",
    "Express",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "Python",
    "Django",
    "Flask",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Firebase",
    "Next.js",
    "Vue.js",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "C++",
    "Java",
  ];

  // FACT: Expanded Elastic Job Titles
  const jobTitleSuggestions = [
    "Senior React Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "MERN Stack Developer",
    "Node.js Developer",
    "Python Developer",
    "Django Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Software Engineer",
    "Mobile App Developer",
    "Data Analyst",
    "Machine Learning Engineer",
    "Product Manager",
    "Marketing Executive",
    "Sales Associate",
    "Customer Support Representative",
  ];

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setJob((prev) => ({ ...prev, title: value }));
    if (titleTypingTimeout) clearTimeout(titleTypingTimeout);

    const timeout = setTimeout(() => {
      if (value.trim().length > 0) {
        const filtered = jobTitleSuggestions.filter((title) =>
          title.toLowerCase().includes(value.toLowerCase()),
        );
        setTitleSuggestions(filtered.slice(0, 8)); // Show more options for elasticity
      } else {
        setTitleSuggestions([]);
      }
    }, 300);
    setTitleTypingTimeout(timeout);
  };

  const toggleWorkDay = (day) => {
    setJob((prev) => {
      const isSelected = prev.workDays.includes(day);
      const updatedDays = isSelected
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day];

      if (touched.workDays) validateField("workDays", updatedDays);
      return { ...prev, workDays: updatedDays };
    });
  };

  // --- MULTI-SHIFT HANDLERS ---
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
    setJob((prev) => {
      const updatedShifts = prev.shifts
        .filter((_, i) => i !== index)
        .map((shift, i) => ({
          ...shift,
          shiftName: `Shift ${i + 1}`, // Rename remaining shifts to keep sequence
        }));
      return { ...prev, shifts: updatedShifts };
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "title" && !value) errorMsg = "Job Title is required";
    if (name === "workDays" && value.length === 0)
      errorMsg = "Select at least one work day";
    if (name === "salaryAmount" && !value)
      errorMsg = "Salary amount is required";
    if (name === "noOfPeopleRequired" && !value) errorMsg = "Openings required";

    if (
      name === "location" &&
      (job.mode === "Work from Office/Field" || job.mode === "Hybrid") &&
      !value
    ) {
      errorMsg = "Location is required";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleLocationSelect = useCallback((locData) => {
    setJob((prev) => ({
      ...prev,
      location: locData.address,
      latitude: locData.latitude,
      longitude: locData.longitude,
    }));
    setErrors((prev) => ({ ...prev, location: "" }));
  }, []);

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      if (value.trim().length > 0) {
        const filtered = skillSuggestions.filter((skill) =>
          skill.toLowerCase().includes(value.toLowerCase()),
        );
        setSuggestions(filtered.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 300);
    setTypingTimeout(timeout);
  };

  const handleSkills = () => {
    if (skillsInput.trim() !== "") {
      if (!job.skillsRequired.includes(skillsInput.trim())) {
        setJob({
          ...job,
          skillsRequired: [...job.skillsRequired, skillsInput.trim()],
        });
      }
      setSkillsInput("");
      setSuggestions([]);
    }
  };

  const typeWriterEffect = async (text, setterState, speed = 10) => {
    setterState("");
    for (let i = 0; i < text.length; i++) {
      setterState((prev) => prev + text.charAt(i));
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  };

  const handleAIGenerate = async () => {
    if (!job.title?.trim()) {
      alert("You must enter a Job Title in Step 1 first!");
      return;
    }

    setGeneratingAI(true);
    setJobSummary("");
    setKeyResponsibilities("");

    try {
      const storedData = localStorage.getItem("employerInfo");
      const token = storedData ? JSON.parse(storedData).token : null;
      if (!token) throw new Error("No token found");

      const { data } = await axios.post(
        "https://jobone-mrpy.onrender.com/ai/generate-job-details",
        {
          title: job.title,
          jobType: job.workDays.join(", ") || "Flexible",
          mode: job.mode,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await typeWriterEffect(data.summary, setJobSummary, 10);
      await typeWriterEffect(data.responsibilities, setKeyResponsibilities, 10);
    } catch (error) {
      console.error("AI generation failed:", error);
      alert("Failed to generate AI content.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {
      title: true,
      workDays: true,
      salaryAmount: true,
      noOfPeopleRequired: true,
    };

    if (!job.title) {
      newErrors.title = "Required";
      isValid = false;
    }
    if (job.workDays.length === 0) {
      newErrors.workDays = "Select days";
      isValid = false;
    }
    if (!job.salaryAmount) {
      newErrors.salaryAmount = "Required";
      isValid = false;
    }
    if (!job.noOfPeopleRequired) {
      newErrors.noOfPeopleRequired = "Required";
      isValid = false;
    }

    // Validate Shifts
    job.shifts.forEach((shift, index) => {
      if (!shift.startTime || !shift.endTime) {
        isValid = false;
        alert(`Please complete Start and End times for ${shift.shiftName}`);
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      alert("Please fill in all required fields highlighted in red.");
    }
  };

  const handleSubmit = async () => {
    if (
      (job.mode === "Work from Office/Field" || job.mode === "Hybrid") &&
      !job.location
    ) {
      setTouched((prev) => ({ ...prev, location: true }));
      setErrors((prev) => ({ ...prev, location: "Location is required" }));
      alert("Please drop a pin on the map to set the job location.");
      return;
    }

    if (!jobSummary.trim() || !keyResponsibilities.trim()) {
      alert("Job Summary and Key Responsibilities are required.");
      return;
    }

    try {
      setLoading(true);
      const storedData = localStorage.getItem("employerInfo");
      const token = storedData ? JSON.parse(storedData).token : null;

      if (!token) return alert("No token found. Please log in again.");

      const combinedDescription =
        `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim();

      const payload = {
        ...job,
        description: combinedDescription,
        pinCode: job.pinCode ? Number(job.pinCode) : undefined,
        salaryAmount: Number(job.salaryAmount),
        noOfDays: job.noOfDays ? Number(job.noOfDays) : undefined,
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
      };

      if (job.mode === "Work from Office/Field" || job.mode === "Hybrid") {
        payload.location = {
          type: "Point",
          coordinates: [Number(job.longitude), Number(job.latitude)],
          address: job.location,
        };
      } else {
        delete payload.location;
        delete payload.latitude;
        delete payload.longitude;
      }

      await axios.post("https://jobone-mrpy.onrender.com/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job posted successfully!");
      navigate("/employerdashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      alert(
        `Failed to post job: ${error.response?.data?.message || error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName, hasIcon = false) => {
    const base = `w-full p-3 ${hasIcon ? "pl-10" : ""} border rounded-xl outline-none transition-all duration-200`;
    const state =
      touched[fieldName] && errors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white";
    return `${base} ${state}`;
  };

  return (
    <div className="flex flex-col py-20 md:flex-row gap-10 p-8 bg-gray-50 min-h-screen">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create a Job</h1>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Step {step} of 2
          </span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            {/* JOB TITLE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Title<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  name="title"
                  value={job.title}
                  onChange={handleTitleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior React Developer"
                  className={getInputClass("title", true)}
                />
                {titleSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg z-20 mt-2 max-h-48 overflow-y-auto">
                    {titleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setJob((prev) => ({ ...prev, title: suggestion }));
                          setTitleSuggestions([]);
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {touched.title && errors.title && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.title}
                </p>
              )}
            </div>

            {/* FACT: WORK DAYS GRID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Days <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = job.workDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleWorkDay(day)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
              {touched.workDays && errors.workDays && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.workDays}
                </p>
              )}
            </div>

            {/* DATES & LONG TERM */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={job.startDate}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Format: DD/MM/YYYY
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={job.isLongTerm ? "" : job.endDate}
                    onChange={handleChange}
                    disabled={job.isLongTerm}
                    className={`w-full p-2.5 border rounded-lg text-sm outline-none ${job.isLongTerm ? "bg-gray-100 border-gray-200 cursor-not-allowed" : "border-gray-200 focus:ring-2 focus:ring-blue-200"}`}
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={job.isLongTerm}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setJob((prev) => ({
                          ...prev,
                          isLongTerm: checked,
                          endDate: checked ? "" : prev.endDate,
                        }));
                      }}
                    />
                    Long Term Role (No fixed end date)
                  </label>
                </div>
              </div>
            </div>

            {/* FACT: MULTI-SHIFT SELECTOR */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                Shift Timings <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {job.shifts.map((shift, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl relative group"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-blue-600 mb-1">
                        {shift.shiftName}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) =>
                            updateShift(index, "startTime", e.target.value)
                          }
                          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500"
                        />
                        <span className="flex items-center text-gray-400">
                          to
                        </span>
                        <input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) =>
                            updateShift(index, "endTime", e.target.value)
                          }
                          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeShift(index)}
                        className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg transition-colors mt-5"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addShift}
                  className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex justify-center items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Another Shift
                </button>
              </div>
            </div>

            {/* WORK MODE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Mode
              </label>
              <div className="flex gap-3">
                {[
                  { val: "Work from Home", icon: <Monitor size={16} /> },
                  {
                    val: "Work from Office/Field",
                    icon: <Building size={16} />,
                  }, // FACT: Updated to exact string
                  { val: "Hybrid", icon: <Globe size={16} /> },
                ].map((m) => (
                  <label
                    key={m.val}
                    className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      job.mode === m.val
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={m.val}
                      checked={job.mode === m.val}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {m.icon}
                    <span className="text-xs text-center font-bold">
                      {m.val}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* FACT: RADIO BUTTON SALARY */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl">
              <label className="block text-sm font-bold text-green-900 mb-3">
                Compensation Details <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {["Monthly", "Weekly", "Daily", "Hourly", "Lump-Sum"].map(
                  (freq) => (
                    <label
                      key={freq}
                      className={`cursor-pointer py-2 px-1 text-center text-[11px] font-extrabold uppercase tracking-wide rounded-lg border transition-all ${job.salaryFrequency === freq ? "bg-green-600 text-white border-green-600 shadow-md" : "bg-white text-green-700 border-green-200 hover:bg-green-100"}`}
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

              <div className="relative">
                <IndianRupee
                  className="absolute left-3 top-3.5 text-green-600"
                  size={18}
                />
                <input
                  type="number"
                  name="salaryAmount"
                  value={job.salaryAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={`Amount in ₹ (${job.salaryFrequency})`}
                  className={`w-full p-3 pl-10 border rounded-xl outline-none transition-all ${touched.salaryAmount && errors.salaryAmount ? "border-red-400 bg-red-50" : "border-green-200 focus:ring-2 focus:ring-green-300"}`}
                />
              </div>
              {touched.salaryAmount && errors.salaryAmount && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.salaryAmount}
                </p>
              )}
            </div>

            {/* OPENINGS */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                No. of Openings <span className="text-red-500">*</span>
              </label>
              <div className="relative w-1/2">
                <Users
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  name="noOfPeopleRequired"
                  value={job.noOfPeopleRequired}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Qty"
                  className={getInputClass("noOfPeopleRequired", true)}
                />
              </div>
              {touched.noOfPeopleRequired && errors.noOfPeopleRequired && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.noOfPeopleRequired}
                </p>
              )}
            </div>
          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              step === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === 2}
            className={`px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all ${
              step === 2 ? "hidden" : "block"
            }`}
          >
            Next Step
          </button>
        </div>

        {/* --- STEP 2: DETAILS & LOCATION --- */}
        {step === 2 && (
          <div className="space-y-6">
            {/* AI GENERATOR BANNER */}
            <div className="flex items-center justify-between mb-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">
                  ✨ AI Auto-Writer
                </h4>
                <p className="text-xs text-indigo-700">
                  Let AI write the summary and responsibilities.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={generatingAI}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generatingAI ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>

            {/* JOB SUMMARY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Summary <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText
                  className={`absolute left-3 top-4 transition-colors duration-300 ${generatingAI ? "text-indigo-500 animate-pulse" : "text-gray-400"}`}
                  size={18}
                />
                <textarea
                  value={jobSummary}
                  onChange={(e) => setJobSummary(e.target.value)}
                  placeholder="Briefly describe the role..."
                  className={`w-full p-4 pl-10 border rounded-xl outline-none h-32 transition-all duration-500 resize-y ${
                    generatingAI
                      ? "border-indigo-400 ring-4 ring-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-indigo-50/30"
                      : "focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50 focus:bg-white border-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* KEY RESPONSIBILITIES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Key Responsibilities <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ListChecks
                  className={`absolute left-3 top-4 transition-colors duration-300 ${generatingAI ? "text-indigo-500 animate-pulse" : "text-gray-400"}`}
                  size={18}
                />
                <textarea
                  value={keyResponsibilities}
                  onChange={(e) => setKeyResponsibilities(e.target.value)}
                  placeholder="List main tasks and duties..."
                  className={`w-full p-4 pl-10 border rounded-xl outline-none h-32 transition-all duration-500 resize-y ${
                    generatingAI
                      ? "border-indigo-400 ring-4 ring-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-indigo-50/30"
                      : "focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50 focus:bg-white border-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* SKILLS MAP */}
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100 font-medium shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => {
                      const updated = job.skillsRequired.filter(
                        (_, i) => i !== index,
                      );
                      setJob({ ...job, skillsRequired: updated });
                    }}
                    className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 my-6" />

            {/* CONDITIONAL LOCATION PICKER */}
            {(job.mode === "Work from Office/Field" ||
              job.mode === "Hybrid") && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                  <MapPin className="text-blue-600" /> Job Location
                  <span className="text-red-500 text-sm">*</span>
                </h3>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 mb-3 font-medium">
                    Step 1: Search & Drop a pin on the map
                  </p>
                  <div className="rounded-lg overflow-hidden border border-blue-200 shadow-sm">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-2">
                    Step 2: Refine Address
                  </label>
                  <div className="relative">
                    <input
                      name="location"
                      value={job.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 303-B, Sweethomes Apt, Bhopal..."
                      className={`w-full p-3 pl-10 border rounded-xl outline-none focus:ring-2 transition-all ${
                        touched.location && errors.location
                          ? "border-red-500 focus:ring-red-200 bg-red-50"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-gray-50 focus:bg-white"
                      }`}
                    />
                    <MapPin
                      className="absolute left-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setJob({
                    ...job,
                    description:
                      `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim(),
                  });
                  setPreview(true);
                }}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 font-bold shadow-lg shadow-blue-200 transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} /> Posting...
                  </span>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW SECTION */}
      <div className="hidden lg:block w-5/12 pl-8 sticky top-10 h-fit">
        {preview ? (
          <JobPreviewCard job={job} onClose={() => setPreview(false)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <FileText size={32} className="text-gray-300" />
            </div>
            <p className="font-medium">Live Preview</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {preview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <JobPreviewCard job={job} onClose={() => setPreview(false)} />
          </div>
        </div>
      )}

      {showConfirm && (
        <JobConfirmModal
          job={job}
          summary={jobSummary}
          responsibilities={keyResponsibilities}
          loading={loading}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            handleSubmit();
          }}
        />
      )}
    </div>
  );
}
