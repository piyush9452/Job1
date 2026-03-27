import React, { useState, useCallback } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import JobConfirmModal from "../components/JobConfirmModal.jsx";
import ElasticTitleDropdown from "../components/ElasticTitleDropdown.jsx";
import { useNavigate } from "react-router-dom";

// FACT: Cleaned up unused imports causing red blocks
import {
  MapPin,
  Loader2,
  IndianRupee,
  Users,
  Monitor,
  Building,
  FileText,
  ListChecks,
  Plus,
  X,
  Globe,
} from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    jobType: ["full-time"],
    workDaysPattern: "Mon to Fri",
    customWorkDaysDescription: "",
    mode: ["Work from office"],
    salaryAmount: "",
    salaryFrequency: "Monthly",
    incentives: "",
    startDate: "",
    endDate: "",
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

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [step, setStep] = useState(1);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setJob((prev) => ({ ...prev, [name]: finalValue }));
    if (touched[name]) validateField(name, finalValue);
  };

  const handleAgeChange = (field, value) => {
    setJob((prev) => ({
      ...prev,
      ageLimit: { ...prev.ageLimit, [field]: value, isAny: false },
    }));
  };

  const toggleArrayItem = (field, value) => {
    setJob((prev) => {
      const arr = prev[field];
      const newArr = arr.includes(value)
        ? arr.filter((i) => i !== value)
        : [...arr, value];
      if (touched[field]) validateField(field, newArr);
      return { ...prev, [field]: newArr };
    });
  };

  const addTag = (field, inputState, setInputState) => {
    if (inputState.trim() !== "") {
      if (!job[field].includes(inputState.trim())) {
        setJob((prev) => ({
          ...prev,
          [field]: [...prev[field], inputState.trim()],
        }));
      }
      setInputState("");
    }
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "title" && !value) errorMsg = "Job Title is required";
    if (name === "jobType" && value.length === 0)
      errorMsg = "Select at least one job type";
    if (name === "mode" && value.length === 0)
      errorMsg = "Select at least one work mode";
    if (name === "salaryAmount" && !value)
      errorMsg = "Salary amount is required";
    if (name === "noOfPeopleRequired" && !value) errorMsg = "Openings required";
    if (
      name === "workDaysPattern" &&
      value === "Custom" &&
      !job.customWorkDaysDescription
    )
      errorMsg = "Please describe the custom work days";

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

  const typeWriterEffect = async (text, setterState, speed = 10) => {
    setterState("");
    for (let i = 0; i < text.length; i++) {
      setterState((prev) => prev + text.charAt(i));
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  };

  const handleAIGenerate = async () => {
    if (!job.title?.trim())
      return alert("You must enter a Job Title in Step 1 first!");
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
          jobType: job.jobType.join(", "),
          mode: job.mode.join(", "),
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

  // FACT: Shift validation restored here to fix logic gaps
  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {
      title: true,
      jobType: true,
      mode: true,
      salaryAmount: true,
      noOfPeopleRequired: true,
    };

    if (!job.title) {
      newErrors.title = "Required";
      isValid = false;
    }
    if (job.jobType.length === 0) {
      newErrors.jobType = "Select type";
      isValid = false;
    }
    if (job.mode.length === 0) {
      newErrors.mode = "Select mode";
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
    if (job.workDaysPattern === "Custom" && !job.customWorkDaysDescription) {
      newErrors.workDaysPattern = "Required";
      isValid = false;
    }

    // Validate shifts if not flexible
    if (!job.isFlexibleShifts) {
      job.shifts.forEach((shift) => {
        if (!shift.startTime || !shift.endTime) {
          isValid = false;
          alert(`Please complete Start and End times for ${shift.shiftName}`);
        }
      });
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
    else alert("Please fill in all required fields highlighted in red.");
  };

  const handleSubmit = async () => {
    const needsLocation =
      job.mode.includes("Work from office") ||
      job.mode.includes("Work from field");
    if (needsLocation && !job.useOfficeLocation && !job.location) {
      alert(
        "Please drop a pin on the map or select 'Same as Office Location'.",
      );
      return;
    }

    if (!jobSummary.trim() || !keyResponsibilities.trim())
      return alert("Job Summary and Key Responsibilities are required.");

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
        salaryAmount: Number(job.salaryAmount),
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
      };

      if (!job.useOfficeLocation && needsLocation) {
        payload.location = {
          type: "Point",
          coordinates: [Number(job.longitude), Number(job.latitude)],
          address: job.location,
        };
      } else {
        delete payload.latitude;
        delete payload.longitude;
        delete payload.location;
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
    return `${base} ${touched[fieldName] && errors[fieldName] ? "border-red-500 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-gray-50 focus:bg-white"}`;
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

        {/* --- STEP 1: CORE DETAILS --- */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <ElasticTitleDropdown
                value={job.title}
                onChange={(val) => {
                  setJob((prev) => ({ ...prev, title: val }));
                  if (touched.title) validateField("title", val);
                }}
                hasError={touched.title && errors.title}
              />
              {touched.title && errors.title && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Skills Required
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.skillsRequired.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100 font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeTag("skillsRequired", index)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addTag("skillsRequired", skillsInput, setSkillsInput))
                  }
                  placeholder="Type a skill and press Add..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag("skillsRequired", skillsInput, setSkillsInput)
                  }
                  className="bg-gray-100 px-4 rounded-xl font-bold hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { val: "Work from home", icon: <Monitor size={16} /> },
                  { val: "Work from office", icon: <Building size={16} /> },
                  { val: "Work from field", icon: <Globe size={16} /> },
                ].map((m) => {
                  const isSelected = job.mode.includes(m.val);
                  return (
                    <label
                      key={m.val}
                      className={`flex-1 min-w-[120px] cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${isSelected ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        onChange={() => toggleArrayItem("mode", m.val)}
                      />
                      {m.icon}{" "}
                      <span className="text-xs text-center font-bold">
                        {m.val}
                      </span>
                    </label>
                  );
                })}
              </div>
              {touched.mode && errors.mode && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.mode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
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
                ].map((type) => {
                  const isSelected = job.jobType.includes(type);
                  return (
                    <label
                      key={type}
                      className={`cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg border transition-all capitalize ${isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        onChange={() => toggleArrayItem("jobType", type)}
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
              {touched.jobType && errors.jobType && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.jobType}
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Work Days <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {["Mon to Fri", "Mon to Sat", "Sat to Sun", "Custom"].map(
                  (pattern) => (
                    <label
                      key={pattern}
                      className={`cursor-pointer py-2 px-1 text-center text-[11px] font-extrabold uppercase tracking-wide rounded-lg border transition-all ${job.workDaysPattern === pattern ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                    >
                      <input
                        type="radio"
                        name="workDaysPattern"
                        value={pattern}
                        checked={job.workDaysPattern === pattern}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {pattern}
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
                  placeholder="e.g. 3 days a week, flexible days..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              )}
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl space-y-4">
              <label className="block text-sm font-bold text-green-900">
                Compensation <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {["Hourly", "Daily", "Weekly", "Monthly", "Lump-Sum"].map(
                  (freq) => (
                    <label
                      key={freq}
                      className={`cursor-pointer py-2 px-1 text-center text-[10px] font-extrabold uppercase tracking-wide rounded-lg border transition-all ${job.salaryFrequency === freq ? "bg-green-600 text-white border-green-600 shadow-md" : "bg-white text-green-700 border-green-200 hover:bg-green-100"}`}
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
              <div>
                <label className="block text-xs font-semibold text-green-800 mb-1">
                  Incentives / Perks (Optional)
                </label>
                <input
                  type="text"
                  name="incentives"
                  value={job.incentives}
                  onChange={handleChange}
                  placeholder="e.g. Performance Bonus, Health Insurance..."
                  className="w-full p-2.5 border border-green-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>

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
            </div>
          </div>
        )}

        {/* --- STEP 2: DEMOGRAPHICS, DATES, AI, LOCATION --- */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-5">
              <h3 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2">
                Candidate Requirements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase">
                    Qualifications
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
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
                        className={`cursor-pointer px-2 py-1 text-[10px] font-bold rounded border transition-all ${job.qualifications.includes(q) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-100"}`}
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
                  <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase">
                    Courses / Streams
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-indigo-700 text-[10px] px-2 py-1 border border-indigo-200 rounded flex items-center"
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
                      placeholder="e.g. Commerce, Arts, B.Tech..."
                      className="w-full p-1.5 border border-indigo-200 rounded outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addTag("courses", courseInput, setCourseInput)
                      }
                      className="bg-indigo-200 px-3 rounded text-xs font-bold text-indigo-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase">
                    Age Limit
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={job.ageLimit.min}
                      onChange={(e) => handleAgeChange("min", e.target.value)}
                      disabled={job.ageLimit.isAny}
                      className="w-16 p-1.5 border rounded text-xs outline-none disabled:bg-gray-100"
                    />
                    <span className="text-xs text-indigo-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={job.ageLimit.max}
                      onChange={(e) => handleAgeChange("max", e.target.value)}
                      disabled={job.ageLimit.isAny}
                      className="w-16 p-1.5 border rounded text-xs outline-none disabled:bg-gray-100"
                    />
                    <label className="flex items-center gap-1 text-xs font-bold text-indigo-700 ml-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={job.ageLimit.isAny}
                        onChange={(e) =>
                          setJob((prev) => ({
                            ...prev,
                            ageLimit: {
                              min: "",
                              max: "",
                              isAny: e.target.checked,
                            },
                          }))
                        }
                        className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                      />{" "}
                      Any Age
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-indigo-700 text-[10px] px-2 py-1 border border-indigo-200 rounded flex items-center"
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
                      className="w-full p-1.5 border border-indigo-200 rounded outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addTag("languages", languageInput, setLanguageInput)
                      }
                      className="bg-indigo-200 px-3 rounded text-xs font-bold text-indigo-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="startDate"
                    value={job.startDate}
                    onChange={handleChange}
                    className="flex-1 p-2 border border-gray-200 rounded text-xs outline-none focus:ring-2 focus:ring-blue-200"
                    title="Start Date"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={job.isLongTerm ? "" : job.endDate}
                    onChange={handleChange}
                    disabled={job.isLongTerm}
                    className="flex-1 p-2 border border-gray-200 rounded text-xs outline-none disabled:bg-gray-100"
                    title="End Date"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isLongTerm"
                    checked={job.isLongTerm}
                    onChange={handleChange}
                    className="rounded"
                  />{" "}
                  Long Term Role
                </label>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Timings
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFlexibleShifts"
                      checked={job.isFlexibleShifts}
                      onChange={handleChange}
                      className="rounded text-blue-600"
                    />{" "}
                    Flexible
                  </label>
                </div>

                {!job.isFlexibleShifts && (
                  <div className="space-y-2">
                    {job.shifts.map((shift, index) => (
                      <div key={index} className="flex gap-1 items-center">
                        <input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) =>
                            updateShift(index, "startTime", e.target.value)
                          }
                          className="flex-1 p-1.5 border rounded text-xs outline-none"
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) =>
                            updateShift(index, "endTime", e.target.value)
                          }
                          className="flex-1 p-1.5 border rounded text-xs outline-none"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeShift(index)}
                            className="text-red-400 p-1"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addShift}
                      className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1"
                    >
                      <Plus size={12} /> Add Shift
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-indigo-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between bg-indigo-50 p-4 border-b border-indigo-100">
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">
                    ✨ AI Auto-Writer
                  </h4>
                  <p className="text-xs text-indigo-700">
                    Auto-generate the summary and responsibilities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={generatingAI}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {generatingAI ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
              <div className="p-4 space-y-4 bg-white">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={jobSummary}
                    onChange={(e) => setJobSummary(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none h-24 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={keyResponsibilities}
                    onChange={(e) => setKeyResponsibilities(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none h-24 text-sm"
                  />
                </div>
              </div>
            </div>

            {(job.mode.includes("Work from office") ||
              job.mode.includes("Work from field")) && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <MapPin className="text-blue-600" /> Job Location{" "}
                    <span className="text-red-500 text-sm">*</span>
                  </span>
                  <label className="flex items-center gap-2 text-sm font-bold text-indigo-600 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <input
                      type="checkbox"
                      name="useOfficeLocation"
                      checked={job.useOfficeLocation}
                      onChange={handleChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Same as Office Location
                  </label>
                </h3>
                {!job.useOfficeLocation && (
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-800 mb-3 font-medium">
                      Search & Drop a pin on the map
                    </p>
                    <div className="rounded-lg overflow-hidden border border-blue-200 mb-3">
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                    </div>
                    <input
                      name="location"
                      value={job.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Refine Address (e.g. 303-B, Sweethomes Apt...)"
                      className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    />
                  </div>
                )}
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
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : null}{" "}
                Post Job
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Back
          </button>
          {step === 1 && (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
            >
              Next Step
            </button>
          )}
        </div>
      </div>

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
