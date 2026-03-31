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

  // FACT: Smart fallback to handle both legacy strings and new arrays seamlessly
  const renderArray = (val) => {
    if (!val) return "Not specified";
    if (Array.isArray(val))
      return val.length > 0 ? val.join(", ") : "Not specified";
    return String(val); // Legacy fallback
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
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Job Not Found
          </h2>
          <button
            onClick={() => navigate("/employerdashboard")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold mt-4"
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
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* HEADER */}
        <header className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${job.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {job.status || "Active"}
              </span>
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                {renderArray(job.mode)}
              </span>
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                {renderArray(job.jobType)}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {job.title}
            </h1>
            <div className="flex items-center text-slate-500 text-sm font-medium gap-2">
              <MapPin size={16} /> {displayLocation}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              onClick={() => navigate(`/job/${job._id}/applicants`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              <Users size={16} /> Applicants
            </button>
            <button
              onClick={() => navigate(`/editjob/${job._id}`)}
              className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 border border-slate-200 shadow-sm"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-100 border border-rose-100"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Highlights (If any) */}
            {validFeatures.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validFeatures.map((feature, i) => (
                  <div
                    key={i}
                    className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3"
                  >
                    <Zap className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-bold text-amber-900">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-4">
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed font-medium">
                {job.description}
              </div>
            </section>

            {/* Candidate Requirements */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <UserCircle2 size={18} /> Candidate Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                    <GraduationCap size={14} /> Education
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {renderArray(job.qualifications)}
                  </p>
                  {job.courses?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Streams: {job.courses.join(", ")}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                    <Languages size={14} /> Languages
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {renderArray(job.languages)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                    <Users size={14} /> Age Requirement
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {job.ageLimit?.isAny
                      ? "Any Age"
                      : job.ageLimit?.min
                        ? `${job.ageLimit.min} to ${job.ageLimit.max} Years`
                        : "Not Specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                    <UserCircle2 size={14} /> Gender
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {job.genderPreference || "No Preference"}
                  </p>
                </div>
              </div>
            </section>

            {/* Schedule & Timings */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Clock size={18} /> Schedule & Shifts
              </h2>
              <div className="mb-6">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">
                  Working Days
                </p>
                <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                  {job.workDaysPattern
                    ? job.workDaysPattern === "Custom"
                      ? job.customWorkDaysDescription
                      : job.workDaysPattern
                    : renderArray(job.workDays)}
                </div>
              </div>

              <p className="text-xs text-slate-400 font-bold uppercase mb-2">
                Shift Timings
              </p>
              {job.isFlexibleShifts ? (
                <span className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl border border-blue-100 inline-block">
                  Flexible Timings
                </span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.shifts?.map((shift, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <span className="font-bold text-slate-800 text-sm">
                        {shift.shiftName}
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-600">
                        {shift.startTime || "--:--"} -{" "}
                        {shift.endTime || "--:--"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Skills */}
            {job.skillsRequired?.length > 0 && (
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR DETAILS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compensation Card */}
            <section className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Compensation
              </h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <IndianRupee size={24} className="text-emerald-400" />
                <span className="text-3xl font-extrabold">
                  {job.salaryAmount ? job.salaryAmount.toLocaleString() : "TBD"}
                </span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">Frequency</span>
                <span className="text-emerald-400 uppercase">
                  {job.salaryFrequency || "Monthly"}
                </span>
              </div>
              {job.incentives && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Incentives / Perks
                  </p>
                  <p className="text-sm font-medium text-slate-200">
                    {job.incentives}
                  </p>
                </div>
              )}
            </section>

            {/* Overview Card */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">
                Job Overview
              </h3>
              <div className="space-y-4">
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
                      ? "Long Term Role"
                      : job.endDate
                        ? new Date(job.endDate).toLocaleDateString()
                        : "TBD"
                  }
                />
                {job.applicationDeadline && (
                  <DetailRow
                    icon={<Clock size={16} className="text-amber-500" />}
                    label="Apply Before"
                    value={new Date(
                      job.applicationDeadline,
                    ).toLocaleDateString()}
                  />
                )}
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

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className="text-slate-900 font-extrabold text-sm text-right truncate max-w-[50%]"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
