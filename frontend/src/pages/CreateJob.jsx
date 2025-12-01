import React, { useEffect, useState } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import { MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
  const [showMonthlyHours, setShowMonthlyHours] = useState(false);
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
    setJob({ ...job, [name]: value });

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleLocationSelect = (locData) => {
    setJob((prev) => ({
      ...prev,
      location: locData.address,
      latitude: locData.latitude,
      longitude: locData.longitude,
    }));
    if (touched.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

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
        address: job.location,
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

  const getInputClass = (fieldName) => {
    return `w-full p-3 border rounded-md outline-none focus:ring-2 ${
      touched[fieldName] && errors[fieldName]
        ? "border-red-500 focus:ring-red-200 bg-red-50"
        : "border-gray-300 focus:ring-blue-200"
    }`;
  };

  return (
    <div className="flex flex-col py-20 md:flex-row gap-10 p-8 bg-gray-50 min-h-screen">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md border border-gray-200 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a Job</h1>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={job.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Senior React Developer"
                className={getInputClass("title")}
              />
              {touched.title && errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Duration</label>
              <div className="w-full p-3 border rounded-md flex gap-4">
                {["Day", "Week", "Month"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="durationType"
                      value={type}
                      checked={job.durationType === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  No. of Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="noOfDays"
                  value={job.noOfDays}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 5"
                  className={getInputClass("noOfDays")}
                />
                {touched.noOfDays && errors.noOfDays && (
                  <p className="text-red-500 text-xs mt-1">{errors.noOfDays}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Daily Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="dailyWorkingHours"
                  value={job.dailyWorkingHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 8"
                  className={getInputClass("dailyWorkingHours")}
                />
                {touched.dailyWorkingHours && errors.dailyWorkingHours && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dailyWorkingHours}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
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
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Mode</label>
              <div className="w-full p-3 border rounded-md flex gap-4">
                {["Online", "Offline", "Hybrid"].map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={m}
                      checked={job.mode === m}
                      onChange={handleChange}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="workFrom"
                  value={job.workFrom}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="workTo"
                  value={job.workTo}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Payment Per Hour <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="paymentPerHour"
                value={job.paymentPerHour}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Payment per Hour (₹)"
                className={getInputClass("paymentPerHour")}
              />
              {touched.paymentPerHour && errors.paymentPerHour && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentPerHour}
                </p>
              )}
            </div>

            <input
              name="salary"
              value={job.salary ? `₹${job.salary}` : ""}
              readOnly
              placeholder="Total Salary (Auto)"
              className="w-full p-3 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Openings <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="noOfPeopleRequired"
                  value={job.noOfPeopleRequired}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Openings"
                  className={getInputClass("noOfPeopleRequired")}
                />
                {touched.noOfPeopleRequired && errors.noOfPeopleRequired && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.noOfPeopleRequired}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Pin Code
                </label>
                <input
                  name="pinCode"
                  value={job.pinCode}
                  onChange={handleChange}
                  placeholder="Pin Code"
                  className="w-full p-3 border rounded-md outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="flex justify-center gap-8 my-6 pt-4 border-t">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className={`font-medium flex items-center gap-1 ${
              step === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            ❮ Previous
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === 2}
            className={`font-medium flex items-center gap-1 ${
              step === 2
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Next ❯
          </button>
        </div>

        {/* --- STEP 2: DETAILS & LOCATION --- */}
        {step === 2 && (
          <div className="space-y-6">
            <textarea
              value={jobSummary}
              onChange={(e) => setJobSummary(e.target.value)}
              placeholder="Job Summary *"
              className="w-full p-3 border rounded-md outline-none h-24"
            />
            <textarea
              value={keyResponsibilities}
              onChange={(e) => setKeyResponsibilities(e.target.value)}
              placeholder="Key Responsibilities *"
              className="w-full p-3 border rounded-md outline-none h-24"
            />

            {/* Skills Input */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillsInput}
                  onChange={handleSkillInputChange}
                  placeholder="Add skill"
                  className="flex-1 p-3 border rounded-md outline-none"
                />
                <button
                  onClick={handleSkills}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border rounded-md shadow-md z-10 mt-1">
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
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => {
                      const updated = job.skillsRequired.filter(
                        (_, i) => i !== index
                      );
                      setJob({ ...job, skillsRequired: updated });
                    }}
                    className="ml-2 text-blue-600 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <hr className="border-gray-200" />

            {/* --- LOCATION PICKER SECTION --- */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" /> Job Location{" "}
                <span className="text-red-500">*</span>
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Step 1:</strong> Search & Drop a pin on the map
                  (Required for "Jobs Near Me").
                </p>
                {/* Ensure you have installed leaflet & react-leaflet */}
                <LocationPicker onLocationSelect={handleLocationSelect} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 mt-4">
                  <strong>Step 2:</strong> Refine Address (e.g., Add Floor,
                  Building Name)
                </label>
                <div className="relative">
                  <input
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="303-B, Sweethomes Apt, Indrapuri, Bhopal..."
                    className={`w-full p-3 pl-10 border rounded-md outline-none focus:ring-2 ${
                      errors.location
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-blue-500"
                    }`}
                  />
                  <MapPin
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}

                {/* Status Indicator */}
                <div className="mt-2 text-xs flex items-center gap-2">
                  {job.latitude && job.longitude ? (
                    <span className="text-green-600 flex items-center gap-1 font-medium">
                      <CheckCircle size={14} /> Map Coordinates Set
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1 font-medium">
                      <AlertCircle size={14} /> Please pin location on map
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  setJob({
                    ...job,
                    description:
                      `Job Summary:\n${jobSummary}\n\nKey Responsibilities:\n${keyResponsibilities}`.trim(),
                  });
                  setPreview(true);
                }}
                className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 text-gray-700 font-medium"
              >
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium shadow-md transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Post Job"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW SECTION */}
      <div className="w-full md:w-1/2">
        {preview ? (
          <JobPreviewCard job={job} onClose={() => setPreview(false)} />
        ) : (
          <div className="flex items-center justify-center h-full mt-2 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl m-4 min-h-[300px]">
            Click “Preview” to see your job summary
          </div>
        )}
      </div>
    </div>
  );
}
