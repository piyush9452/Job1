import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title
  description: { type: String, required: true }, //
  jobType: { 
    type: String, 
    enum: ["Daily", "7 days", "Mon-Fri", "Sat-Sun", "Others"], 
    default: "Daily" ,
  },
  skillsRequired: { type: [String], default: [] },
  
  // --- FIXED LOCATION SCHEMA ---
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: false // FACT: Removed default: 'Point' to prevent Mongo 2dsphere crash when empty
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: false, // Changed to false
      index: '2dsphere' 
    },
    address: { type: String, required: false } // Changed to false
  },
  
  pinCode: { type: Number }, // optional
  salary: { type: Number, required: true }, // payment for the job
  salaryFrequency: {
    type: String,
    enum: ["Hourly", "Daily", "Weekly", "Monthly"],
    default: "Hourly"
  },
  durationType: { type: String, enum: ["Day", "Week", "Month"], required: true },
  startDate: { type: Date , default:null},
  endDate: { 
    type: Date, 
    required: false, 
    default: null 
  },
  dailyWorkingHours: { type: Number, required: true },
  mode: { type: String, enum: ["Work from Home", "Work from Office", "Hybrid"], required: true },
  workFrom: { type: String }, // optional
  workTo: { type: String }, // optional
  noOfDays: { type: Number, required: true },
  noOfPeopleRequired: { type: Number, required: true },
  genderPreference: { type: String, enum:["Male","Female","Other","No Preference"], default: "No Preference" },
  paymentPerHour: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  postedByImage: { type: String }, 
  postedByName: { type: String },
  postedByCompany:{type: String ,default: "" },
  postedAt: { type: Date, default: Date.now },
  expiringAt: { type: Date }, // optional
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who applied
});

const Job = mongoose.model("Job", JobSchema);
export default Job;