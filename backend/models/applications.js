import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobHost: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  status: { 
    type: String, 
    enum: ["applied", "shortlisted", "Interview Scheduled", "Interview Conducted", "Assignment Scheduled", "hired", "NCTT"], 
    default: "applied" 
  },
  applicantHasSeen: { type: Boolean, default: true },
  employerMessage: { type: String, default: "" },
  applicantMessage: { type: String, default: "" }, 
  
  // FACT: Formal Two-Way Reschedule System
  rescheduleRequest: {
    isRequested: { type: Boolean, default: false },
    reason: { type: String, default: "" },
    proposedTime: { type: String, default: "" },
    requestStatus: { type: String, enum: ["pending", "approved", "rejected", "none"], default: "none" }
  },

  appliedAt: { type: Date, default: Date.now },
}); 

const Application = mongoose.model("Application", applicationSchema);
export default Application;