import {
  X,
  MapPin,
  CalendarDays,
  Clock,
  IndianRupee,
  Users,
  Briefcase,
  ListChecks,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function JobConfirmModal({
  job,
  summary,
  responsibilities,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Confirm & Submit
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Please review the details before making it live.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section
              title="Job Overview"
              icon={<Briefcase className="text-blue-500" size={18} />}
            >
              <Item label="Title" value={job.title} />
              <Item label="Mode" value={job.mode} />
              <Item label="Openings" value={job.noOfPeopleRequired} />
              <Item
                label="Location"
                value={
                  job.mode === "Work from Home"
                    ? "Remote"
                    : job.location || "Office/Field"
                }
              />
            </Section>

            <Section
              title="Compensation & Term"
              icon={<IndianRupee className="text-emerald-500" size={18} />}
            >
              <Item
                label="Salary Range"
                value={
                  job.salaryMin === 0 && job.salaryMax === 0
                    ? "Unpaid/Volunteer"
                    : `₹${job.salaryMin?.toLocaleString() || 0} - ₹${job.salaryMax?.toLocaleString() || 0}`
                }
              />
              <Item
                label="Perks and Bonus"
                value={`₹${job.incentives?.join(", ")}`}
              />
              <Item label="Frequency" value={job.salaryFrequency} />
              <Item
                label="Start Date"
                value={
                  job.startDate
                    ? new Date(job.startDate).toLocaleDateString()
                    : "TBD"
                }
              />
              <Item
                label="End Date"
                value={
                  job.isLongTerm
                    ? "Long Term Role"
                    : job.endDate
                      ? new Date(job.endDate).toLocaleDateString()
                      : "TBD"
                }
              />
            </Section>
          </div>

          <Section
            title="Schedule Details"
            icon={<CalendarDays className="text-purple-500" size={18} />}
          >
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Work Days
              </p>
              <div className="flex flex-wrap gap-2">
                {job.workDays?.map((day) => (
                  <span
                    key={day}
                    className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-md border border-purple-100"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Shifts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.shifts?.map((shift, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                  >
                    <span className="font-bold text-slate-700 text-sm">
                      {shift.shiftName}
                    </span>
                    <span className="font-mono text-sm text-slate-600 bg-white px-2 py-1 border border-slate-200 rounded-md">
                      {shift.startTime || "--:--"} to {shift.endTime || "--:--"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {job.skillsRequired?.length > 0 && (
            <Section
              title="Required Skills"
              icon={<ListChecks className="text-orange-500" size={18} />}
            >
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg shadow-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section
            title="Content Preview"
            icon={<CheckCircle2 className="text-indigo-500" size={18} />}
          >
            <div className="prose prose-sm max-w-none text-slate-600">
              <p className="font-bold text-slate-800 mb-2">Summary:</p>
              <div
                className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
                dangerouslySetInnerHTML={{ __html: summary }}
              />

              <p className="font-bold text-slate-800 mb-2">
                Key Responsibilities:
              </p>
              <div
                className="bg-slate-50 p-4 rounded-xl border border-slate-100"
                dangerouslySetInnerHTML={{ __html: responsibilities }}
              />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
          >
            Go Back & Edit
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all transform active:scale-95 disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            {loading ? "Publishing Job..." : "Confirm & Publish"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const Section = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
      {icon} {title}
    </h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const Item = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-slate-500 text-sm font-medium">{label}</span>
    <span
      className="font-bold text-slate-800 text-sm text-right max-w-[60%] truncate"
      title={value}
    >
      {value}
    </span>
  </div>
);
