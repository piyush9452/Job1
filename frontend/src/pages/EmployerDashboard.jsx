import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Briefcase, MapPin, LayoutDashboard, Search, Users, Clock, ChevronRight, Settings, LogOut} from "lucide-react";import axios from "axios";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function EmployerDashboard() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    // ✅ Fetch user's job posts using token only
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // 1. Get Token
                const stored = localStorage.getItem("employerInfo");
                if (!stored) {
                    console.warn("No employer info found in local storage.");
                    return;
                }

                const employerInfo = JSON.parse(stored);
                const token = employerInfo?.token;

                if (!token) {
                    console.error("No token found inside employerInfo.");
                    return;
                }

                // 2. API Call
                console.log(
                    "Fetching jobs with token:",
                    token.substring(0, 10) + "..."
                ); // Debug log

                const {data} = await axios.get(
                    `https://jobone-mrpy.onrender.com/jobs/employerJobs`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );

                console.log("API Success:", data); // See what you actually got back

                if (Array.isArray(data)) {
                    setJobs(data);
                } else if (data.jobs) {
                    setJobs(data.jobs);
                } else {
                    setJobs([]);
                }
            } catch (err) {
                // 3. Detailed Error Logging
                console.error("❌ API Error:", {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    message: err.message,
                });

                setJobs([]);

                // Optional: Redirect on 401 (Unauthorized)
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };

        fetchJobs();
    }, [navigate]);

    return (
        <div className="min-h-screen py-20 bg-gray-50 p-10">
            <aside className="fixed left-0 top-15 hidden h-full w-64 border-r border-slate-200 bg-white p-6 md:block">
                <div className="mb-10 flex items-center gap-2 px-2">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Briefcase size={22}/>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">JobOne</span>
                </div>

                <nav className="space-y-1">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active/>
                    <NavItem icon={<Users size={20}/>} label="Candidates"/>
                    <NavItem icon={<Settings size={20}/>} label="Settings"/>
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600">
                        <LogOut size={20}/> <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
            <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                My Dashboard
            </h1>

            {/* ✨ Decorative Post a Job Card */}
            <main className="flex-1 md:ml-64">
                <header
                    className="sticky top-0 mb-10 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
                    <div className="relative w-72  ">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input
                            type="text"
                            placeholder="Search your jobs..."
                            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/createjob")}
                            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <PlusCircle size={18}/> Post Job
                        </button>
                    </div>
                </header>
                <div>
                    <section className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900">Welcome back!</h1>
                        <p className="mt-1 text-slate-500">Here's what's happening with your job listings today.</p>
                    </section>

                    {/* Quick Stats Grid */}
                    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <StatCard label="Active Listings" value={jobs.length} color="blue"/>
                        <StatCard label="Total Applications" value="24" color="emerald"/>
                        <StatCard label="Profile Views" value="1.2k" color="purple"/>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Your Active Listings</h2>
                    </div>

                        {/*<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">*/}
                        {/*    {[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200"/>)}*/}
                        {/*</div>*/}
                    { jobs.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
                            <div
                                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Briefcase size={32}/>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No active job posts</h3>
                            <p className="text-slate-500">Get started by creating your first part-time job listing.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            <AnimatePresence>
                                { jobs.map((job) => (
                                    <motion.div
                                        key={job._id}
                                        variants={itemVariants}
                                        whileHover={{y: -5}}
                                        onClick={() => navigate(`/job/${job._id}`)}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5"
                                    >
                                        <div>
                                            <div className="mb-4 flex items-start justify-between">
                                                <span
                                                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Part-Time</span>
                                                <ChevronRight
                                                    className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
                                                    size={18}/>
                                            </div>
                                            <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-blue-600">{job.title}</h3>
                                            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{job.description}</p>
                                        </div>
                                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin size={16} className="text-slate-400"/>
                                                {job.location.address || "Remote"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock size={16} className="text-slate-400"/>
                                                Posted 2 days ago
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>



      {/* My Job Posts Section */}
      {/*<div className="max-w-5xl mx-auto mt-14">*/}
      {/*  <h2 className="text-2xl font-semibold text-gray-800 mb-5">*/}
      {/*    My Part-Time Job Posts*/}
      {/*  </h2>*/}

      {/*  {jobs.length === 0 ? (*/}
      {/*    <p className="text-gray-500 text-center mt-10">*/}
      {/*      You haven’t posted any part-time jobs yet.*/}
      {/*    </p>*/}
      {/*  ) : (*/}
      {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">*/}
      {/*      {jobs.map((job) => (*/}
      {/*        <motion.div*/}
      {/*          key={job._id}*/}
      {/*          whileHover={{ scale: 1.02 }}*/}
      {/*          transition={{ duration: 0.2 }}*/}
      {/*          onClick={() => navigate(`/job/${job._id}`)}*/}
      {/*          className="cursor-pointer bg-white shadow-md rounded-xl p-5 hover:shadow-xl hover:border hover:border-blue-300 transition"*/}
      {/*        >*/}
      {/*          <h3 className="text-lg font-semibold text-gray-800  mr-30 ">*/}
      {/*            {job.title}*/}
      {/*          </h3>*/}
      {/*          <p className="text-sm text-gray-600 line-clamp-3">*/}
      {/*            {job.description}*/}
      {/*          </p>*/}
      {/*          <div className="mt-3 text-blue-600 font-medium text-sm">*/}
      {/*            {job.location.address || "Remote"}*/}
      {/*          </div>*/}
      {/*        </motion.div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  );
}
function NavItem({ icon, label, active = false }) {
    return (
        <button className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${
            active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}>
            {icon} {label}
        </button>
    );
}
function StatCard({ label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        purple: "bg-purple-50 text-purple-600"
    };
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-2 flex items-end justify-between">
                <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
                <span className={`rounded-lg px-2 py-1 text-xs font-bold ${colors[color]}`}>+12%</span>
            </div>
        </div>
    );
}
