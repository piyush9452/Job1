import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
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
  X,
  Building2,
  Send,
} from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  const navigate = useNavigate();

  // Prevent scrolling on the background body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!job) return null;

  const renderArray = (val) => {
    if (!val) return "Not specified";
    if (Array.isArray(val))
      return val.length > 0 ? val.join(", ") : "Not specified";
    return String(val);
  };

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose} // Clicking outside closes the modal
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        className="bg-[#F8FAFC] w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* --- PREMIUM HEADER --- */}
        <header className="bg-white p-6 sm:p-8 border-b border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none -mt-20 -mr-20"></div>

          <div className="relative z-10 flex gap-4 sm:gap-6 items-center w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-3xl shrink-0 text-indigo-600 font-extrabold shadow-sm">
              {job.postedByCompany ? (
                job.postedByCompany.charAt(0)
              ) : job.postedByName ? (
                job.postedByName.charAt(0)
              ) : (
                <Building2 size={32} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {renderArray(job.mode)}
                </span>
                <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                  {renderArray(job.jobType)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center text-slate-500 text-xs sm:text-sm font-bold gap-3 mt-2">
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering the job card click
                    if (job.postedBy) navigate(`/company/${job.postedBy}`);
                  }}
                  className="text-slate-700 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  {job.postedByCompany ||
                    job.postedByName ||
                    "Confidential Employer"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400" />{" "}
                  {displayLocation}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-20"
          >
            <X size={20} />
          </button>
        </header>

        {/* --- SCROLLABLE BODY --- */}
        <div className="overflow-y-auto custom-scrollbar p-4 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAIN CONTENT (LEFT) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Highlights / Features */}
              {validFeatures.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {validFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-4 sm:p-5 rounded-2xl flex items-start gap-3 sm:gap-4 shadow-sm"
                    >
                      <div className="p-2 bg-amber-100/50 rounded-lg shrink-0">
                        <Zap
                          className="text-amber-500"
                          size={18}
                          sm:size={20}
                        />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5 sm:mt-1 leading-snug">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Candidate Requirements - COMPACT INLINE ROW */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
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
                      <Users size={12} className="text-indigo-400" /> Age Limit
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
                      <UserCircle2 size={12} className="text-indigo-400" />{" "}
                      Gender
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {job.genderPreference || "No Preference"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Required Skills */}
              {job.skillsRequired?.length > 0 && (
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <CheckCircle2 size={18} />
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

              {/* Description */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-5 sm:mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Briefcase size={18} />
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
              <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
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

              {/* Schedule & Timings */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] sm:text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                      <Clock size={16} />
                    </div>{" "}
                    Schedule
                  </h3>
                  {job.isFlexibleShifts && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-blue-100">
                      Flexible
                    </span>
                  )}
                </div>

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
                  Standard Shift Timings
                </p>
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
        </div>

        {/* --- FOOTER ACTION --- */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0 flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(`/apply/${job._id}`)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Send size={18} /> Apply for this Job
          </button>
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
