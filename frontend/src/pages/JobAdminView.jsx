import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Briefcase, Building, MapPin, DollarSign, Clock, FileText, CheckCircle, XCircle } from "lucide-react";

export default function JobAdminView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      const { data } = await axios.get(`https://jobone-mrpy.onrender.com/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(data);
    } catch (err) {
      alert("Failed to load job data.");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setActionLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo")).token;
      await axios.patch(`https://jobone-mrpy.onrender.com/admin/jobs/${id}/review`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Job successfully ${status === 'active' ? 'approved' : 'rejected'}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!job) return <div className="text-center mt-20 text-red-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-3">
              Admin Review: {job.title}
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Building size={16} /> {job.postedByCompany || job.postedByName}
            </p>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="bg-slate-800 px-4 py-2 rounded-lg font-bold hover:bg-slate-700 border border-slate-700">
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Action */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Work Mode & Type</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <Briefcase size={14}/> {job.jobType} • {job.mode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Salary</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <DollarSign size={14}/> {job.salaryAmount === 0 || !job.salaryAmount ? "Unpaid" : `₹${job.salaryAmount}`} / {job.salaryFrequency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Location</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <MapPin size={14}/> {job.location?.address || "Remote"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Duration</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                    <Clock size={14}/> {job.isLongTerm ? "Long Term" : job.durationType}
                  </p>
                </div>
              </div>
            </div>

            {/* Master Action Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h2 className="text-lg font-bold text-slate-800 mb-4">Final Decision</h2>
               <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handleStatusChange("active")}
                   disabled={actionLoading}
                   className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                 >
                   <CheckCircle size={18} /> Approve & Publish
                 </button>
                 <button 
                   onClick={() => handleStatusChange("rejected")}
                   disabled={actionLoading}
                   className="w-full bg-rose-100 text-rose-700 py-3 rounded-xl font-bold hover:bg-rose-200 transition flex items-center justify-center gap-2"
                 >
                   <XCircle size={18} /> Reject Job
                 </button>
               </div>
            </div>
          </div>

          {/* Right Column: Description & Skills */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                <FileText className="text-blue-600"/> Job Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired && job.skillsRequired.length > 0 ? (
                  job.skillsRequired.map((skill, index) => (
                    <span key={index} className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-indigo-100">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">No specific skills listed.</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}