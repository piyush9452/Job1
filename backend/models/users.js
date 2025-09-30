import e from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number,unique: true },
  skills: [String],
  experience:[{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    company: { type: String },
    role: { type: String },
    duration: { type: String },
    description: { type: String }
  }],
  createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // jobs created by this user
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // jobs applied to
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resume: { type: String },
  description: { type: String },
  profilePicture: { type: String },
  employeeratings: [
        {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },  // reference to the job
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        }
    ],
  employerrating:[
        {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },  // reference to the job
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        }
    ]
});

const User = mongoose.model("User", userSchema);

export default User;