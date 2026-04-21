import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Edit, MapPin, Globe, Mail, Phone, CheckCircle, XCircle, FileText,
  Star, Calendar, Building, User, Briefcase
} from "lucide-react";

export default function EmployerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchEmployerProfile();
    fetchEmployerJobs();
  }, []);

  const fetchEmployerProfile = async () => {
    try {
      const storedData = localStorage.getItem("employerInfo");
      if (!storedData) {
        navigate("/login");
        return;
      }

      const info = JSON.parse(storedData);
      const token = info.token;
      const employerID = info.employerId;

      if (!token || !employerID) {
        navigate("/login");
        return;
      }

      const { data } = await axios.get(
        `https://jobone-mrpy.onrender.com/employer/profile/${employerID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const storedData = localStorage.getItem("employerInfo");
      if (!storedData) return;
      const info = JSON.parse(storedData);
      if (!info.token) return;

      const { data } = await axios.get(
        "https://jobone-mrpy.onrender.com/jobs/employerJobs",
        { headers: { Authorization: `Bearer ${info.token}` } }
      );

      if (Array.isArray(data)) setJobs(data);
      else if (data.jobs) setJobs(data.jobs);
      else setJobs([]);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  const calculateRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "No ratings yet";
    const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / ratings.length).toFixed(1) + " / 5.0";
  };

  if (!profile) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  // FACT: Helper function to render document status rows
  const DocumentRow = ({ name, field }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{name}</span>
      {profile[field] ? (
        <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <CheckCircle size={12} /> Uploaded
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
          <XCircle size={12} /> Missing
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-15 font-sans">
      {/* ---------------- Header Section ---------------- */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/150"}
              alt="Logo"
              className="w-32 h-32 object-cover rounded-xl border-4 border-gray-50 shadow-sm"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.employerType === 'company' ? (profile.companyName || profile.name) : profile.name}
                </h1>
                
                {/* FACT: Show Employer Type Badge */}
                <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md">
                  {profile.employerType === 'company' ? <Building size={14} /> : <User size={14} />}
                  {profile.employerType === 'company' ? 'Company' : 'Individual'}
                </span>

                {profile.isApproved === "approved" && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    <CheckCircle size={14} /> Approved
                  </span>
                )}
                {profile.isApproved === "pending" && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">
                    <CheckCircle size={14} /> Pending Review
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-3">
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-400" />
                  {profile.officeLocation?.address || profile.location || "Location not set"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-gray-400" />
                  Joined {new Date(profile.createdAt).getFullYear()}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  {calculateRating(profile.ratingsReceived)} ({profile.ratingsReceived?.length || 0} reviews)
                </div>
              </div>
            </div>

            <button onClick={() => navigate(`/employereditprofile`)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">
              <Edit size={18} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------------- Left Column: Info Cards ---------------- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Business Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Business Details</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Industry</p>
                  <p className="text-sm text-gray-800 font-medium">{profile.industry || "Not Specified"}</p>
                </div>
              </li>
              {/* FACT: Conditionally render Nature of Business if they are a company */}
              {profile.employerType === 'company' && profile.natureOfBusiness && (
                <li className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Nature of Business</p>
                    <p className="text-sm text-gray-800 font-medium">{profile.natureOfBusiness}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                  <p className="text-sm text-gray-800">{profile.name}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-800 break-all">{profile.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-800">{profile.phone || "N/A"}</p>
                </div>
              </li>
              {profile.employerType === 'company' && (
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    {profile.companyWebsite ? (
                      <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium hover:underline break-all">
                        {profile.companyWebsite}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">N/A</p>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* FACT: Dynamic Document Verification Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600"/> Verification Documents
            </h3>
            <div className="space-y-2 mb-4">
              {/* Universal Documents */}
              <DocumentRow name="Aadhar Card" field="aadharCard" />
              <DocumentRow name="PAN Card" field="panCard" />
              
              {/* Conditional Documents */}
              {profile.employerType === "company" ? (
                <>
                  <DocumentRow name="Company GST Form" field="gstForm" />
                  <DocumentRow name="Other Business Cert." field="otherBusinessCertificate" />
                </>
              ) : (
                <>
                  <DocumentRow name="Trade License" field="tradeLicense" />
                  <DocumentRow name="Education Docs" field="educationDocuments" />
                </>
              )}
            </div>
            
            <button
              onClick={() => navigate("/employerdocupload")}
              className="w-full text-sm font-bold bg-blue-50 text-blue-700 py-2.5 rounded-lg hover:bg-blue-100 transition shadow-sm"
            >
              Manage Documents
            </button>
          </div>
        </div>

        {/* ---------------- Right Column: Main Content ---------------- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {profile.description || "No description provided yet."}
            </p>
            {/* Provide helpful context if description is too short based on our new rule */}
            {profile.description && profile.description.split(/\s+/).length < 200 && (
               <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2">
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <p>Your description is currently under the required 200 words. You will not be able to post jobs until you expand this section in Edit Profile.</p>
               </div>
            )}
          </div>

          {/* Openings Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Current Openings
              <span className="bg-blue-100 text-blue-700 text-sm px-2.5 py-0.5 rounded-full font-bold">{jobs.length}</span>
            </h2>

            {jobs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500 font-medium">No job openings posted yet.</p>
                <button onClick={() => navigate("/createjob")} className="mt-2 text-blue-600 font-bold hover:underline">
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <motion.div key={job._id} whileHover={{ y: -2 }} className="cursor-pointer bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition" onClick={() => navigate(`/job/${job._id}`)}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800 truncate">{job.title}</h3>
                      {job.status === "pending_approval" && (
                         <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{job.jobType}</span>
                      <span>•</span>
                      <span>{job.location?.address || "Remote"}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
                    <div className="text-blue-600 font-bold text-sm">View Details →</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}