import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Briefcase,
  CheckCircle2,
  CalendarDays,
  Zap,
  GraduationCap,
  Languages,
  UserCircle2,
} from "lucide-react";

export default function EmployerJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) return navigate("/login");
        const token = JSON.parse(stored)?.token;
        if (!token) return navigate("/login");

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setJob(data.job || data);
      } catch (err) {
        console.error("Failed to load job", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    )
      return;
    try {
      const token = JSON.parse(localStorage.getItem("employerInfo"))?.token;
      await axios.delete(`https://jobone-mrpy.onrender.com/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job deleted successfully.");
      navigate("/employerdashboard");
    } catch (err) {
      alert(
        "Failed to delete job: " + (err.response?.data?.message || err.message),
      );
    }
  };

  const renderArray = (val) => {
    if (!val) return "Not specified";
    if (Array.isArray(val))
      return val.length > 0 ? val.join(", ") : "Not specified";
    return String(val);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-slate-500 bg-slate-50">
        <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
      </div>
    );

  if (!job)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl border border-slate-200 max-w-md shadow-xl mx-4">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            This posting may have been removed or is unavailable.
          </p>
          <button
            onClick={() => navigate("/employerdashboard")}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  const isRemote =
    renderArray(job.mode).toLowerCase().includes("home") ||
    job.mode === "Online";
  const displayLocation = isRemote
    ? "Remote"
    : typeof job.location === "object"
      ? job.location?.address
      : job.location || "Location not specified";
  const validFeatures =
    job.jobFeatures?.filter((f) => f && f.trim() !== "") || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-10 sm:mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* --- PREMIUM HEADER --- */}
        <header className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none -mt-20 -mr-20"></div>

          <div className="relative z-10 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${job.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {job.status || "Active"}
              </span>
              <span className="px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                {renderArray(job.mode)}
              </span>
              <span className="px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                {renderArray(job.jobType)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center text-slate-500 text-xs sm:text-sm font-bold gap-2">
              <MapPin size={16} className="text-slate-400 shrink-0" />{" "}
              <span className="truncate">{displayLocation}</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-3 relative z-10 w-full lg:w-auto">
            <button
              onClick={() => navigate(`/job/${job._id}/applicants`)}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 bg-indigo-600 text-white px-5 sm:px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Users size={18} /> Applicants
            </button>
            <button
              onClick={() => navigate(`/editjob/${job._id}`)}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 bg-white text-slate-700 px-5 sm:px-6 py-3 rounded-xl font-bold hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
            >
              <Pencil size={18} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 bg-rose-50 text-rose-600 px-5 sm:px-6 py-3 rounded-xl font-bold hover:bg-rose-100 border border-rose-100 transition-colors"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Highlights / Features */}
            {validFeatures.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-4 sm:p-5 rounded-2xl flex items-start gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-2 bg-amber-100/50 rounded-lg shrink-0">
                      <Zap className="text-amber-500" size={18} sm:size={20} />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5 sm:mt-1 leading-snug">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Candidate Requirements Grid (MOVED TO TOP) */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <UserCircle2 size={18} />
                </div>{" "}
                Candidate Profile
              </h2>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <GraduationCap size={12} className="text-indigo-400" />{" "}
                    Education
                  </p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    {renderArray(job.qualifications)}
                    {job.courses?.length > 0 && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({job.courses.join(", ")})
                      </span>
                    )}
                  </p>
                </div>

                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Languages size={12} className="text-indigo-400" />{" "}
                    Languages
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {renderArray(job.languages)}
                  </p>
                </div>

                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Users size={12} className="text-indigo-400" /> Age
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {job.ageLimit?.isAny
                      ? "Any Age"
                      : job.ageLimit?.min
                        ? `${job.ageLimit.min}-${job.ageLimit.max} Yrs`
                        : "Not Specified"}
                  </p>
                </div>

                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <UserCircle2 size={12} className="text-indigo-400" /> Gender
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {job.genderPreference || "No Preference"}
                  </p>
                </div>
              </div>
            </section>

            {/* Required Skills (MOVED UP) */}
            {job.skillsRequired?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <CheckCircle2 size={18} sm:size={20} />
                  </div>{" "}
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 text-white rounded-xl text-[10px] sm:text-xs font-bold shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Description (MOVED TO BOTTOM) */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-5 sm:mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Briefcase size={18} sm:size={20} />
                </div>{" "}
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed font-medium">
                {job.description}
              </div>
            </section>
          </div>

          {/* --- SIDEBAR DETAILS (RIGHT) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Premium Compensation Card */}
            <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 sm:mb-6 relative z-10">
                Compensation
              </h3>
              <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wide">
                  Total Salary
                </p>
                <div className="flex items-baseline gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                  <IndianRupee
                    size={24}
                    sm:size={28}
                    className="text-emerald-400"
                  />
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {job.salaryAmount
                      ? job.salaryAmount.toLocaleString()
                      : "TBD"}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 flex justify-between items-center text-xs sm:text-sm font-bold backdrop-blur-md">
                  <span className="text-slate-300">Frequency</span>
                  <span className="text-emerald-400 uppercase tracking-wider">
                    {job.salaryFrequency || "Monthly"}
                  </span>
                </div>
                {job.incentives && (
                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Zap size={12} /> Perks & Benefits
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                      {job.incentives}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Schedule & Timings (MOVED TO RIGHT COLUMN) */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] sm:text-xs font-extrabold text-slate-800 mb-5 sm:mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                  <Clock size={16} />
                </div>{" "}
                Schedule & Shifts
              </h3>

              <div className="mb-5 sm:mb-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                  Working Days
                </p>
                <div className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                  {job.workDaysPattern
                    ? job.workDaysPattern === "Custom"
                      ? job.customWorkDaysDescription
                      : job.workDaysPattern
                    : renderArray(job.workDays)}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                Shift Timings
              </p>
              {job.isFlexibleShifts ? (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100 inline-block shadow-sm">
                  Flexible Timings
                </span>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {job.shifts?.map((shift, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <span className="font-bold text-slate-800 text-xs truncate mr-2">
                        {shift.shiftName}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-1 border border-slate-200 rounded-md shadow-sm shrink-0">
                        {shift.startTime || "--:--"} -{" "}
                        {shift.endTime || "--:--"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Overview Card */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 sm:mb-6 border-b border-slate-100 pb-3">
                Job Overview
              </h3>
              <div className="space-y-4 sm:space-y-5">
                <DetailRow
                  icon={<CalendarDays size={16} className="text-blue-500" />}
                  label="Start Date"
                  value={
                    job.startDate
                      ? new Date(job.startDate).toLocaleDateString()
                      : "TBD"
                  }
                />
                <DetailRow
                  icon={<Calendar size={16} className="text-rose-500" />}
                  label="End Date"
                  value={
                    job.isLongTerm
                      ? "Long Term"
                      : job.endDate
                        ? new Date(job.endDate).toLocaleDateString()
                        : "TBD"
                  }
                />
                {job.applicationDeadline && (
                  <>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <DetailRow
                      icon={<Clock size={16} className="text-amber-500" />}
                      label="Apply Before"
                      value={new Date(
                        job.applicationDeadline,
                      ).toLocaleDateString()}
                    />
                  </>
                )}
                <div className="h-px bg-slate-100 my-2"></div>
                <DetailRow
                  icon={<Users size={16} className="text-purple-500" />}
                  label="Openings"
                  value={`${job.noOfPeopleRequired} Spots`}
                />
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Minimal Detail Row Component for the Sidebar
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
          {icon}
        </div>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span
        className="text-slate-900 font-extrabold text-xs sm:text-sm text-right truncate max-w-[45%]"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
