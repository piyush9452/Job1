import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  Clock,
  Loader2,
  SearchX,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import JobDetailsModal from "../components/JobDetailsModal"; // Import the modal

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // State for the selected job

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Note: Ensure you are using the correct key (userInfo or userToken) based on your auth flow
        const storedUser = localStorage.getItem("userInfo");
        const user = storedUser ? JSON.parse(storedUser) : null;

        // Handle the id/userId mismatch we fixed earlier
        const userId = user?.id || user?.userId;

        if (!token || !userId) {
          // Silent fail or redirect handled by protected route usually
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/applications/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Helper for Status Styles
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "interview":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "applied":
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p className="font-medium">Loading your applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Applications Yet
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't applied to any jobs. Start exploring opportunities now!
          </p>
          <Link
            to="/jobs"
            className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Find Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              My Applications
            </h1>
            <p className="text-gray-500 mt-1">
              Track the status of your current job applications.
            </p>
          </div>
          <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 shadow-sm border border-gray-200">
            Total: {applications.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            const job = app.job || {};
            // Handle location object vs string from your schema history
            const locationStr =
              typeof job.location === "object"
                ? job.location.address
                : job.location;

            return (
              <div
                key={app.applicationId || app._id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
                      {(job.postedByCompany || job.postedByName || "C").charAt(
                        0
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {job.title || "Job Title Unavailable"}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                        <Building2 size={14} />
                        {job.postedByCompany ||
                          job.postedByName ||
                          "Unknown Company"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="truncate">{locationStr || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee size={16} className="text-gray-400" />
                    <span>
                      {job.salary ? job.salary.toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="capitalize">
                      {job.jobType || "Full-time"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> Updated recently
                  </p>
                  {/* Updated Link to Button for Modal */}
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 focus:outline-none"
                  >
                    View Job
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render the JobDetailsModal if a job is selected */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
