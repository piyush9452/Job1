import React, { useEffect, useState } from "react";
import axios from "axios";
import JobPreviewCard from "../components/JobPreviewCard.jsx";

export default function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    jobType: "daily",
    skillsRequired: [],
    location: "",
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

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
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
        setSuggestions(filtered.slice(0, 5)); // show top 5 results
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce delay

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

  const handleSubmit = async () => {
  try {
    setLoading(true);

    // --- FIX 1: Read from the correct key "employerInfo" ---
    const storedData = localStorage.getItem("employerInfo");

    if (!storedData) {
      alert("No employer session found. Please log in again.");
      // navigate("/login"); // Uncomment if you want auto-redirect
      setLoading(false);
      return;
    }

    // --- FIX 2: Safe Parsing ---
    let employerInfo;
    try {
      employerInfo = JSON.parse(storedData);
    } catch (err) {
      console.error("Invalid token data:", err);
      alert("Session invalid. Please log in again.");
      setLoading(false);
      return;
    }

    // --- FIX 3: Get the token from the object ---
    const token = employerInfo?.token;

    if (!token) {
      alert("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    const combinedDescription = `
Job Summary:
${jobSummary}

Key Responsibilities:
${keyResponsibilities}
    `.trim();

    const payload = {
      ...job,
      description: combinedDescription,
      pinCode: job.pinCode ? Number(job.pinCode) : undefined,
      salary: Number(job.salary),
      paymentPerHour: Number(job.paymentPerHour),
      noOfDays: Number(job.noOfDays),
      noOfPeopleRequired: Number(job.noOfPeopleRequired),
      dailyWorkingHours: Number(job.dailyWorkingHours),
    };

    const res = await axios.post(
      "https://jobone-mrpy.onrender.com/jobs",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Job posted successfully!");
    console.log(res.data);

    // Reset form logic
    setJob({
      title: "",
      description: "",
      jobType: "daily",
      skillsRequired: [],
      location: "",
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

  } catch (error) {
    console.error("Error posting job:", error);
    alert(`Failed to post job: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col py-20 md:flex-row gap-10 p-8 bg-gray-50 min-h-screen">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md border border-gray-200 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a Job</h1>
        {step === 1 && (
          <div className="space-y-4">
            <input
              name="title"
              value={job.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full p-3 border rounded-md outline-none"
            />
            <div>
              <label className="block text-gray-600 mb-1">Duration</label>
              <div className="w-full p-3 border rounded-md">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="durationType"
                    value="Day"
                    checked={job.durationType === "Day"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Day
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="durationType"
                    value="Week"
                    checked={job.durationType === "Week"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Week
                </label>
                <label>
                  <input
                    type="radio"
                    name="durationType"
                    value="Month"
                    checked={job.durationType === "Month"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Month
                </label>
              </div>
            </div>
            <input
              type="number"
              name="noOfDays"
              value={job.noOfDays}
              onChange={handleChange}
              placeholder="No. of Days (e.g. 5)"
              className="w-full p-3 border rounded-md outline-none"
            />
            <input
              type="number"
              name="dailyWorkingHours"
              value={job.dailyWorkingHours}
              onChange={handleChange}
              placeholder="Daily Working Hours"
              className="w-full p-3 border rounded-md outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={job.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={job.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Mode</label>
              <div className="w-full p-3 border rounded-md">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="mode"
                    value="Online"
                    checked={job.mode === "Online"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Online
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="mode"
                    value="Offline"
                    checked={job.mode === "Offline"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Offline
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">
                Working Time (From – To)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  name="workFrom"
                  value={job.workFrom}
                  onChange={handleChange}
                  className="p-3 border rounded-md outline-none"
                />
                <input
                  type="time"
                  name="workTo"
                  value={job.workTo}
                  onChange={handleChange}
                  className="p-3 border rounded-md outline-none"
                />
              </div>
            </div>
            <label className="block text-gray-600 mb-1">JobType</label>
            <div className="w-full p-3 border rounded-md">
              <label>
                <input
                  type="radio"
                  name="jobType"
                  value="daily"
                  checked={job.jobType === "daily"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Daily
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="jobType"
                  value="weekly"
                  checked={job.jobType === "short-term"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Weekly
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="jobType"
                  value="monthly"
                  checked={job.jobType === "part-time"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Monthly
              </label>
            </div>
            <input
              type="number"
              name="noOfPeopleRequired"
              value={job.noOfPeopleRequired}
              onChange={handleChange}
              placeholder="No. of People Required (e.g. 4)"
              className="w-full p-3 border rounded-md outline-none"
            />
            <div>
              <label className="block text-gray-600 mb-1">
                Gender Preference
              </label>
              <div className="w-full p-3 border rounded-md">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="No Preference"
                    checked={job.genderPreference === "No Preference"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No Preference
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="Male"
                    checked={job.genderPreference === "Male"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="Female"
                    checked={job.genderPreference === "Female"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="genderPreference"
                    value="Other"
                    checked={job.genderPreference === "Other"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Other
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={
                  showMonthlyHours &&
                  Number(job.noOfDays) &&
                  Number(job.dailyWorkingHours)
                    ? `${
                        Number(job.noOfDays) * Number(job.dailyWorkingHours)
                      } hrs`
                    : ""
                }
                readOnly
                placeholder="Total Monthly Hours"
                className="flex-1 p-3 border rounded-md outline-none bg-gray-100 cursor-not-allowed"
              />
              <button
                onClick={() => setShowMonthlyHours(!showMonthlyHours)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap"
              >
                {showMonthlyHours ? "Hide" : "Show"} Hours
              </button>
            </div>

            <input
              type="number"
              name="paymentPerHour"
              value={job.paymentPerHour}
              onChange={handleChange}
              placeholder="Payment per Hour (₹)"
              className="w-full p-3 border rounded-md outline-none"
            />
            <div />
          </div>
        )}
        <div className="flex justify-center gap-8 my-4">
          {/* Previous */}
          <button
            onClick={() => setStep(1)}
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200
                   font-medium flex items-center gap-1"
          >
            ❮❮❮❮ Previous
          </button>

          {/* Next */}
          <button
            onClick={() => setStep(2)}
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200
                   font-medium flex items-center gap-1"
          >
            Next ❯❯❯❯
          </button>
        </div>

        {step === 2 && (
          <div className="space-y-4">
            <textarea
              value={jobSummary}
              onChange={(e) => setJobSummary(e.target.value)}
              placeholder="Job Summary"
              className="w-full p-3 border rounded-md outline-none h-24"
            />

            <textarea
              value={keyResponsibilities}
              onChange={(e) => setKeyResponsibilities(e.target.value)}
              placeholder="Key Responsibilities"
              className="w-full p-3 border rounded-md outline-none h-24"
            />

            {/* Skills */}
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={skillsInput}
                onChange={handleSkillInputChange}
                placeholder="Add skill (e.g. React)"
                className="flex-1 p-3 border rounded-md outline-none"
              />
              <button
                onClick={handleSkills}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add
              </button>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-md z-10">
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
            {/* Added Skills Display Section */}
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => {
                      const updatedSkills = job.skillsRequired.filter(
                        (_, i) => i !== index
                      );
                      setJob({ ...job, skillsRequired: updatedSkills });
                    }}
                    className="ml-2 text-blue-600 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              name="location"
              value={job.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-3 border rounded-md outline-none"
            />

            <input
              name="pinCode"
              value={job.pinCode}
              onChange={handleChange}
              placeholder="Pin Code"
              className="w-full p-3 border rounded-md outline-none"
            />

            <input
              name="salary"
              value={job.salary ? `₹${job.salary.toLocaleString("en-IN")}` : ""}
              readOnly
              placeholder="Total Monthly Salary (auto-calculated)"
              className="w-full p-3 border rounded-md outline-none bg-gray-100 cursor-not-allowed"
              title="Salary is auto-calculated based on hours and payment per hour"
            />

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setJob({
                    ...job,
                    description: `
Job Summary:
${jobSummary}

Key Responsibilities:
${keyResponsibilities}
                  `.trim(),
                  });
                  setPreview(true);
                }}
                className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Preview
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* RIGHT SECTION: LIVE PREVIEW */}
      <div className="w-full md:w-1/2">
        {preview ? (
          <JobPreviewCard job={job} onClose={() => setPreview(false)} />
        ) : (
          <div className="flex items-center justify-center h-full mt-2 text-gray-500">
            Click “Preview” to see your job summary
          </div>
        )}
      </div>
    </div>
  );
}
