import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  
  // FIX: Change ref from "User" to "Employer"
  jobHost: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["applied", "accepted", "rejected", "interview", "shortlisted"], default: "applied" },
  appliedAt: { type: Date, default: Date.now },
}); 

const Application = mongoose.model("Application", applicationSchema);
export default Application;