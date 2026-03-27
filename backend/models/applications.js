import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobHost: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // CHANGED: Added Interview Conducted
  status: { 
    type: String, 
    enum: [
      "applied", 
      "shortlisted", 
      "Interview Scheduled", 
      "Interview Conducted", // <-- NEW
      "Assignment Scheduled", 
      "hired", 
      "NCTT"
    ], 
    default: "applied" 
  },
  applicantHasSeen: { type: Boolean, default: true },
  employerMessage: { type: String, default: "" },
  appliedAt: { type: Date, default: Date.now },
}); 

const Application = mongoose.model("Application", applicationSchema);
export default Application;