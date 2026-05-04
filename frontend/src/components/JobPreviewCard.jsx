import React from "react";
import {
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Users,
  X,
  GraduationCap,
  Languages,
  UserCircle2,
  CheckCircle2,
  FileText,
  Zap,
} from "lucide-react";

export default function JobPreviewCard({ job, onClose }) {
  // FACT: Safe fallback for legacy strings vs new arrays
  const renderArray = (val) => {
    if (!val) return "Not specified";
    if (Array.isArray(val))
      return val.length > 0 ? val.join(", ") : "Not specified";
    return String(val);
  };

  const isRemote =
    renderArray(job.mode).toLowerCase().includes("home") ||
    job.mode === "Online";
  const locationText = isRemote
    ? "Remote"
    : typeof job.location === "object"
      ? job.location.address
      : job.location || "Location not set";

  const validFeatures =
    job.jobFeatures?.filter((f) => f && f.trim() !== "") || [];

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-full max-h-[85vh] lg:max-h-[800px] overflow-hidden relative">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <FileText size={16} /> Live Preview
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {job.title || "Job Title"}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
              <MapPin size={14} className="text-slate-400" /> {locationText}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
              <IndianRupee size={14} className="text-green-500" />{" "}
              {job.salaryAmount
                ? `${job.salaryAmount === 0 || !job.salaryAmount ? "Unpaid" : `₹${job.salaryAmount}`} / ${job.salaryFrequency || "Mo"}`
                : "Salary TBD"}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 capitalize">
              <Briefcase size={14} className="text-blue-500" />{" "}
              {renderArray(job.jobType)}
            </span>
          </div>
        </div>

        {validFeatures.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {validFeatures.map((feature, i) => (
              <div
                key={i}
                className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3"
              >
                <Zap className="text-amber-500 shrink-0" size={16} />
                <p className="text-sm font-bold text-amber-900">{feature}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock size={12} /> Schedule
            </p>
            <p className="text-sm font-bold text-slate-800">
              {job.workDaysPattern
                ? job.workDaysPattern === "Custom"
                  ? job.customWorkDaysDescription
                  : job.workDaysPattern
                : renderArray(job.workDays)}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {job.isFlexibleShifts
                ? "Flexible Timings"
                : `${job.shifts?.length || 0} Shift(s)`}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users size={12} /> Openings
            </p>
            <p className="text-sm font-bold text-slate-800">
              {job.noOfPeopleRequired || "TBD"} Position(s)
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {renderArray(job.mode)}
            </p>
          </div>
        </div>

        <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
          <h3 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-100 pb-2">
            <UserCircle2 size={14} /> Candidate Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">
                <GraduationCap size={10} className="inline mr-1" /> Education
              </p>
              <p className="text-sm text-slate-700 font-bold">
                {renderArray(job.qualifications)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">
                <Languages size={10} className="inline mr-1" /> Languages
              </p>
              <p className="text-sm text-slate-700 font-bold">
                {renderArray(job.languages)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">
                Age Limit
              </p>
              <p className="text-sm text-slate-700 font-bold">
                {job.ageLimit?.isAny
                  ? "Any Age"
                  : job.ageLimit?.min
                    ? `${job.ageLimit.min}-${job.ageLimit.max} Yrs`
                    : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">
                Gender
              </p>
              <p className="text-sm text-slate-700 font-bold">
                {job.genderPreference || "No Preference"}
              </p>
            </div>
          </div>
        </div>

        {job.skillsRequired?.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-wider">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, i) => (
                <span
                  key={i}
                  className="bg-slate-900 text-white px-3 py-1 rounded-md text-[10px] font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6 pb-6">
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Job Summary
            </h3>
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{
                __html: job.jobSummary || job.description,
              }}
            />
          </div>
          {job.keyResponsibilities && (
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Key Responsibilities
              </h3>
              <div
                className="prose prose-sm max-w-none text-slate-600 prose-ul:list-disc prose-ul:pl-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: job.keyResponsibilities }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <button
          disabled
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} /> Apply Now (Preview)
        </button>
      </div>
    </div>
  );
}
