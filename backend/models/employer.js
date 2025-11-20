
import mongoose from "mongoose";

const employer = new mongoose.Schema({


  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String,unique: true },
  companyName: { type: String},
  createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  description: { type: String },
  profilePicture: { type: String },
  companyWebsite: { 
      type: String,
      default: "",
      trim: true
    },
    location: { 
      type: String ,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    googleId: { type: String }, // To link to Google
  authProvider: { 
    type: String, 
    enum: ["local", "google"], 
    default: "local" 
  },
    isVerified: { type: Boolean, default: false },
  ratingsReceived:[
        {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        }
    ],
    verificationDocument: {
    type: String, // This will store the final S3 URL
    default: ""
  },
    
},{
    // ADDED: This automatically handles 'createdAt' and 'updatedAt'
    timestamps: true 
  });



const Employer = mongoose.model("Employer", employer);

export default Employer;