import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title
  description: { type: String, required: true }, //
  jobType: { 
    type: String, 
    enum: ["Daily", "7 days", "Mon-Fri", "Sat-Sun", "Others"], 
    default: "Daily",
  },
  skillsRequired: { type: [String], default: [] },
  
  // FACT: Location is NOT required. Mongoose will completely ignore it if undefined, preventing 2dsphere index crashes for remote jobs.
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: false 
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: false, 
      index: '2dsphere',
      default: undefined // CRITICAL: Prevents Mongoose from saving `[]` which crashes the 2dsphere index
    },
    address: { type: String, default: "Remote" } // Safely defaults the text for the frontend to prevent UI crashes
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