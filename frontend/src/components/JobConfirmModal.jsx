// components/JobConfirmModal.jsx
import {
    X,
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    Users,
    Briefcase,
    ListChecks,
} from "lucide-react";

export default function JobConfirmModal({ job, summary, responsibilities, onClose, onConfirm, loading }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Review Job Details
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    <Section title="Job Overview" icon={<Briefcase size={18} />}>
                        <Item label="Title" value={job.title} />
                        <Item label="Type" value={job.durationType} />
                        <Item label="Mode" value={job.mode} />
                    </Section>

                    <Section title="Schedule" icon={<CalendarDays size={18} />}>
                        <Item label="Start Date" value={job.startDate} />
                        <Item label="End Date" value={job.endDate} />
                        <Item label="Time" value={`${job.workFrom} - ${job.workTo}`} />
                        <Item label="Daily Hours" value={`${job.dailyWorkingHours} hrs`} />
                    </Section>

                    <Section title="Payment" icon={<IndianRupee size={18} />}>
                        <Item label="Per Hour" value={`₹${job.paymentPerHour}`} />
                        <Item label="Total Salary" value={`₹${job.salary}`} />
                        <Item label="Openings" value={job.noOfPeopleRequired} />
                    </Section>

                    <Section title="Location" icon={<MapPin size={18} />}>
                        <p className="text-gray-700 text-sm">{job.location}</p>
                    </Section>

                    {job.skillsRequired.length > 0 && (
                        <Section title="Required Skills" icon={<ListChecks size={18} />}>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map((s, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border"
                                    >
                    {s}
                  </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    <Section title="Job Summary">
                        <p className="text-gray-700 whitespace-pre-line">{summary}</p>
                    </Section>

                    <Section title="Key Responsibilities">
                        <p className="text-gray-700 whitespace-pre-line">
                            {responsibilities}
                        </p>
                    </Section>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-8 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:bg-blue-300"
                    >
                        {loading ? "Posting..." : "Confirm & Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---- Small helpers ---- */

const Section = ({ title, icon, children }) => (
    <div>
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
            {children}
        </div>
    </div>
);

const Item = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
    </div>
);
