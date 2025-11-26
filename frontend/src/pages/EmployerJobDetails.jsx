import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export default function EmployerJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const dataset = JSON.parse(localStorage.getItem("employerInfo"));
        console.log("Stored employerInfo:", dataset); // DEBUG
        const token = dataset.token; // FIXED

        if (!token) {
          alert("Session expired. Please log in again.");
        }
        console.log(`https://jobone-mrpy.onrender.com/jobs/${id}`);
        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // FIXED
          }
        );

        setJob(data);
      } catch (err) {
        console.error("Failed to load job", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("employerToken"); // FIXED

      await axios.delete(
        `https://jobone-mrpy.onrender.com/jobs/${id}`, // FIXED jobID
        {
          headers: { Authorization: `Bearer ${token}` }, // FIXED
        }
      );

      alert("Job deleted successfully.");
      navigate("/employerdashboard");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <Loader2 className="animate-spin mr-2" /> Loading job details...
      </div>
    );
  }

  if (!job) {
    return <div className="p-10 text-center text-gray-600">Job not found.</div>;
  }
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-10 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

        <p className="text-gray-600 mb-2 text-lg">
          <strong>Location:</strong> {job.location || "Remote"}
        </p>

        <p className="text-gray-600 mb-4 text-lg">
          <strong>Mode:</strong> {job.mode}
        </p>

        <hr className="my-5" />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Job Description
          </h2>
          <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg border">
            {job.description}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Skills Required
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>Start Date</strong>
            <p className="text-gray-700">{job.startDate}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>End Date</strong>
            <p className="text-gray-700">{job.endDate}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>Daily Hours</strong>
            <p className="text-gray-700">{job.dailyWorkingHours} hrs</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>Payment / hr</strong>
            <p className="text-gray-700">₹{job.paymentPerHour}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>Total Salary</strong>
            <p className="text-gray-700">₹{job.salary}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border text-center">
            <strong>People Required</strong>
            <p className="text-gray-700">{job.noOfPeopleRequired}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => navigate(`/editjob/${job._id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <Pencil size={18} /> Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
