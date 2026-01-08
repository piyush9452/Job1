import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  Globe,
} from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaUsers,
  FaGlobe,
} from "react-icons/fa";

// Import your existing sub-components
import Hero from "../userdashboard/Hero";
import JobCategories from "../userdashboard/JobCategories";
import JobsAroundMe from "../components/JobsAroundMe";
import JobDetailsModal from "../components/JobDetailsModal"; // Import Modal

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // State for Modal
  const navigate = useNavigate();

  // --- FETCH FEATURED JOBS ---
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Use your existing API
        const { data } = await axios.get(
          "https://jobone-mrpy.onrender.com/jobs"
        );
        const allJobs = data.data || data || [];

        // Take the first 6 jobs as "Featured"
        setFeaturedJobs(allJobs.slice(0, 6));
      } catch (err) {
        console.error("Failed to load featured jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Helper to safely get location string
  const getLocationStr = (job) => {
    if (typeof job.location === "object")
      return job.location.address || "Remote";
    return job.location || "Remote";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <div className="relative bg-white shadow-sm border-b border-slate-100 z-10">
        <Hero />
      </div>

      {/* 2. STATS BANNER */}
      <div className="bg-white py-10 border-b border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 text-center">
          <StatItem
            icon={<Briefcase size={20} className="text-blue-600" />}
            label="Live Jobs"
            value="500+"
          />
          <StatItem
            icon={<Building2 size={20} className="text-indigo-600" />}
            label="Companies"
            value="100+"
          />
          <StatItem
            icon={<Users size={20} className="text-green-600" />}
            label="Candidates"
            value="1,000+"
          />
          <StatItem
            icon={<Globe size={20} className="text-purple-600" />}
            label="Locations"
            value="50+"
          />
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="w-full">
        {/* 3. JOB CATEGORIES */}
        <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
              <JobCategories />
          </div>
        </section>

        {/* 4. JOBS NEAR ME */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-0">
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-400" /> Jobs Near You
                </h2>
                <p className="text-slate-400 mt-3 text-lg max-w-xl">
                  Why commute? Find opportunities in your neighborhood.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-1.5 shadow-2xl relative z-0">
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <JobsAroundMe />
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURED JOBS (REAL DATA) */}
        <section className="py-20 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                  <Sparkles size={12} /> Hot Jobs
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-3">
                  Featured Opportunities
                </h2>
              </div>
              <Link
                to="/jobs"
                className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-white rounded-2xl animate-pulse shadow-sm"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)} // Open Modal
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
                        {(
                          job.postedByCompany ||
                          job.postedByName ||
                          "C"
                        ).charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">
                        {job.jobType}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">
                      {job.postedByCompany || "Company Confidential"}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="truncate">{getLocationStr(job)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <IndianRupee size={16} className="text-slate-400" />
                        <span>
                          {job.salary ? job.salary.toLocaleString() : "N/A"} /
                          month
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span>{job.dailyWorkingHours} hrs/day</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 6. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 w-full pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
            <div className="space-y-4">
              <Link
                to="/"
                className="text-2xl font-bold text-white tracking-tight"
              >
                Job1 Portal
              </Link>
              <p className="text-sm leading-relaxed text-slate-400">
                Connecting talent with opportunity.
              </p>
            </div>
            {/* ... (Keep your footer links as is) ... */}
          </div>
          <div className="pt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Job1 Portal. All rights reserved.
          </div>
        </div>
      </footer>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 bg-slate-100 rounded-xl text-xl">{icon}</div>
      <div className="text-left">
        <p className="text-2xl font-bold text-slate-900 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}
