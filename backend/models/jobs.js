import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title
  description: { type: String, required: true }, // Job details
  jobType: { type: String, enum: ["daily", "short-term", "part-time"], required: true },
  skillsRequired: { type: [String], default: [] },
  location: { type: String, required: true }, // city/area
  pinCode: { type: Number }, // optional
  salary: { type: Number, required: true }, // payment for the job
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postedByImage: { type: String }, 
  postedByName: { type: String },
  postedAt: { type: Date, default: Date.now },
  expiringAt: { type: Date }, // optional
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who applied
});

const Job = mongoose.model("Job", JobSchema);
export default Job;