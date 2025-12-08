import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title
  description: { type: String, required: true }, //
  jobType: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  skillsRequired: { type: [String], default: [] },
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude] - Mongo expects this order
      required: true,
      index: '2dsphere' // Crucial for "find nearby" queries later
    },
    address: { type: String, required: true } // The readable string (e.g. "HMP House, MP Nagar")
  },// city/area
  pinCode: { type: Number }, // optional
  salary: { type: Number, required: true }, // payment for the job
  durationType: { type: String, enum: ["Day", "Week", "Month"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dailyWorkingHours: { type: Number, required: true },
  mode: { type: String, enum: ["Online", "Offline", "Hybrid"], required: true },
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