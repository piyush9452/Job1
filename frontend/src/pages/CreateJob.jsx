import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
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
  Hash,
  Globe,
  Monitor,
  Building,
  FileText,
  ListChecks,
} from "lucide-react";

export default function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    jobType: "daily",
    skillsRequired: [],
    location: "",
    latitude: null,
    longitude: null,
    pinCode: "",
    salary: "",
    durationType: "Day",
    startDate: "",
    endDate: "",
    dailyWorkingHours: "",
    mode: "Online",
    workFrom: "",
    workTo: "",
    noOfDays: "",
    noOfPeopleRequired: "",
    genderPreference: "No Preference",
    paymentPerHour: "",
  });

  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [step, setStep] = useState(1);

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  // Auto-calculate salary
  useEffect(() => {
    const totalHours = Number(job.noOfDays) * Number(job.dailyWorkingHours);
    const totalSalary = totalHours * Number(job.paymentPerHour);

    if (!isNaN(totalSalary) && totalSalary > 0) {
      setJob((prevJob) => ({ ...prevJob, salary: totalSalary }));
    } else {
      setJob((prevJob) => ({ ...prevJob, salary: "" }));
    }
  }, [job.noOfDays, job.dailyWorkingHours, job.paymentPerHour]);

  const validateField = (name, value) => {
    let errorMsg = "";
    const requiredFields = [
      "title",
      "noOfDays",
      "dailyWorkingHours",
      "startDate",
      "endDate",
      "paymentPerHour",
      "noOfPeopleRequired",
      "location",
    ];

    if (requiredFields.includes(name) && !value) {
      errorMsg = "This field is required";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // --- MAP HANDLER ---
  const handleLocationSelect = useCallback((locData) => {
    setJob((prev) => ({
      ...prev,
      location: locData.address,
      latitude: locData.latitude,
      longitude: locData.longitude,
    }));

    // Clear error manually since state update is async
    setErrors((prev) => ({ ...prev, location: "" }));
  }, []);

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      if (value.trim().length > 0) {
        const filtered = skillSuggestions.filter((skill) =>
          skill.toLowerCase().includes(value.toLowerCase())
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

  const validateStep1 = () => {
    const fieldsToValidate = [
      "title",
      "noOfDays",
      "dailyWorkingHours",
      "startDate",
      "endDate",
      "paymentPerHour",
      "noOfPeopleRequired",
    ];
    let isValid = true;
    const newErrors = {};
    const newTouched = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      if (!job[field]) {
        newErrors[field] = "This field is required";
        isValid = false;
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
    if (!job.location) {
      setTouched((prev) => ({ ...prev, location: true }));
      setErrors((prev) => ({ ...prev, location: "Location is required" }));
      alert("Please enter a location.");
      return;
    }

    if (!jobSummary.trim() || !keyResponsibilities.trim()) {
      alert("Job Summary and Key Responsibilities are required.");
      return;
    }

    try {
      setLoading(true);

      const storedData = localStorage.getItem("employerInfo");
      if (!storedData) {
        alert("No employer session found. Please log in again.");
        setLoading(false);
        return;
      }

      let employerInfo;
      try {
        employerInfo = JSON.parse(storedData);
      } catch (err) {
        console.error("Invalid token:", err);
        setLoading(false);
        return;
      }

      const token = employerInfo?.token;
      if (!token) {
        alert("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const combinedDescription =
        `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim();

      const payload = {
        ...job,
        description: combinedDescription,
        address: job.location, // Matches schema requirement
        latitude: job.latitude,
        longitude: job.longitude,
        pinCode: job.pinCode ? Number(job.pinCode) : undefined,
        salary: Number(job.salary),
        paymentPerHour: Number(job.paymentPerHour),
        noOfDays: Number(job.noOfDays),
        noOfPeopleRequired: Number(job.noOfPeopleRequired),
        dailyWorkingHours: Number(job.dailyWorkingHours),
      };

      await axios.post("https://jobone-mrpy.onrender.com/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Job posted successfully!");

      setJob({
        title: "",
        description: "",
        jobType: "daily",
        skillsRequired: [],
        location: "",
        latitude: null,
        longitude: null,
        pinCode: "",
        salary: "",
        durationType: "Day",
        startDate: "",
        endDate: "",
        dailyWorkingHours: "",
        mode: "Online",
        workFrom: "",
        workTo: "",
        noOfDays: "",
        noOfPeopleRequired: "",
        genderPreference: "No Preference",
        paymentPerHour: "",
      });
      setJobSummary("");
      setKeyResponsibilities("");
      setSkillsInput("");
      setPreview(false);
      setStep(1);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error posting job:", error);
      alert(
        `Failed to post job: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Improved Input Class Helper with Icon Support
  const getInputClass = (fieldName, hasIcon = false) => {
    const base = `w-full p-3 ${
      hasIcon ? "pl-10" : ""
    } border rounded-xl outline-none transition-all duration-200`;
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  name="title"
                  value={job.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior React Developer"
                  className={getInputClass("title", true)}
                />
              </div>
              {touched.title && errors.title && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration
              </label>
              <div className="flex gap-3">
                {["Day", "Week", "Month"].map((type) => (
                  <label
                    key={type}
                    className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                      job.durationType === type
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="durationType"
                      value={type}
                      checked={job.durationType === type}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  No. of Days <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="noOfDays"
                    value={job.noOfDays}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 5"
                    className={getInputClass("noOfDays", true)}
                  />
                </div>
                {touched.noOfDays && errors.noOfDays && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.noOfDays}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Daily Hours <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="dailyWorkingHours"
                    value={job.dailyWorkingHours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 8"
                    className={getInputClass("dailyWorkingHours", true)}
                  />
                </div>
                {touched.dailyWorkingHours && errors.dailyWorkingHours && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.dailyWorkingHours}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={job.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("startDate")}
                />
                {touched.startDate && errors.startDate && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={job.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("endDate")}
                />
                {touched.endDate && errors.endDate && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Mode
              </label>
              <div className="flex gap-3">
                {[
                  { val: "Online", icon: <Monitor size={16} /> },
                  { val: "Offline", icon: <Building size={16} /> },
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
                    <span className="text-xs">{m.val}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Start Time
                </label>
                <input
                  type="time"
                  name="workFrom"
                  value={job.workFrom}
                  onChange={handleChange}
                  className={getInputClass("workFrom")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  End Time
                </label>
                <input
                  type="time"
                  name="workTo"
                  value={job.workTo}
                  onChange={handleChange}
                  className={getInputClass("workTo")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Payment Per Hour <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  name="paymentPerHour"
                  value={job.paymentPerHour}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Amount (₹)"
                  className={getInputClass("paymentPerHour", true)}
                />
              </div>
              {touched.paymentPerHour && errors.paymentPerHour && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.paymentPerHour}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Total Salary (Auto)
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  name="salary"
                  value={job.salary ? `${job.salary}` : ""}
                  readOnly
                  placeholder="Calculated automatically..."
                  className="w-full p-3 pl-10 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Openings <span className="text-red-500">*</span>
                </label>
                <div className="relative">
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
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Pin Code
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    name="pinCode"
                    value={job.pinCode}
                    onChange={handleChange}
                    placeholder="Code"
                    className={getInputClass("pinCode", true)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
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
            className={`px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all transform active:scale-95 ${
              step === 2 ? "hidden" : "block"
            }`}
          >
            Next Step
          </button>
        </div>

        {/* --- STEP 2: DETAILS & LOCATION --- */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Summary <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-4 text-gray-400"
                  size={18}
                />
                <textarea
                  value={jobSummary}
                  onChange={(e) => setJobSummary(e.target.value)}
                  placeholder="Briefly describe the role..."
                  className="w-full p-4 pl-10 border rounded-xl outline-none h-32 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Key Responsibilities <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ListChecks
                  className="absolute left-3 top-4 text-gray-400"
                  size={18}
                />
                <textarea
                  value={keyResponsibilities}
                  onChange={(e) => setKeyResponsibilities(e.target.value)}
                  placeholder="List main tasks..."
                  className="w-full p-4 pl-10 border rounded-xl outline-none h-32 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>

            {/* Skills Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Required Skills
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={handleSkillInputChange}
                    placeholder="Type to search (e.g. React)"
                    className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSkills}
                    className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700 font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg z-20 mt-2 overflow-hidden">
                    {suggestions.map((s, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          if (!job.skillsRequired.includes(s)) {
                            setJob({
                              ...job,
                              skillsRequired: [...job.skillsRequired, s],
                            });
                          }
                          setSkillsInput("");
                          setSuggestions([]);
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
                        (_, i) => i !== index
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

            {/* --- LOCATION PICKER SECTION --- */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <MapPin className="text-blue-600" /> Job Location
                <span className="text-red-500 text-sm">*</span>
              </h3>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 mb-3 font-medium">
                  Step 1: Search & Drop a pin on the map{" "}
                  <span className="text-blue-600 font-normal">
                    (Required for "Jobs Near Me")
                  </span>
                </p>
                {/* Map Component */}
                <div className="rounded-lg overflow-hidden border border-blue-200 shadow-sm">
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-2">
                  Step 2: Refine Address{" "}
                  <span className="font-normal text-gray-500">
                    (Add Floor, Building Name, etc.)
                  </span>
                </label>
                <div className="relative">
                  <input
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="303-B, Sweethomes Apt, Indrapuri, Bhopal..."
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
                {touched.location && errors.location && (
                  <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.location}
                  </p>
                )}

                {/* Status Indicator */}
                <div className="mt-3 text-xs flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
                  {job.latitude && job.longitude ? (
                    <span className="text-green-600 flex items-center gap-1.5 font-medium">
                      <CheckCircle size={14} /> Coordinates Captured
                      Successfully
                    </span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={14} /> Pin not dropped on map yet
                    </span>
                  )}
                </div>
              </div>
            </div>

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
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
              >
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
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
            <p className="text-sm text-gray-400 mt-1">
              Fill details to see how your job post looks
            </p>
          </div>
        )}
      </div>

      {/* Mobile Preview Modal */}
      {preview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <JobPreviewCard job={job} onClose={() => setPreview(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
