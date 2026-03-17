import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  
  // CHANGED: Grid-based work days instead of single jobType string
  workDays: [{ 
    type: String, 
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
  }],
  
  skillsRequired: { type: [String], default: [] },
  
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: false 
    },
    coordinates: {
      type: [Number], 
      required: false, 
      index: '2dsphere',
      default: undefined 
    },
    address: { type: String, default: "Remote" } 
  },
  
  pinCode: { type: Number }, 
  
  // CHANGED: Consolidated salary handling
  salaryAmount: { type: Number, required: true }, 
  salaryFrequency: {
    type: String,
    enum: ["Hourly", "Daily", "Weekly", "Monthly", "Lump-Sum"],
    default: "Monthly"
  },
  
  durationType: { type: String, enum: ["Day", "Week", "Month"], required: false },
  startDate: { type: Date, default: null },
  
  // CHANGED: Long-term option for undefined end dates
  endDate: { type: Date, required: false, default: null },
  isLongTerm: { type: Boolean, default: false },
  
  // CHANGED: Multi-shift support (Replaces dailyWorkingHours, workFrom, workTo)
  shifts: [{
    shiftName: { type: String, required: true }, // e.g., "Shift 1", "Morning Shift"
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }],
  
  // CHANGED: Updated Exact Mode
  mode: { 
    type: String, 
    enum: ["Work from Home", "Work from Office/Field", "Hybrid"], 
    required: true 
  },
  
  noOfDays: { type: Number, required: false }, // Optional because long-term jobs don't have a set day count
  noOfPeopleRequired: { type: Number, required: true },
  genderPreference: { type: String, enum:["Male","Female","Other","No Preference"], default: "No Preference" },
  
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  postedByImage: { type: String }, 
  postedByName: { type: String },
  postedByCompany:{ type: String ,default: "" },
  postedAt: { type: Date, default: Date.now },
  expiringAt: { type: Date }, 
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
});

const Job = mongoose.model("Job", JobSchema);
export default Job;