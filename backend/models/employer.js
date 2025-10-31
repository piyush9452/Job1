
import mongoose from "mongoose";

const employer = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String,unique: true },
  createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  description: { type: String },
  profilePicture: { type: String },
  companyWebsite: { 
      type: String,
      trim: true
    },
    location: { 
      type: String 
    },
    industry: {
      type: String
    },
  ratingsReceived:[
        {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        }
    ]
    
},{
    // ADDED: This automatically handles 'createdAt' and 'updatedAt'
    timestamps: true 
  });



const Employer = mongoose.model("Employer", employer);

export default Employer;