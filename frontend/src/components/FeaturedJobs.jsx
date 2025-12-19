import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import JobDetailsModal from "../components/JobDetailsModal";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "https://jobone-mrpy.onrender.com/jobs"
        );
        const jobArray = data?.data || data || [];

        // Get 6 most recent jobs
        const latestJobs = Array.isArray(jobArray)
          ? jobArray.slice(-6).reverse()
          : [];
        setJobs(latestJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // --- HELPERS ---
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getLocation = (job) => {
    if (!job.location) return "Remote";
    // Handle Object (New Schema) vs String (Old Schema)
    if (typeof job.location === "object") {
      return job.location.address || "Location not specified";
    }
    return job.location;
  };

  const getCompany = (job) => {
    return job.postedByCompany || job.postedByName || "Company Confidential";
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  // --- EMPTY STATE ---
  if (jobs.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full flex items-center w-fit gap-1 mb-3">
              <Sparkles size={12} /> Recommended
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Hand-picked roles tailored for your next career move.
            </p>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const companyName = getCompany(job);
            const locationStr = getLocation(job);

            return (
              <motion.div
                key={job._id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
                onClick={() => setSelectedJob(job)}
              >
                {/* Header: Logo & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0 shadow-sm">
                    {job.postedByImage ? (
                      <img
                        src={job.postedByImage}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      companyName.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium truncate mt-1 flex items-center gap-1">
                      {companyName}
                    </p>
                  </div>
                </div>

                {/* Tags / Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
                    <MapPin size={12} />
                    <span className="truncate max-w-[100px]">
                      {locationStr.split(",")[0]}
                    </span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-100 capitalize">
                    <Briefcase size={12} /> {job.jobType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-1.5 border border-green-100">
                    <IndianRupee size={12} />{" "}
                    {job.salary ? (job.salary / 1000).toFixed(0) + "k" : "N/A"}
                  </span>
                </div>

                {/* Description Snippet */}
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Footer: Date & Button */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> {formatTimeAgo(job.createdAt)}
                  </span>
                  <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight size={16} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Integration */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
