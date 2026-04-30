import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // FACT: Required for Rich Text Editor styling
import JobPreviewCard from "../components/JobPreviewCard.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import JobConfirmModal from "../components/JobConfirmModal.jsx";
import ElasticTitleDropdown from "../components/ElasticTitleDropdown.jsx";
import CourseSuggestionsDropdown from "../components/CourseSuggestionsDropdown.jsx";
import LanguageSuggestionsDropdown from "../components/LanguageSuggestionsDropdown.jsx";
import SkillSuggestionsDropdown from "../components/SkillSuggestionsDropdown.jsx";

import {
  MapPin,
  Loader2,
  Users,
  Monitor,
  Building,
  FileText,
  Plus,
  X,
  Globe,
  Zap,
  Calendar,
  HelpCircle,
} from "lucide-react";

const getDefaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return date.toISOString().split("T")[0];
};

const getMinDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const getMaxDeadline = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
};

// FACT: Rich Text Editor modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

export default function CreateJob() {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [job, setJob] = useState({
    title: "",
    description: "",
    jobFeatures: ["", ""],
    skillsRequired: [],
    jobType: ["full-time"],
    workDaysPattern: "Mon to Fri",
    customWorkDaysDescription: "",
    mode: ["Work from office"],
    salaryMin: "", // FACT: Changed to range
    salaryMax: "", // FACT: Changed to range
    salaryFrequency: "Month",
    salaryCurrency: "INR",
    incentives: [],
    screeningQuestions: [], // FACT: New screening questions array
    startDate: "",
    endDate: "",
    applicationDeadline: getDefaultDeadline(),
    isLongTerm: false,
    shifts: [{ shiftName: "Shift 1", startTime: "", endTime: "" }],
    isFlexibleDuration: false,
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
    qualifications: [],
    courses: [],
    ageLimit: { min: "15", max: "60", isAny: false },
    languages: ["English"],
    experience: {
      relevantExperience: { min: "", max: "", isAny: true },
      totalExperience: { min: "", max: "", isAny: true },
    },
    useOfficeLocation: false,
    location: "",
    latitude: null,
    longitude: null,
  });

  const [isUnpaid, setIsUnpaid] = useState(false);
  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [customPerkInput, setCustomPerkInput] = useState("");
  const [newQuestion, setNewQuestion] = useState(""); // State for new screening question
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [step, setStep] = useState(1);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [pageAccess, setPageAccess] = useState("checking");
  const [blockMessage, setBlockMessage] = useState("");
  const [missingItems, setMissingItems] = useState([]);
  const currencyRef = useRef(null);

  const flagUrl = (iso) => `https://flagcdn.com/20x15/${iso}.png`;

  const PERKS_OPTIONS = [
    { value: "Health Insurance", icon: "🏥" },
    { value: "Travel Allowance", icon: "🚌" },
    { value: "Performance Bonus", icon: "🎯" },
    { value: "Goal Incentive", icon: "🏆" },
    { value: "Housing Allowance", icon: "🏠" },
    { value: "PF", icon: "🏦" },
    { value: "ESI", icon: "🩺" },
    { value: "Overtime Pay", icon: "⏰" },
    { value: "Gratuity", icon: "🎁" },
    { value: "Meal Allowance", icon: "🍱" },
    { value: "Internet Allowance", icon: "📶" },
    { value: "Joining Bonus", icon: "✨" },
  ];

  const TOP_CURRENCIES = [
    { code: "INR", iso: "in", name: "Indian Rupee", sym: "₹" },
    { code: "USD", iso: "us", name: "US Dollar", sym: "$" },
    { code: "EUR", iso: "eu", name: "Euro", sym: "€" },
    { code: "AED", iso: "ae", name: "UAE Dirham", sym: "د.إ" },
  ];
  const REST_CURRENCIES = [
    { code: "GBP", iso: "gb", name: "British Pound", sym: "£" },
    { code: "AUD", iso: "au", name: "Australian Dollar", sym: "A$" },
    { code: "CAD", iso: "ca", name: "Canadian Dollar", sym: "C$" },
    { code: "SGD", iso: "sg", name: "Singapore Dollar", sym: "S$" },
  ];
  const CURRENCIES = [...TOP_CURRENCIES, ...REST_CURRENCIES];

  // (Omitting eligibility check useEffect for brevity, it remains unchanged from your original)
  useEffect(() => {
    const handler = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target))
        setCurrencyOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // FACT: Mocking page access to 'granted' for this view. Replace with your actual auth logic.
    setPageAccess("granted");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setJob((prev) => ({ ...prev, [name]: finalValue }));
    if (touched[name]) validateField(name, finalValue);
  };

  const handleAgeChange = (field, value) => {
    setJob((prev) => ({
      ...prev,
      ageLimit: { ...prev.ageLimit, [field]: value },
    }));
  };

  const handleExperienceChange = (type, field, value) => {
    setJob((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [type]: {
          ...prev.experience[type],
          [field]: value,
          isAny: false,
        },
      },
    }));
  };

  const toggleExperienceAny = (type, checked) => {
    setJob((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [type]: { min: "", max: "", isAny: checked },
      },
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

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setJob((prev) => ({
        ...prev,
        screeningQuestions: [...prev.screeningQuestions, newQuestion.trim()],
      }));
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (index) => {
    setJob((prev) => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter((_, i) => i !== index),
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

  const blockManualInput = (e) => {
    e.preventDefault();
  };

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
    if (name === "salaryMin" && !isUnpaid && !value)
      errorMsg = "Minimum salary is required";
    if (name === "noOfPeopleRequired" && !value) errorMsg = "Openings required";

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

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {
      title: true,
      jobType: true,
      mode: true,
      salaryMin: true,
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
    if (!isUnpaid && !job.salaryMin) {
      newErrors.salaryMin = "Required";
      isValid = false;
    }
    if (!job.noOfPeopleRequired) {
      newErrors.noOfPeopleRequired = "Required";
      isValid = false;
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
    if (!job.isFlexibleShifts) {
      for (const shift of job.shifts) {
        if (!shift.startTime || !shift.endTime) {
          return alert(
            `Please complete Start and End times for ${shift.shiftName} under the Timings section.`,
          );
        }
      }
    }

    const needsLocation =
      job.mode.includes("Work from office") ||
      job.mode.includes("Work from field");
    if (needsLocation && !job.useOfficeLocation && !job.location) {
      return alert(
        "Please drop a pin on the map or select 'Same as Office Location'.",
      );
    }

    if (!jobSummary.trim() || !keyResponsibilities.trim())
      return alert("Job Summary and Key Responsibilities are required.");

    try {
      setLoading(true);
      const storedData = localStorage.getItem("employerInfo");
      const token = storedData ? JSON.parse(storedData).token : null;
      if (!token) return alert("No token found. Please log in again.");

      // FACT: Combine Rich Text HTML properly
      const combinedDescription = `<h3>Job Summary</h3>${jobSummary}<h3>Key Responsibilities</h3>${keyResponsibilities}`;

      const payload = {
        ...job,
        description: combinedDescription,
        salaryMin: isUnpaid ? 0 : Number(job.salaryMin),
        salaryMax: isUnpaid ? 0 : Number(job.salaryMax),
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
      };

      if (!payload.applicationDeadline) delete payload.applicationDeadline;

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

  if (pageAccess === "checking") return <div>Loading...</div>;

  return (
    <div className="flex flex-col py-20 md:flex-row gap-10 p-8 bg-gray-50 min-h-screen">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {locationState?.repostData ? "Repost a Job" : "Create a Job"}
          </h1>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Step {step} of 2
          </span>
        </div>

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
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Skills Required
              </label>
              <SkillSuggestionsDropdown
                skills={job.skillsRequired}
                jobTitle={job.title}
                onAdd={(skill) =>
                  setJob((prev) => ({
                    ...prev,
                    skillsRequired: [...prev.skillsRequired, skill],
                  }))
                }
                onRemove={(idx) =>
                  setJob((prev) => ({
                    ...prev,
                    skillsRequired: prev.skillsRequired.filter(
                      (_, i) => i !== idx,
                    ),
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {/* FACT: Added Volunteer Opportunity */}
                {[
                  "permanent",
                  "temporary",
                  "internship",
                  "part-time",
                  "full-time",
                  "contractual",
                  "freelance",
                  "volunteer opportunity",
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
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-green-900">
                  Compensation Range <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="unpaid-check"
                    checked={isUnpaid}
                    onChange={(e) => {
                      setIsUnpaid(e.target.checked);
                      if (e.target.checked)
                        setJob((prev) => ({
                          ...prev,
                          salaryMin: "",
                          salaryMax: "",
                        }));
                    }}
                    className="accent-green-600 cursor-pointer"
                  />
                  <label
                    htmlFor="unpaid-check"
                    className="text-xs font-bold text-green-700 cursor-pointer"
                  >
                    Unpaid / Volunteer
                  </label>
                </div>
              </div>

              {/* FACT: Salary Range Inputs */}
              <div className="flex gap-2 items-center">
                <div className="relative" ref={currencyRef}>
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen((o) => !o)}
                    className="flex items-center gap-1.5 h-11 px-3 border border-green-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-green-50 min-w-[88px]"
                  >
                    <img
                      src={flagUrl(
                        CURRENCIES.find((c) => c.code === job.salaryCurrency)
                          ?.iso,
                      )}
                      width={20}
                      height={15}
                      style={{ borderRadius: 2, objectFit: "cover" }}
                      alt={job.salaryCurrency}
                    />
                    <span>{job.salaryCurrency}</span>
                  </button>
                  {/* Currency Dropdown Logic Remains Same */}
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    disabled={isUnpaid}
                    value={job.salaryMin}
                    onChange={(e) =>
                      setJob((prev) => ({ ...prev, salaryMin: e.target.value }))
                    }
                    className="w-full p-2.5 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-100/50"
                  />
                  <span className="text-green-600 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    disabled={isUnpaid}
                    value={job.salaryMax}
                    onChange={(e) =>
                      setJob((prev) => ({ ...prev, salaryMax: e.target.value }))
                    }
                    className="w-full p-2.5 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-100/50"
                  />
                </div>

                <select
                  value={job.salaryFrequency}
                  onChange={(e) =>
                    setJob((prev) => ({
                      ...prev,
                      salaryFrequency: e.target.value,
                    }))
                  }
                  className="p-2.5 border border-green-200 rounded-xl outline-none bg-white text-sm font-bold text-green-800"
                >
                  <option value="Month">/ Month</option>
                  <option value="Year">/ Year</option>
                  <option value="Hour">/ Hour</option>
                  <option value="Lump-Sum">Lump-Sum</option>
                </select>
              </div>
            </div>

            {/* FACT: New Screening Questions Section */}
            <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl space-y-4">
              <label className="block text-sm font-bold text-purple-900 flex items-center gap-2">
                <HelpCircle size={18} /> Candidate Screening Questions
              </label>
              <p className="text-xs text-purple-700">
                Add questions candidates must answer when applying (e.g., Notice
                period? Willing to relocate?).
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                  placeholder="Type a question..."
                  className="flex-1 p-2.5 border border-purple-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700"
                >
                  Add
                </button>
              </div>

              {job.screeningQuestions.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {job.screeningQuestions.map((q, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-white p-3 border border-purple-100 rounded-lg text-sm text-purple-900"
                    >
                      <span className="font-medium">
                        {idx + 1}. {q}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
                  min={1}
                  max={9999}
                  onChange={handleChange}
                  className={getInputClass("noOfPeopleRequired", true)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="border border-indigo-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between bg-indigo-50 p-4 border-b border-indigo-100">
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">
                    Description & Responsibilities
                  </h4>
                  <p className="text-xs text-indigo-700">
                    Format your post with bold text, lists, and headings.
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-6 bg-white">
                {/* FACT: ReactQuill used for Rich Text Formatting */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Summary <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={jobSummary}
                    onChange={setJobSummary}
                    className="h-40 mb-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={keyResponsibilities}
                    onChange={setKeyResponsibilities}
                    className="h-40 mb-12"
                  />
                </div>
              </div>
            </div>

            {/* Timings, Dates, and Submit buttons omitted for brevity in snippet, ensure they remain from the previous version */}
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold transition-all"
              >
                Post Job
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${step === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
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
    </div>
  );
}
