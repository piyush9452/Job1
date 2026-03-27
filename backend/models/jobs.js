import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 

  // CHANGED: Job Type is now a multi-select array
  jobType: [{
    type: String,
    enum: ["permanent", "temporary", "internship", "part-time", "full-time", "contractual", "freelance"]
  }],

  // CHANGED: Workdays pattern and custom input
  workDaysPattern: {
    type: String,
    enum: ["Mon to Fri", "Mon to Sat", "Sat to Sun", "Custom"]
  },
  customWorkDaysDescription: { type: String }, // For elaboration if "Custom" is selected

  skillsRequired: { type: [String], default: [] },
  
  location: {
    type: { type: String, enum: ['Point'], required: false },
    coordinates: { type: [Number], required: false, index: '2dsphere', default: undefined },
    address: { type: String, default: "Remote" } 
  },
  pinCode: { type: Number }, 
  
  salaryAmount: { type: Number, required: true }, 
  salaryFrequency: { type: String, enum: ["Hourly", "Daily", "Weekly", "Monthly", "Lump-Sum"], default: "Monthly" },
  
  // NEW: Incentives string
  incentives: { type: String, default: "" },
  
  durationType: { type: String, enum: ["Day", "Week", "Month"], required: false },
  startDate: { type: Date, default: null },
  endDate: { type: Date, required: false, default: null },
  isLongTerm: { type: Boolean, default: false },
  
  // CHANGED: Shifts + Flexible Timings Flag
  shifts: [{
    shiftName: { type: String, required: true }, 
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }],
  isFlexibleShifts: { type: Boolean, default: false },

  // CHANGED: Work Mode is now a multi-select array
  mode: [{ 
    type: String, 
    enum: ["Work from home", "Work from office", "Work from field"], 
  }],
  
  noOfDays: { type: Number, required: false }, 
  noOfPeopleRequired: { type: Number, required: true },
  genderPreference: { type: String, enum:["Male","Female","Other","No Preference"], default: "No Preference" },
  
  // NEW: Demographics & Qualifications
  qualifications: [{ type: String }], // e.g., "Graduation", "Any"
  courses: [{ type: String }], // e.g., "Commerce", "Arts", "Any"
  ageLimit: {
    min: { type: Number },
    max: { type: Number },
    isAny: { type: Boolean, default: false }
  },
  languages: [{ type: String }], // e.g., "Hindi", "English", "Any", or custom strings

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  postedByImage: { type: String }, 
  postedByName: { type: String },
  postedByCompany: { type: String, default: "" },
  postedAt: { type: Date, default: Date.now },
  expiringAt: { type: Date }, 
  
  // CHANGED: Soft Delete / Visibility Status
  status: { type: String, enum: ["active", "inactive", "closed"], default: "active" },
  
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
});

const Job = mongoose.model("Job", JobSchema);
export default Job;